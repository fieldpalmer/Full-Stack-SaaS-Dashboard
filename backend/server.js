import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

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
      db = client.db('sample_mflix');
      console.log('🔥 MongoDB Connected');
   } catch (error) {
      console.error('❌ MongoDB Connection Error:', error);
   }
}
connectDB();

const usersCollection = () => db.collection('users');
const moviesCollection = () => db.collection('movies');

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
      alert('login failed');
      res.status(500).json({ error: err.message });
   }
});

app.get('/dashboard', authenticateToken, async (req, res) => {
   try {
      const users = await usersCollection().find().toArray();
      res.json(users);
   } catch (err) {
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
      // const page = parseInt(req.query.page) || 1;
      // const limit = parseInt(req.query.limit) || 100;
      // const skip = (page - 1) * limit;
      const sortField = req.query.sortField || 'year';
      const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
      const genreFilter = req.query.genre ? { genres: req.query.genre } : {};
      const ratingFilter = req.query.rating ? { rated: req.query.rating } : {};
      const yearFilter = req.query.year ? { year: parseInt(req.query.year) } : {};

      // ✅ Exclude documents where any required field is missing
      const requiredFieldsFilter = {
         title: { $exists: true, $ne: null },
         year: { $exists: true, $ne: null },
         runtime: { $exists: true, $ne: null },
         genres: { $exists: true, $ne: null, $not: { $size: 0 } }, // Ensure genres array is not empty
         directors: { $exists: true, $ne: null, $not: { $size: 0 } }, // Ensure directors array is not empty
         rated: { $exists: true, $ne: null },
         'tomatoes.viewer.meter': { $exists: true, $ne: null },
         plot: { $exists: true, $ne: null },
         cast: { $exists: true, $ne: null, $not: { $size: 0 } }, // Ensure cast array is not empty
         poster: { $exists: true, $ne: null },
         languages: { $exists: true, $ne: null, $not: { $size: 0 } }, // Ensure languages array is not empty
         countries: { $exists: true, $ne: null, $not: { $size: 0 } } // Ensure countries array is not empty
      };

      // ✅ Merge filters
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
         // .skip(skip)
         // .limit(limit)
         .toArray();

      // const totalMovies = await moviesCollection.countDocuments(filterQuery);

      res.json({
         movies: movies.map((movie) => ({
            _id: movie._id,
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
         // totalPages: Math.ceil(totalMovies / limit),
         // currentPage: page
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

app.get('/api/actors', authenticateToken, async (req, res) => {
   try {
      const moviesCollection = db.collection('movies');

      const actorsAggregation = await moviesCollection
         .aggregate([
            { $unwind: '$cast' },
            {
               $group: {
                  _id: '$cast',
                  movieCount: { $sum: 1 },
                  avgRuntime: { $avg: '$runtime' },
                  avgRating: { $avg: '$tomatoes.viewer.meter' },
                  years: { $push: '$year' }
               }
            },
            { $sort: { movieCount: -1 } },
            { $limit: 50 }
         ])
         .toArray();

      // Calculate median year
      actorsAggregation.forEach((actor) => {
         const sortedYears = actor.years.filter((y) => y).sort((a, b) => a - b);
         actor.medianYear = sortedYears.length ? sortedYears[Math.floor(sortedYears.length / 2)] : 'N/A';
         delete actor.years;
      });

      res.json(actorsAggregation);
   } catch (err) {
      console.error('❌ Error fetching actors:', err.message);
      res.status(500).json({ error: err.message });
   }
});

app.get('/api/directors', authenticateToken, async (req, res) => {
   try {
      const moviesCollection = db.collection('movies');

      const directorsAggregation = await moviesCollection
         .aggregate([
            { $unwind: '$directors' },
            {
               $group: {
                  _id: '$directors',
                  movieCount: { $sum: 1 },
                  avgRuntime: { $avg: '$runtime' },
                  avgRating: { $avg: '$tomatoes.viewer.meter' },
                  years: { $push: '$year' }
               }
            },
            { $sort: { movieCount: -1 } },
            { $limit: 50 }
         ])
         .toArray();

      // Calculate median year
      directorsAggregation.forEach((director) => {
         const sortedYears = director.years.filter((y) => y).sort((a, b) => a - b);
         director.medianYear = sortedYears.length ? sortedYears[Math.floor(sortedYears.length / 2)] : 'N/A';
         delete director.years;
      });

      res.json(directorsAggregation);
   } catch (err) {
      console.error('❌ Error fetching directors:', err.message);
      res.status(500).json({ error: err.message });
   }
});

app.get('/api/genres', authenticateToken, async (req, res) => {
   try {
      const moviesCollection = db.collection('movies');

      const genresAggregation = await moviesCollection
         .aggregate([
            { $unwind: '$genres' },
            {
               $group: {
                  _id: '$genres',
                  movieCount: { $sum: 1 },
                  avgRuntime: { $avg: '$runtime' },
                  avgRating: { $avg: '$tomatoes.viewer.meter' },
                  years: { $push: '$year' }
               }
            },
            { $sort: { movieCount: -1 } }
         ])
         .toArray();

      // Calculate median year
      genresAggregation.forEach((genre) => {
         const sortedYears = genre.years.filter((y) => y).sort((a, b) => a - b);
         genre.medianYear = sortedYears.length ? sortedYears[Math.floor(sortedYears.length / 2)] : 'N/A';
         delete genre.years;
      });

      res.json(genresAggregation);
   } catch (err) {
      console.error('❌ Error fetching genres:', err.message);
      res.status(500).json({ error: err.message });
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
