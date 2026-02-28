import express from 'express';
import { createFeedback, getFeedback, getFeedbackByInterview } from '../controllers/feedbackController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/generate', protect, createFeedback);
router.get('/:id', protect, getFeedback);
router.get('/interview/:interviewId', protect, getFeedbackByInterview);

export default router;
