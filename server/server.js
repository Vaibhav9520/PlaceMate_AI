import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectSimpleDB } from './config/simpleDB.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import codingRoutes from './routes/codingRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Load env vars
dotenv.config();

// Initialize file-based database immediately (always available as fallback)
await connectSimpleDB();

// Database connection
const USE_MONGODB = process.env.USE_MONGODB === 'true';

if (USE_MONGODB) {
  console.log('🔄 Attempting to connect to MongoDB Atlas...');
  import('./config/db.js').then(async ({ default: connectDB }) => {
    const connected = await connectDB();
    if (connected) {
      console.log('✅ MongoDB will be used for data storage');
    } else {
      console.log('📦 File-based database will be used for data storage');
    }
  }).catch(err => {
    console.error('❌ MongoDB module error:', err.message);
    console.log('📦 File-based database will be used for data storage');
  });
} else {
  console.log('📦 File-based database configured (MongoDB disabled)');
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
