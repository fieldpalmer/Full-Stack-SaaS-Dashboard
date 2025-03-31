import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import axios from 'axios';

dotenv.config();
const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGO_URI);
let db;

async function connectDB() {
     try {
          await client.connect();
          db = client.db('saas_dashboard');
          console.log('🔥 MongoDB Connected');
     } catch (error) {
          console.error('❌ MongoDB Connection Error:', error);
     }
}
connectDB();

const usersCollection = () => db.collection('users');
const moviesCollection = () => db.collection('movies');
const musicCollection = () => db.collection('music');
const booksCollection = () => db.collection('books');

app.post('/api/send-email', async (req, res) => {
     const { email } = req.body;

     if (!email) {
          return res.status(400).json({ error: 'Email is required' });
     }

     try {
          const transporter = nodemailer.createTransport({
               service: 'gmail',
               auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
               }
          });

          const mailOptions = {
               from: process.env.EMAIL_USER,
               to: 'gfieldpalmer@gmail.com',
               subject: 'New Data Automations Demo Request',
               text: `A user signed up with this email: ${email}`
          };

          await transporter.sendMail(mailOptions);

          res.status(200).json({ message: 'Email sent successfully!' });
     } catch (error) {
          console.error('Error sending email:', error);
          res.status(500).json({ error: 'Failed to send email' });
     }
});

app.post('/register', async (req, res) => {
     const { name, email, password } = req.body;
     const hashedPassword = await bcrypt.hash(password, 10);

     try {
          const existingUser = await usersCollection().findOne({ email });
          if (existingUser) return res.status(400).json({ error: 'Email already in use' });

          const result = await usersCollection().insertOne({
               name,
               email,
               password: hashedPassword,
               role: 'user'
          });
          res.status(201).json({ message: 'User registered successfully', userId: result.insertedId });
     } catch (err) {
          res.status(500).json({ error: err.message });
     }
});

app.post('/login', async (req, res) => {
     const { email, password } = req.body;

     try {
          const user = await usersCollection().findOne({ email });
          if (!user) return res.status(401).json({ error: 'Invalid credentials' });

          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

          const token = jwt.sign({ id: user._id.toString(), role: user.role }, process.env.JWT_SECRET, {
               expiresIn: '1h'
          });

          res.json({
               message: 'Login successful',
               token,
               user: { id: user._id, name: user.name, email: user.email, role: user.role }
          });
     } catch (err) {
          // res.status(401).json({ message: 'Login failed' });
          res.status(500).json({ error: err.message });
     }
});

app.get('/api/users', authenticateToken, async (req, res) => {
     try {
          const totalUsers = await usersCollection().countDocuments();
          const recentUsers = await usersCollection().find().sort({ _id: -1 }).limit(5).toArray();

          res.json({
               totalUsers,
               revenue: (totalUsers * 35.5).toFixed(2), // sample revenue calculation
               activeSessions: Math.floor(Math.random() * 500), // Mock active session count
               recentUsers
          });
     } catch (err) {
          res.status(500).json({ error: err.message });
     }
});

