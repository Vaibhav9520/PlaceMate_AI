import express from 'express';
import { protect } from '../middleware/auth.js';
import Feedback from '../models_backup/Feedback.js';

const router = express.Router();

// @desc    Get feedback by interview ID
// @route   GET /api/feedback/:interviewId
// @access  Private
const getFeedback = async (req, res) => {
  try {
    const interviewId = req.params.interviewId;
    const userId = req.user._id;

    if (!interviewId || interviewId === 'undefined' || interviewId === 'local') {
      return res.status(400).json({
        success: false,
        message: 'Valid interview ID is required'
      });
    }

    // Validate it looks like a MongoDB ObjectId before querying
    if (!/^[a-fA-F0-9]{24}$/.test(interviewId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid interview ID format'
      });
    }

    const feedback = await Feedback.findOne({ interviewId: interviewId });

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found for this interview'
      });
    }

    console.log('✅ Feedback retrieved successfully');
    res.status(200).json({
      success: true,
      feedback: feedback.toObject()
    });

  } catch (error) {
    console.error('❌ Get feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting feedback',
      error: error.message
    });
  }
};

// Routes
router.get('/:interviewId', protect, getFeedback);

export default router;