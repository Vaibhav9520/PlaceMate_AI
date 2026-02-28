import express from 'express';
import { 
  createInterview, 
  getInterview, 
  getUserInterviews, 
  createPersonalizedInterview,
  finalizeInterview,
  deleteInterview,
  getAIResponse
} from '../controllers/interviewController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/create', protect, createInterview);
router.get('/:id', protect, getInterview);
router.get('/user/:userId', protect, getUserInterviews);
router.post('/personalized', protect, createPersonalizedInterview);
router.put('/:id/finalize', protect, finalizeInterview);
router.delete('/:id', protect, deleteInterview);
router.post('/ai-response', getAIResponse); // No auth for AI responses

export default router;