app.get('/api/movies', authenticateToken, async (req, res) => {
     try {
          const moviesCollection = db.collection('movies');
          const sortField = req.query.sortField || 'year';
          const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
          const genreFilter = req.query.genre ? { genres: req.query.genre } : {};
          const ratingFilter = req.query.rating ? { rated: req.query.rating } : {};
          const yearFilter = req.query.year ? { year: parseInt(req.query.year) } : {};

          const requiredFieldsFilter = {
               title: { $exists: true, $ne: null },
               year: { $exists: true, $ne: null },
               runtime: { $exists: true, $ne: null },
               genres: { $exists: true, $ne: null, $not: { $size: 0 } },
               directors: { $exists: true, $ne: null, $not: { $size: 0 } },
               rated: { $exists: true, $ne: null },
               'tomatoes.viewer.meter': { $exists: true, $ne: null },
               plot: { $exists: true, $ne: null },
               cast: { $exists: true, $ne: null, $not: { $size: 0 } },
               poster: { $exists: true, $ne: null },
               languages: { $exists: true, $ne: null, $not: { $size: 0 } },
               countries: { $exists: true, $ne: null, $not: { $size: 0 } }
          };

          const filterQuery = {
               ...genreFilter,
               ...ratingFilter,
               ...yearFilter,
               ...requiredFieldsFilter
          };

          const movies = await moviesCollection
               .find(filterQuery, {
                    projection: {
                         _id: 1,
                         title: 1,
                         year: 1,
                         runtime: 1,
                         genres: 1,
                         directors: 1,
                         rated: 1,
                         'tomatoes.viewer.meter': 1,
                         plot: 1,
                         cast: 1,
                         poster: 1,
                         languages: 1,
                         countries: 1
                    }
               })
               .sort({ [sortField]: sortOrder })
               .toArray();

          res.json({
               movies: movies.map((movie) => ({
                    _id: movie._id,
                    seen: false,
                    title: movie.title,
                    year: movie.year,
                    runtime: movie.runtime,
                    genres: movie.genres,
                    directors: movie.directors,
                    rated: movie.rated,
                    viewerTomatoesRating: movie.tomatoes?.viewer?.meter || 'N/A',
                    plot: movie.plot,
                    cast: movie.cast,
                    poster: movie.poster,
                    languages: movie.languages,
                    countries: movie.countries
               }))
          });
     } catch (err) {
          console.error('❌ Error fetching movies:', err.message);
          res.status(500).json({ error: err.message });
     }
});

app.get('/api/movie-stats', authenticateToken, async (req, res) => {
     try {
          const moviesCollection = db.collection('movies');
          if (!moviesCollection) {
               throw new Error('Database connection is not established.');
          }

          console.log('Fetching movie statistics...');

          const startYear = parseInt(req.query.startYear) || 1900;
          const endYear = parseInt(req.query.endYear) || new Date().getFullYear();

          console.log(`Filtering data between ${startYear} and ${endYear}...`);

          const yearAggregation = await moviesCollection
               .aggregate([
                    { $match: { year: { $exists: true, $gte: startYear, $lte: endYear } } },
                    {
                         $group: {
                              _id: null,
                              minYear: { $min: '$year' },
                              maxYear: { $max: '$year' }
                         }
                    }
               ])
               .toArray();

          const minYear = yearAggregation.length ? yearAggregation[0].minYear : startYear;
          const maxYear = yearAggregation.length ? yearAggregation[0].maxYear : endYear;

          const runtimeAggregation = await moviesCollection
               .aggregate([
                    { $match: { year: { $gte: startYear, $lte: endYear }, runtime: { $gt: 0 } } },
                    { $group: { _id: null, avgRuntime: { $avg: '$runtime' } } }
               ])
               .toArray();
          const avgRuntime = runtimeAggregation.length ? runtimeAggregation[0].avgRuntime.toFixed(2) : '0';

          const ratingAggregation = await moviesCollection
               .aggregate([
                    {
                         $match: {
                              year: { $gte: startYear, $lte: endYear },
                              'tomatoes.viewer.meter': { $gt: 0 }
                         }
                    },
                    { $group: { _id: null, avgRating: { $avg: '$tomatoes.viewer.meter' } } }
               ])
               .toArray();
          const avgRating = ratingAggregation.length ? ratingAggregation[0].avgRating.toFixed(2) : '0';

          const runtimeOverYears = await moviesCollection
               .aggregate([
                    { $match: { year: { $gte: startYear, $lte: endYear }, runtime: { $gt: 0 } } },
                    { $group: { _id: '$year', avgRuntime: { $avg: '$runtime' } } },
                    { $sort: { _id: 1 } }
               ])
               .toArray();

          console.log('Runtime data fetched:', runtimeOverYears.length, 'entries');

          const topRatedMovies = await moviesCollection
               .find({
                    year: { $gte: startYear, $lte: endYear },
                    'tomatoes.viewer.meter': { $exists: true }
               })
               .sort({ 'tomatoes.viewer.meter': -1 })
               .limit(10)
               .project({ title: 1, year: 1, 'tomatoes.viewer.meter': 1 })
               .toArray();

          const topGenres = await moviesCollection
               .aggregate([
                    { $match: { year: { $gte: startYear, $lte: endYear } } },
                    { $unwind: '$genres' },
                    {
                         $group: {
                              _id: '$genres',
                              count: { $sum: 1 }
                         }
                    },
                    { $sort: { count: -1 } },
                    { $limit: 10 }
               ])
               .toArray();

          const longestMovies = await moviesCollection
               .find({ year: { $gte: startYear, $lte: endYear }, runtime: { $gt: 0 } })
               .sort({ runtime: -1 })
               .limit(10)
               .project({ title: 1, year: 1, runtime: 1 })
               .toArray();

          const genreAverages = await moviesCollection
               .aggregate([
                    {
                         $match: {
                              year: { $gte: startYear, $lte: endYear },
                              'tomatoes.viewer.meter': { $exists: true }
                         }
                    },
                    { $unwind: '$genres' },
                    {
                         $group: {
                              _id: '$genres',
                              avgRating: { $avg: '$tomatoes.viewer.meter' }
                         }
                    },
                    { $sort: { avgRating: -1 } }
               ])
               .toArray();

          const formattedGenreAverages = genreAverages.map((g) => ({
               genre: g._id,
               avgRating: Math.round(g.avgRating * 10) / 10
          }));

          console.log(`Filtered Genre Averages (${startYear}-${endYear}):`, formattedGenreAverages.length, 'genres');

          res.json({
               totalMovies: await moviesCollection.countDocuments({
                    year: { $gte: startYear, $lte: endYear }
               }),
               minYear,
               maxYear,
               avgRuntime,
               avgRating,
               runtimeOverYears,
               topRatedMovies,
               topGenres,
               longestMovies,
               genreAverages: formattedGenreAverages
          });
     } catch (err) {
          console.error('❌ Error fetching movie stats:', err.message);
          res.status(500).json({ error: err.message });
     }
});

