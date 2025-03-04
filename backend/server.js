import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

dotenv.config();
const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
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
      const movies = await db.collection('movies').find().toArray();
      res.json(movies);
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
});

app.get('/api/movie-stats', authenticateToken, async (req, res) => {
   try {
      const moviesCollection = db.collection('movies');
      if (!moviesCollection) {
         throw new Error('Database connection is not established.');
      }

      // Log when API starts
      console.log('Fetching movie statistics...');

      // Get total count of movies
      const totalMovies = await moviesCollection.countDocuments();
      console.log('Total movies:', totalMovies);

      // Calculate average runtime
      const runtimeAggregation = await moviesCollection
         .aggregate([
            { $match: { runtime: { $gt: 0 } } },
            { $group: { _id: null, avgRuntime: { $avg: '$runtime' } } }
         ])
         .toArray();
      const avgRuntime = runtimeAggregation.length
         ? runtimeAggregation[0].avgRuntime.toFixed(2)
         : '0';
      console.log('Average runtime:', avgRuntime);

      // Calculate average rating (from `tomatoes.viewer.meter`)
      const ratingAggregation = await moviesCollection
         .aggregate([
            { $match: { 'tomatoes.viewer.meter': { $gt: 0 } } },
            { $group: { _id: null, avgRating: { $avg: '$tomatoes.viewer.meter' } } }
         ])
         .toArray();
      const avgRating = ratingAggregation.length ? ratingAggregation[0].avgRating.toFixed(2) : '0';
      console.log('Average rating:', avgRating);

      // Aggregate runtime data over years for the line chart
      const runtimeOverYears = await moviesCollection
         .aggregate([
            { $match: { year: { $gte: 1900 }, runtime: { $gt: 0 } } },
            { $group: { _id: '$year', avgRuntime: { $avg: '$runtime' } } },
            { $sort: { _id: 1 } }
         ])
         .toArray();

      console.log('Runtime data fetched:', runtimeOverYears.length, 'entries');

      res.json({
         totalMovies,
         avgRuntime,
         avgRating,
         runtimeOverYears
      });
   } catch (err) {
      console.error('❌ Error fetching movie stats:', err.message);
      res.status(500).json({ error: err.message });
   }
});

// ✅ Middleware for Authentication
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
