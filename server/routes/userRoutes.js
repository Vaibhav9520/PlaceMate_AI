import express from 'express';
import { getProfile, updateProfile, uploadCV, getUserStats, generatePersonalizedInterview } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'cv-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, and DOCX files are allowed'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/upload-cv', protect, upload.single('cv'), uploadCV);
router.get('/stats', protect, getUserStats);
router.post('/generate-interview', protect, generatePersonalizedInterview);

export default router;
