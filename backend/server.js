import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

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

// 🔐 Auth middleware
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

// 📧 Contact Endpoint
app.post('/api/send-email', async (req, res) => {
     const { email } = req.body;
     if (!email) return res.status(400).json({ error: 'Email is required' });

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

// 🔐 Register
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
               role: 'user',
               books: [],
               movies: [],
               music: []
          });

          res.status(201).json({ message: 'User registered successfully', userId: result.insertedId });
     } catch (err) {
          res.status(500).json({ error: err.message });
     }
});

// 🔐 Login
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
          res.status(500).json({ error: err.message });
     }
});

// 📥 GET /api/users (with stats)
app.get('/api/users', authenticateToken, async (req, res) => {
     try {
          const totalUsers = await usersCollection().countDocuments();
          const recentUsers = await usersCollection().find().sort({ _id: -1 }).limit(5).toArray();

          res.json({
               totalUsers,
               revenue: (totalUsers * 35.5).toFixed(2),
               activeSessions: Math.floor(Math.random() * 500),
               recentUsers
          });
     } catch (err) {
          res.status(500).json({ error: err.message });
     }
});

// 📥 GET /api/music
app.get('/api/music', authenticateToken, async (req, res) => {
     try {
          const music = await musicCollection().find({}).toArray();
          res.json({ music });
     } catch (err) {
          res.status(500).json({ error: err.message });
     }
});

// 📥 GET /api/books
app.get('/api/books', authenticateToken, async (req, res) => {
     try {
          const books = await booksCollection().find({}).toArray();
          res.json({ books });
     } catch (err) {
          res.status(500).json({ error: err.message });
     }
});

// 📥 GET /api/movies
app.get('/api/movies', authenticateToken, async (req, res) => {
     try {
          const movies = await moviesCollection().find({}).toArray();
          res.json({ movies });
     } catch (err) {
          res.status(500).json({ error: err.message });
     }
});

// Get user's favorites
app.get('/api/favorites', authenticateToken, async (req, res) => {
     try {
          const user = await usersCollection().findOne({ _id: new ObjectId(req.user.id) });
          if (!user) {
               return res.status(404).json({ error: 'User not found' });
          }

          // Fetch full details for each favorite
          const movies = await moviesCollection()
               .find({ _id: { $in: user.movies } })
               .toArray();

          const books = await booksCollection()
               .find({ _id: { $in: user.books } })
               .toArray();

          const music = await musicCollection()
               .find({ _id: { $in: user.music } })
               .toArray();

          res.json({
               movies,
               books,
               music
          });
     } catch (err) {
          res.status(500).json({ error: err.message });
     }
});

// Add to Favorites endpoints
app.post('/api/favorites/movies/:movieId', authenticateToken, async (req, res) => {
     try {
          const result = await usersCollection().updateOne(
               { _id: new ObjectId(req.user.id) },
               { $addToSet: { movies: new ObjectId(req.params.movieId) } }
          );
          if (result.modifiedCount === 0) {
               return res.status(400).json({ error: 'Movie already in favorites' });
          }
          res.json({ message: 'Movie added to favorites' });
     } catch (err) {
          res.status(500).json({ error: err.message });
     }
});

app.post('/api/favorites/music/:musicId', authenticateToken, async (req, res) => {
     try {
          const result = await usersCollection().updateOne(
               { _id: new ObjectId(req.user.id) },
               { $addToSet: { music: new ObjectId(req.params.musicId) } }
          );
          if (result.modifiedCount === 0) {
               return res.status(400).json({ error: 'Music already in favorites' });
          }
          res.json({ message: 'Music added to favorites' });
     } catch (err) {
          res.status(500).json({ error: err.message });
     }
});

app.post('/api/favorites/books/:bookId', authenticateToken, async (req, res) => {
     try {
          const result = await usersCollection().updateOne(
               { _id: new ObjectId(req.user.id) },
               { $addToSet: { books: new ObjectId(req.params.bookId) } }
          );
          if (result.modifiedCount === 0) {
               return res.status(400).json({ error: 'Book already in favorites' });
          }
          res.json({ message: 'Book added to favorites' });
     } catch (err) {
          res.status(500).json({ error: err.message });
     }
});

app.listen(port, () => console.log(`🔥 Server running on port ${port}`));
