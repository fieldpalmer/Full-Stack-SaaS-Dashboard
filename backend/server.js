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
      db = client.db('saas_dashboard'); // Change to your database name
      console.log('🔥 MongoDB Connected');
   } catch (error) {
      console.error('❌ MongoDB Connection Error:', error);
   }
}
connectDB();

// User Collection Reference
const usersCollection = () => db.collection('users');

// ✅ Register User
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

// ✅ Login User
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

// ✅ Protected Route Example
app.get('/dashboard', authenticateToken, async (req, res) => {
   try {
      const users = await usersCollection().find().toArray();
      res.json(users);
   } catch (err) {
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
