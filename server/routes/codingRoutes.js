import express from 'express';
import { generateQuestions, runCode, submitSolution } from '../controllers/codingController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Generate questions - public for testing, can be protected later
router.post('/generate-questions', generateQuestions);
// Run code - public for testing, can be protected later
router.post('/run', runCode);
router.post('/submit', protect, submitSolution);

export default router;