app.get('/api/music', authenticateToken, async (req, res) => {
     try {
          const spotifyToken = req.header('Spotify-Token');
          if (!spotifyToken) {
               return res.status(401).json({ error: 'Spotify token is required' });
          }

          const timeRange = req.query.time_range || 'medium_term'; // short_term, medium_term, or long_term
          const limit = Math.min(parseInt(req.query.limit) || 50, 50); // Spotify's max is 50
          const offset = parseInt(req.query.offset) || 0;

          const response = await axios.get('https://api.spotify.com/v1/me/top/artists', {
               headers: {
                    Authorization: `Bearer ${spotifyToken}`,
                    'Content-Type': 'application/json'
               },
               params: {
                    time_range,
                    limit,
                    offset
               }
          });

          const artists = response.data.items.map((artist) => ({
               id: artist.id,
               name: artist.name,
               type: artist.type,
               genres: artist.genres || [],
               image: artist.images?.[0]?.url || null,
               popularity: artist.popularity || 0,
               followers: artist.followers?.total || 0,
               spotify_url: artist.external_urls?.spotify || null
          }));

          res.json({
               artists,
               total: response.data.total,
               limit: response.data.limit,
               offset: response.data.offset,
               next: response.data.next,
               previous: response.data.previous
          });
     } catch (error) {
          console.error('Error fetching top artists:', error.response?.data || error.message);
          res.status(error.response?.status || 500).json({
               error: error.response?.data?.error?.message || 'Failed to fetch top artists'
          });
     }
});

function authenticateToken(req, res, next) {
     const token = req.header('Authorization')?.split(' ')[1];
     if (!token) return res.status(401).json({ error: 'Unauthorized' });

     try {
          const verified = jwt.verify(token, process.env.JWT_SECRET);
          req.user = verified;
          next();
     } catch (err) {
          res.status(403).json({ error: 'Invalid token' });
     }
}

// Start Server
app.listen(port, () => console.log(`🔥 Server running on port ${port}`));
