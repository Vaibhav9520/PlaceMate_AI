import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import codingRoutes from './routes/codingRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import setupDNS from './setup-dns.js';

// Load env vars
dotenv.config();

// Setup DNS for MongoDB Atlas connectivity
setupDNS();

// Database connection - MongoDB only
const USE_MONGODB = process.env.USE_MONGODB === 'true';

if (!USE_MONGODB) {
  console.error('❌ File-based database is deprecated. Please set USE_MONGODB=true in .env');
  process.exit(1);
}

try {
  const connected = await connectDB();
  if (connected) {
    console.log('✅ MongoDB will be used for data storage');
  } else {
    console.error('❌ Failed to connect to MongoDB. Please check your connection.');
    process.exit(1);
  }
} catch (err) {
  console.error('❌ MongoDB connection error:', err.message);
  process.exit(1);
}

const app = express();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/coding', codingRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/feedback', feedbackRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'PlaceMate AI Server is running',
    timestamp: new Date().toISOString()
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server Error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
