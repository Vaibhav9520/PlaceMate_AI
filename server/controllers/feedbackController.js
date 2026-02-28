import { db } from '../config/database.js';
import { generateDetailedFeedback } from '../services/aiService.js';

// @desc    Generate feedback
// @route   POST /api/feedback/generate
// @access  Private
export const createFeedback = async (req, res) => {
  try {
    const { interviewId, answers, questions } = req.body;

    // Verify interview exists and belongs to user
    const interview = await db.interviews.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    const interviewUserId = interview.userId.toString ? interview.userId.toString() : interview.userId;
    const requestUserId = req.user._id.toString ? req.user._id.toString() : req.user._id;
    
    if (interviewUserId !== requestUserId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Generate AI feedback
    const feedbackData = await generateDetailedFeedback({
      answers,
      questions: questions || interview.questions
    });

    // Create feedback document
    const feedback = await db.feedback.create({
      userId: req.user._id,
      interviewId,
      overallScore: feedbackData.overallScore,
      communicationScore: feedbackData.communicationScore,
      technicalScore: feedbackData.technicalScore,
      confidenceScore: feedbackData.confidenceScore,
      strengths: feedbackData.strengths,
      weaknesses: feedbackData.weaknesses,
      detailedAnalysis: feedbackData.detailedAnalysis,
      improvementSuggestions: feedbackData.improvementSuggestions,
      answers,
      categoryBreakdown: feedbackData.categoryBreakdown
    });

    // Update user statistics
    await updateUserStats(req.user._id, feedbackData.overallScore);

    res.status(201).json({
      success: true,
      message: 'Feedback generated successfully',
      feedback: {
        id: feedback._id,
        interviewId: feedback.interviewId,
        overallScore: feedback.overallScore,
        communicationScore: feedback.communicationScore,
        technicalScore: feedback.technicalScore,
        confidenceScore: feedback.confidenceScore,
        strengths: feedback.strengths,
        weaknesses: feedback.weaknesses,
        detailedAnalysis: feedback.detailedAnalysis,
        improvementSuggestions: feedback.improvementSuggestions,
        categoryBreakdown: feedback.categoryBreakdown,
        createdAt: feedback.createdAt
      }
    });
  } catch (error) {
    console.error('Create feedback error:', error);
    res.status(500).json({ message: 'Server error during feedback generation' });
  }
};

// @desc    Get feedback by ID
// @route   GET /api/feedback/:id
// @access  Private
export const getFeedback = async (req, res) => {
  try {
    const feedback = await db.feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    const feedbackUserId = feedback.userId.toString ? feedback.userId.toString() : feedback.userId;
    const requestUserId = req.user._id.toString ? req.user._id.toString() : req.user._id;
    
    if (feedbackUserId !== requestUserId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({
      success: true,
      feedback: {
        id: feedback._id,
        interviewId: feedback.interviewId,
        overallScore: feedback.overallScore,
        communicationScore: feedback.communicationScore,
        technicalScore: feedback.technicalScore,
        confidenceScore: feedback.confidenceScore,
        strengths: feedback.strengths,
        weaknesses: feedback.weaknesses,
        detailedAnalysis: feedback.detailedAnalysis,
        improvementSuggestions: feedback.improvementSuggestions,
        answers: feedback.answers,
        categoryBreakdown: feedback.categoryBreakdown,
        createdAt: feedback.createdAt
      }
    });
  } catch (error) {
    console.error('Get feedback error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get feedback by interview ID
// @route   GET /api/feedback/interview/:interviewId
// @access  Private
export const getFeedbackByInterview = async (req, res) => {
  try {
    const feedbacks = await db.feedback.find({ interviewId: req.params.interviewId });
    const feedback = feedbacks.find(f => {
      const feedbackUserId = f.userId.toString ? f.userId.toString() : f.userId;
      const requestUserId = req.user._id.toString ? req.user._id.toString() : req.user._id;
      return feedbackUserId === requestUserId;
    });

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    res.json({
      success: true,
      feedback: {
        id: feedback._id,
        interviewId: feedback.interviewId,
        overallScore: feedback.overallScore,
        communicationScore: feedback.communicationScore,
        technicalScore: feedback.technicalScore,
        confidenceScore: feedback.confidenceScore,
        strengths: feedback.strengths,
        weaknesses: feedback.weaknesses,
        detailedAnalysis: feedback.detailedAnalysis,
        improvementSuggestions: feedback.improvementSuggestions,
        categoryBreakdown: feedback.categoryBreakdown,
        createdAt: feedback.createdAt
      }
    });
  } catch (error) {
    console.error('Get feedback by interview error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Helper function to update user statistics
const updateUserStats = async (userId, newScore) => {
  try {
    const user = await db.users.findById(userId);
    
    if (user) {
      const totalInterviews = (user.totalInterviews || 0) + 1;
      const currentAverage = user.averageScore || 0;
      const newAverage = ((currentAverage * (totalInterviews - 1)) + newScore) / totalInterviews;
      
      await db.users.update(userId, {
        totalInterviews,
        averageScore: Math.round(newAverage),
        lastInterviewDate: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Error updating user stats:', error);
  }
};
