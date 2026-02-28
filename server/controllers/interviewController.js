import { db } from '../config/database.js';
import { generatePersonalizedQuestions } from '../services/aiService.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;

// @desc    Create new interview
// @route   POST /api/interviews/create
// @access  Private
export const createInterview = async (req, res) => {
  try {
    const { role, level, type, techstack, questions } = req.body;

    const interview = await db.interviews.create({
      userId: req.user._id,
      role: role || '',
      level: level || '',
      type: type || 'quick',
      techstack: techstack || [],
      questions: questions || [],
      finalized: false
    });

    res.status(201).json({
      success: true,
      message: 'Interview created successfully',
      interview: {
        id: interview._id,
        userId: interview.userId,
        role: interview.role,
        level: interview.level,
        type: interview.type,
        techstack: interview.techstack,
        questions: interview.questions,
        finalized: interview.finalized,
        createdAt: interview.createdAt
      }
    });
  } catch (error) {
    console.error('Create interview error:', error);
    res.status(500).json({ message: 'Server error during interview creation' });
  }
};

// @desc    Get interview by ID
// @route   GET /api/interviews/:id
// @access  Private
export const getInterview = async (req, res) => {
  try {
    const interview = await db.interviews.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    // Check if user owns this interview
    const interviewUserId = interview.userId.toString ? interview.userId.toString() : interview.userId;
    const requestUserId = req.user._id.toString ? req.user._id.toString() : req.user._id;
    
    if (interviewUserId !== requestUserId) {
      return res.status(403).json({ message: 'Not authorized to access this interview' });
    }

    res.json({
      success: true,
      interview: {
        id: interview._id,
        userId: interview.userId,
        role: interview.role,
        level: interview.level,
        type: interview.type,
        techstack: interview.techstack,
        questions: interview.questions,
        finalized: interview.finalized,
        createdAt: interview.createdAt
      }
    });
  } catch (error) {
    console.error('Get interview error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user's interviews
// @route   GET /api/interviews/user/:userId
// @access  Private
export const getUserInterviews = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const interviews = await db.interviews.find({ userId: req.user._id });
    const limitedInterviews = interviews.slice(0, limit);

    res.json({
      success: true,
      count: limitedInterviews.length,
      interviews: limitedInterviews.map(interview => ({
        id: interview._id,
        role: interview.role,
        level: interview.level,
        type: interview.type,
        techstack: interview.techstack,
        finalized: interview.finalized,
        createdAt: interview.createdAt
      }))
    });
  } catch (error) {
    console.error('Get user interviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create personalized interview
// @route   POST /api/interviews/personalized
// @access  Private
export const createPersonalizedInterview = async (req, res) => {
  try {
    const { role, level, techstack, questionCount, interviewType } = req.body;

    // Get user data for CV analysis
    const user = await db.users.findById(req.user._id);

    if (!user.cvURL) {
      return res.status(400).json({ message: 'Please upload your CV first' });
    }

    console.log('📋 Creating personalized interview:', { role, level, interviewType, questionCount });

    // Generate personalized questions
    const questions = await generatePersonalizedQuestions({
      skills: user.skills,
      education: user.education,
      experience: user.experience,
      projects: user.projects,
      role,
      level,
      techstack,
      questionCount: questionCount || 10,
      interviewType: interviewType || 'mixed'
    });

    console.log(`✅ Generated ${questions.length} questions`);

    // Create interview
    const interview = await db.interviews.create({
      userId: req.user._id,
      role,
      level,
      type: 'personalized',
      techstack: techstack || [],
      questions,
      finalized: false
    });

    res.status(201).json({
      success: true,
      message: 'Personalized interview created successfully',
      interview: {
        id: interview._id,
        role: interview.role,
        level: interview.level,
        type: interview.type,
        techstack: interview.techstack,
        questions: interview.questions,
        createdAt: interview.createdAt
      }
    });
  } catch (error) {
    console.error('Create personalized interview error:', error);
    res.status(500).json({ message: 'Server error during personalized interview creation' });
  }
};

// @desc    Finalize interview
// @route   PUT /api/interviews/:id/finalize
// @access  Private
export const finalizeInterview = async (req, res) => {
  try {
    const interview = await db.interviews.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    const interviewUserId = interview.userId.toString ? interview.userId.toString() : interview.userId;
    const requestUserId = req.user._id.toString ? req.user._id.toString() : req.user._id;
    
    if (interviewUserId !== requestUserId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updated = await db.interviews.update(req.params.id, { finalized: true });

    res.json({
      success: true,
      message: 'Interview finalized successfully',
      interview: {
        id: updated._id,
        finalized: updated.finalized
      }
    });
  } catch (error) {
    console.error('Finalize interview error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete interview
// @route   DELETE /api/interviews/:id
// @access  Private
export const deleteInterview = async (req, res) => {
  try {
    const interview = await db.interviews.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    const interviewUserId = interview.userId.toString ? interview.userId.toString() : interview.userId;
    const requestUserId = req.user._id.toString ? req.user._id.toString() : req.user._id;
    
    if (interviewUserId !== requestUserId) {
      return res.status(403).json({ message: 'Not authorized to delete this interview' });
    }

    await db.interviews.delete(req.params.id);

    res.json({
      success: true,
      message: 'Interview deleted successfully'
    });
  } catch (error) {
    console.error('Delete interview error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// @desc    Get AI response for conversational interview
// @route   POST /api/interviews/ai-response
// @access  Public (for now)
export const getAIResponse = async (req, res) => {
  try {
    const { prompt } = req.body;

    console.log('🤖 AI Response Request received');
    console.log('📝 Prompt:', prompt.substring(0, 100) + '...');

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.log('❌ No Gemini API key found');
      return res.json({
        success: true,
        response: 'Thank you for that answer. Let me ask you the next question.'
      });
    }

    // Use Gemini 2.5 Flash (fastest and most stable)
    try {
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-2.5-flash',
        generationConfig: {
          temperature: 0.3,  // Lower temperature for more consistent responses
          maxOutputTokens: 100,
        }
      });
      
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      console.log('✅ Gemini response:', text.substring(0, 100));
      return res.json({
        success: true,
        response: text.trim()
      });
    } catch (geminiError) {
      console.log('❌ Gemini error:', geminiError.message);
      
      // Simple fallback
      return res.json({
        success: true,
        response: 'Thank you for that answer. Let me ask you the next question.'
      });
    }

  } catch (error) {
    console.error('❌ AI response error:', error.message);
    res.json({ 
      success: true,
      response: 'Thank you for sharing that. Let\'s continue with the next question.'
    });
  }
};

// Intelligent fallback responses based on conversation context
function getFallbackResponse(conversationHistory) {
  const conversationLength = conversationHistory?.length || 0;
  
  // Introduction phase
  if (conversationLength <= 2) {
    return "Thank you for that introduction. Can you tell me more about your technical background and the projects you've worked on?";
  }
  
  // Technical phase
  if (conversationLength <= 6) {
    const technicalFollowUps = [
      "That's interesting. What specific challenges did you face in that project and how did you overcome them?",
      "Can you elaborate on the technical decisions you made? What alternatives did you consider?",
      "How did you ensure code quality and maintainability in that project?",
      "What was the most difficult bug you encountered and how did you debug it?",
      "Tell me about your approach to testing and deployment for that project."
    ];
    return technicalFollowUps[conversationLength % technicalFollowUps.length];
  }
  
  // Behavioral phase
  if (conversationLength <= 10) {
    const behavioralFollowUps = [
      "That's great. How do you handle working under tight deadlines?",
      "Can you describe a time when you had to collaborate with a difficult team member?",
      "What's your approach to learning new technologies?",
      "How do you stay updated with the latest industry trends?",
      "Where do you see yourself in the next few years?"
    ];
    return behavioralFollowUps[conversationLength % behavioralFollowUps.length];
  }
  
  // Closing
  return "Thank you for your time today. That completes our interview. You'll receive detailed feedback shortly.";
}
