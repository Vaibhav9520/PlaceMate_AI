import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load interview questions
const loadInterviewQuestions = () => {
  try {
    const questionsPath = path.join(__dirname, '../data/interview-questions.json');
    const questionsData = fs.readFileSync(questionsPath, 'utf8');
    return JSON.parse(questionsData);
  } catch (error) {
    console.error('Error loading interview questions:', error);
    return null;
  }
};

// @desc    Generate personalized interview
// @route   POST /api/interviews/generate-personalized
// @access  Private
export const generatePersonalizedInterview = async (req, res) => {
  try {
    console.log('🎯 Generate personalized interview request received');
    console.log('Request body:', req.body);
    console.log('User ID:', req.user?._id);

    const { interviewType, targetRole, difficultyLevel, numberOfQuestions } = req.body;
    const userId = req.user._id;

    // Validate required fields
    if (!interviewType || !targetRole || !difficultyLevel || !numberOfQuestions) {
      return res.status(400).json({ 
        message: 'Missing required fields: interviewType, targetRole, difficultyLevel, numberOfQuestions' 
      });
    }

    // Get user profile to extract skills
    console.log('📋 Fetching user profile...');
    const user = await db.users.findById(userId);
    if (!user) {
      console.log('❌ User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('👤 User found:', user.name);
    console.log('📄 CV Status:', user.cvURL ? 'Uploaded' : 'Not uploaded');
    console.log('🔧 User skills:', user.skills);

    if (!user.cvURL) {
      return res.status(400).json({ 
        message: 'Please upload your CV first to generate personalized questions' 
      });
    }

    // Load interview questions
    console.log('📚 Loading interview questions...');
    const questionsData = loadInterviewQuestions();
    if (!questionsData) {
      console.log('❌ Failed to load questions data');
      return res.status(500).json({ message: 'Failed to load interview questions' });
    }

    console.log('✅ Questions loaded successfully');
    console.log('Available roles:', Object.keys(questionsData.jobRoles));

    // Map frontend role values to question file role names
    const roleMapping = {
      'software-engineer': 'Software Engineer',
      'frontend-developer': 'Frontend Developer', 
      'backend-developer': 'Backend Developer',
      'fullstack-developer': 'Full Stack Developer',
      'devops-engineer': 'DevOps Engineer',
      'data-scientist': 'Data Scientist',
      'ml-engineer': 'Machine Learning Engineer',
      'mobile-developer': 'Mobile Developer',
      'qa-engineer': 'QA Engineer',
      'product-manager': 'Product Manager',
      'ui-ux-designer': 'UI/UX Designer',
      'system-architect': 'System Architect',
      'database-administrator': 'Database Administrator',
      'cloud-engineer': 'Cloud Engineer',
      'security-engineer': 'Security Engineer'
    };

    const mappedRole = roleMapping[targetRole];
    console.log('🎯 Target role:', targetRole, '→', mappedRole);

    if (!mappedRole || !questionsData.jobRoles[mappedRole]) {
      console.log('❌ Invalid role or questions not available');
      return res.status(400).json({ 
        message: `Invalid job role or questions not available for this role: ${targetRole}` 
      });
    }

    const roleQuestions = questionsData.jobRoles[mappedRole];
    const userSkills = user.skills || [];
    const questionCount = parseInt(numberOfQuestions);

    console.log('📊 Generation parameters:');
    console.log('- Interview type:', interviewType);
    console.log('- Question count:', questionCount);
    console.log('- Difficulty:', difficultyLevel);
    console.log('- User skills:', userSkills);

    let selectedQuestions = [];

    if (interviewType === 'technical') {
      selectedQuestions = generateTechnicalQuestions(
        roleQuestions.technical, 
        userSkills, 
        difficultyLevel, 
        questionCount
      );
    } else if (interviewType === 'behavioral' || interviewType === 'hr') {
      selectedQuestions = generateBehavioralQuestions(
        roleQuestions.hr, 
        difficultyLevel, 
        questionCount
      );
    } else if (interviewType === 'mixed') {
      const techCount = Math.ceil(questionCount * 0.7); // 70% technical
      const behavioralCount = questionCount - techCount; // 30% behavioral
      
      console.log(`📝 Mixed interview: ${techCount} technical + ${behavioralCount} behavioral`);
      
      const techQuestions = generateTechnicalQuestions(
        roleQuestions.technical, 
        userSkills, 
        difficultyLevel, 
        techCount
      );
      
      const behavioralQuestions = generateBehavioralQuestions(
        roleQuestions.hr, 
        difficultyLevel, 
        behavioralCount
      );
      
      selectedQuestions = [...techQuestions, ...behavioralQuestions];
    }

    console.log('✅ Generated questions:', selectedQuestions.length);

    // Create interview session
    const interviewSession = {
      id: Date.now().toString(),
      userId: userId,
      targetRole: mappedRole,
      interviewType,
      difficultyLevel,
      questions: selectedQuestions,
      userSkills: userSkills,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };

    console.log('🎉 Interview session created successfully');

    res.json({
      success: true,
      interview: interviewSession,
      message: 'Personalized interview generated successfully'
    });

  } catch (error) {
    console.error('❌ Generate interview error:', error);
    res.status(500).json({ 
      message: 'Server error during interview generation',
      error: error.message 
    });
  }
};

// Helper function to generate technical questions
const generateTechnicalQuestions = (techQuestions, userSkills, difficultyLevel, count) => {
  if (!techQuestions || techQuestions.length === 0) return [];

  // Always include the first question (introduction)
  const firstQuestion = techQuestions[0];
  let selectedQuestions = [firstQuestion];
  
  // Filter remaining questions by difficulty and skills
  let availableQuestions = techQuestions.slice(1).filter(q => {
    const matchesDifficulty = matchesDifficultyLevel(q.difficulty, difficultyLevel);
    const matchesSkills = userSkills.length === 0 || 
      q.skills.some(skill => 
        userSkills.some(userSkill => 
          userSkill.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(userSkill.toLowerCase())
        )
      );
    return matchesDifficulty && matchesSkills;
  });

  // If not enough skill-matched questions, include all difficulty-matched questions
  if (availableQuestions.length < count - 1) {
    availableQuestions = techQuestions.slice(1).filter(q => 
      matchesDifficultyLevel(q.difficulty, difficultyLevel)
    );
  }

  // Randomly select remaining questions
  const remainingCount = Math.min(count - 1, availableQuestions.length);
  const shuffled = availableQuestions.sort(() => 0.5 - Math.random());
  selectedQuestions = selectedQuestions.concat(shuffled.slice(0, remainingCount));

  return selectedQuestions;
};

// Helper function to generate behavioral questions
const generateBehavioralQuestions = (behavioralQuestions, difficultyLevel, count) => {
  if (!behavioralQuestions || behavioralQuestions.length === 0) return [];

  // Always include the first behavioral question
  const firstQuestion = behavioralQuestions[0];
  let selectedQuestions = [firstQuestion];

  // Filter remaining questions by difficulty
  let availableQuestions = behavioralQuestions.slice(1).filter(q => 
    matchesDifficultyLevel(q.difficulty, difficultyLevel)
  );

  // If not enough questions, include all
  if (availableQuestions.length < count - 1) {
    availableQuestions = behavioralQuestions.slice(1);
  }

  // Randomly select remaining questions
  const remainingCount = Math.min(count - 1, availableQuestions.length);
  const shuffled = availableQuestions.sort(() => 0.5 - Math.random());
  selectedQuestions = selectedQuestions.concat(shuffled.slice(0, remainingCount));

  return selectedQuestions;
};

// Helper function to match difficulty levels
const matchesDifficultyLevel = (questionDifficulty, userDifficultyLevel) => {
  const difficultyMap = {
    'beginner': ['easy'],
    'intermediate': ['easy', 'medium'],
    'advanced': ['medium', 'hard'],
    'expert': ['medium', 'hard']
  };

  return difficultyMap[userDifficultyLevel]?.includes(questionDifficulty) || false;
};

// @desc    Generate role-based interview questions
// @route   POST /api/interviews/generate-role-based
// @access  Private
export const generateRoleBasedInterview = async (req, res) => {
  try {
    console.log('🎯 Generate role-based interview request received');
    console.log('Request body:', req.body);

    const { targetRole, difficultyLevel, numberOfQuestions, interviewType, techStack } = req.body;
    const userId = req.user._id;

    if (!targetRole || !difficultyLevel || !numberOfQuestions) {
      return res.status(400).json({ 
        message: 'Missing required fields: targetRole, difficultyLevel, numberOfQuestions' 
      });
    }

    // Load questions from JSON file
    const questionsData = loadInterviewQuestions();
    if (!questionsData) {
      return res.status(500).json({ message: 'Failed to load interview questions' });
    }

    // Map role IDs to role names in JSON
    const roleMapping = {
      'software-engineer': 'Software Engineer',
      'frontend-developer': 'Frontend Developer', 
      'backend-developer': 'Backend Developer',
      'fullstack-developer': 'Full Stack Developer',
      'devops-engineer': 'DevOps Engineer',
      'data-scientist': 'Data Scientist',
      'mobile-developer': 'Mobile Developer',
      'qa-engineer': 'QA Engineer',
      'product-manager': 'Product Manager',
      'ui-ux-designer': 'UI/UX Designer',
      'system-architect': 'System Architect',
      'database-administrator': 'Database Administrator'
    };

    const roleName = roleMapping[targetRole] || 'Software Engineer';
    const roleQuestions = questionsData.jobRoles[roleName];

    if (!roleQuestions) {
      return res.status(404).json({ message: `Questions not found for role: ${roleName}` });
    }

    console.log(`📚 Found questions for role: ${roleName}`);

    // Select questions based on interview type and difficulty
    let selectedQuestions = [];
    
    if (interviewType === 'technical') {
      selectedQuestions = selectQuestionsByDifficulty(roleQuestions.technical, difficultyLevel, numberOfQuestions);
    } else if (interviewType === 'behavioral') {
      selectedQuestions = selectQuestionsByDifficulty(roleQuestions.hr, difficultyLevel, numberOfQuestions);
    } else {
      // Mixed interview - 70% technical, 30% HR
      const techCount = Math.ceil(numberOfQuestions * 0.7);
      const hrCount = numberOfQuestions - techCount;
      
      const techQuestions = selectQuestionsByDifficulty(roleQuestions.technical, difficultyLevel, techCount);
      const hrQuestions = selectQuestionsByDifficulty(roleQuestions.hr, difficultyLevel, hrCount);
      
      selectedQuestions = [...techQuestions, ...hrQuestions];
    }

    // Shuffle questions
    selectedQuestions = shuffleArray(selectedQuestions);

    // Create interview object
    const interview = {
      _id: Date.now().toString(),
      userId: userId,
      type: 'role-based',
      targetRole: roleName,
      interviewType: interviewType,
      difficultyLevel: difficultyLevel,
      techStack: techStack || [],
      questions: selectedQuestions,
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    console.log(`✅ Generated ${selectedQuestions.length} questions for ${roleName} interview`);

    res.status(200).json({
      success: true,
      interview: interview,
      message: 'Role-based interview generated successfully'
    });

  } catch (error) {
    console.error('❌ Generate role-based interview error:', error);
    res.status(500).json({ 
      message: 'Server error during interview generation',
      error: error.message 
    });
  }
};

// Helper function to select questions by difficulty
const selectQuestionsByDifficulty = (questions, difficultyLevel, count) => {
  // Filter by difficulty level
  let filteredQuestions = questions.filter(q => {
    if (difficultyLevel === 'entry') {
      return q.difficulty === 'easy';
    } else if (difficultyLevel === 'intermediate') {
      return q.difficulty === 'easy' || q.difficulty === 'medium';
    } else if (difficultyLevel === 'advanced') {
      return q.difficulty === 'medium' || q.difficulty === 'hard';
    }
    return true;
  });

  // If not enough questions of the specified difficulty, include all
  if (filteredQuestions.length < count) {
    filteredQuestions = questions;
  }

  // Shuffle and select the required count
  const shuffled = shuffleArray([...filteredQuestions]);
  return shuffled.slice(0, count);
};

// Helper function to shuffle array
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// @desc    Submit interview and generate feedback
// @route   POST /api/interviews/submit
// @access  Private
export const submitInterview = async (req, res) => {
  try {
    console.log('🎯 Submit interview request received');
    console.log('Request body:', req.body);
    console.log('User ID:', req.user?._id);

    const { interviewId, answers, questions } = req.body;
    const userId = req.user._id;

    if (!interviewId || !answers || !questions) {
      console.log('❌ Missing required fields:', { interviewId: !!interviewId, answers: !!answers, questions: !!questions });
      return res.status(400).json({ 
        message: 'Missing required fields: interviewId, answers, questions' 
      });
    }

    console.log('📊 Generating feedback for', answers.length, 'answers and', questions.length, 'questions');

    // Generate feedback based on answers and keywords
    const feedback = await generateInterviewFeedback(answers, questions, userId, interviewId);
    
    console.log('✅ Feedback generated successfully:', feedback.overallScore + '%');

    // Save interview record
    const interview = {
      _id: interviewId,
      userId: userId,
      targetRole: questions[0]?.skills?.[0] || 'General',
      interviewType: questions.some(q => q.type === 'technical') ? 'mixed' : 'behavioral',
      questions: questions,
      answers: answers,
      feedback: feedback,
      completedAt: new Date().toISOString(),
      status: 'completed'
    };

    // Save to interviews.json
    const interviewsPath = path.join(__dirname, '../data/interviews.json');
    let interviews = [];
    
    try {
      const interviewsData = fs.readFileSync(interviewsPath, 'utf8');
      interviews = JSON.parse(interviewsData);
      console.log('📚 Loaded existing interviews:', interviews.length);
    } catch (error) {
      console.log('📝 Creating new interviews file');
      interviews = [];
    }

    interviews.push(interview);
    
    try {
      fs.writeFileSync(interviewsPath, JSON.stringify(interviews, null, 2));
      console.log('💾 Interview saved to interviews.json successfully');
    } catch (writeError) {
      console.error('❌ Failed to write interviews.json:', writeError);
      throw new Error('Failed to save interview data');
    }

    // Save feedback to feedback.json
    const feedbackPath = path.join(__dirname, '../data/feedback.json');
    let feedbacks = [];
    
    try {
      const feedbackData = fs.readFileSync(feedbackPath, 'utf8');
      feedbacks = JSON.parse(feedbackData);
      console.log('📊 Loaded existing feedbacks:', feedbacks.length);
    } catch (error) {
      console.log('📝 Creating new feedback file');
      feedbacks = [];
    }

    feedbacks.push(feedback);
    
    try {
      fs.writeFileSync(feedbackPath, JSON.stringify(feedbacks, null, 2));
      console.log('💾 Feedback saved to feedback.json successfully');
    } catch (writeError) {
      console.error('❌ Failed to write feedback.json:', writeError);
      throw new Error('Failed to save feedback data');
    }

    res.status(200).json({
      success: true,
      feedback: feedback,
      message: 'Interview submitted successfully'
    });

  } catch (error) {
    console.error('❌ Submit interview error:', error);
    res.status(500).json({ 
      message: 'Server error during interview submission',
      error: error.message 
    });
  }
};

// @desc    Get user's recent interviews
// @route   GET /api/interviews/recent
// @access  Private
export const getRecentInterviews = async (req, res) => {
  try {
    console.log('🔍 Get recent interviews request received');
    console.log('User ID:', req.user?._id);
    console.log('Headers:', req.headers.authorization ? 'Token present' : 'No token');

    const userId = req.user._id;

    if (!userId) {
      console.log('❌ No user ID found');
      return res.status(401).json({ 
        success: false,
        message: 'User not authenticated' 
      });
    }

    // Load interviews
    const interviewsPath = path.join(__dirname, '../data/interviews.json');
    let interviews = [];
    
    try {
      if (fs.existsSync(interviewsPath)) {
        const interviewsData = fs.readFileSync(interviewsPath, 'utf8');
        interviews = JSON.parse(interviewsData);
        console.log('📚 Loaded', interviews.length, 'total interviews');
      } else {
        console.log('📝 No interviews file found, creating empty array');
        // Create empty file
        fs.writeFileSync(interviewsPath, JSON.stringify([], null, 2));
      }
    } catch (error) {
      console.error('❌ Error reading interviews file:', error);
      interviews = [];
    }

    // Load feedback
    const feedbackPath = path.join(__dirname, '../data/feedback.json');
    let feedbacks = [];
    
    try {
      if (fs.existsSync(feedbackPath)) {
        const feedbackData = fs.readFileSync(feedbackPath, 'utf8');
        feedbacks = JSON.parse(feedbackData);
        console.log('📊 Loaded', feedbacks.length, 'total feedbacks');
      } else {
        console.log('📝 No feedback file found, creating empty array');
        // Create empty file
        fs.writeFileSync(feedbackPath, JSON.stringify([], null, 2));
      }
    } catch (error) {
      console.error('❌ Error reading feedback file:', error);
      feedbacks = [];
    }

    // Filter user's interviews and add feedback
    const userInterviews = interviews
      .filter(interview => {
        console.log('🔍 Checking interview:', interview._id, 'Interview User:', interview.userId, 'Current User:', userId);
        return interview.userId === userId;
      })
      .map(interview => {
        const feedback = feedbacks.find(f => f.interviewId === interview._id);
        return {
          ...interview,
          feedback: feedback
        };
      })
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
      .slice(0, 5); // Get last 5 interviews

    console.log('✅ Found', userInterviews.length, 'interviews for user', userId);

    res.status(200).json({
      success: true,
      interviews: userInterviews
    });

  } catch (error) {
    console.error('❌ Get recent interviews error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error getting recent interviews',
      error: error.message 
    });
  }
};

// @desc    Delete an interview and its feedback
// @route   DELETE /api/interviews/:id
// @access  Private
export const deleteInterview = async (req, res) => {
  try {
    console.log('🗑️ Delete interview request received');
    console.log('Interview ID:', req.params.id);
    console.log('User ID:', req.user?._id);

    const interviewId = req.params.id?.trim(); // Clean the ID
    const userId = req.user._id;

    console.log('🧹 Cleaned interview ID:', interviewId);
    console.log('👤 User ID:', userId);

    if (!interviewId) {
      console.log('❌ No interview ID provided');
      return res.status(400).json({
        success: false,
        message: 'Interview ID is required'
      });
    }

    if (!userId) {
      console.log('❌ No user ID found');
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    // Load interviews
    const interviewsPath = path.join(__dirname, '../data/interviews.json');
    let interviews = [];
    
    try {
      if (fs.existsSync(interviewsPath)) {
        const interviewsData = fs.readFileSync(interviewsPath, 'utf8');
        interviews = JSON.parse(interviewsData);
        console.log('📚 Loaded', interviews.length, 'total interviews');
      }
    } catch (error) {
      console.error('❌ Error reading interviews file:', error);
      return res.status(500).json({
        success: false,
        message: 'Error reading interviews data'
      });
    }

    // Find the interview and check ownership
    const interviewIndex = interviews.findIndex(
      interview => {
        const match = interview._id === interviewId && interview.userId === userId;
        console.log('🔍 Comparing interview:', interview._id, 'with target:', interviewId, 'User match:', interview.userId === userId, 'Overall match:', match);
        return match;
      }
    );

    console.log('📍 Interview index found:', interviewIndex);

    if (interviewIndex === -1) {
      console.log('❌ Interview not found or user does not own it');
      console.log('Available interviews for user:', interviews.filter(i => i.userId === userId).map(i => i._id));
      return res.status(404).json({
        success: false,
        message: 'Interview not found or you do not have permission to delete it'
      });
    }

    // Remove the interview
    const deletedInterview = interviews.splice(interviewIndex, 1)[0];
    console.log('🗑️ Deleted interview:', deletedInterview._id);

    // Save updated interviews
    try {
      fs.writeFileSync(interviewsPath, JSON.stringify(interviews, null, 2));
      console.log('💾 Interview deleted from interviews.json');
    } catch (writeError) {
      console.error('❌ Failed to write interviews.json:', writeError);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete interview data'
      });
    }

    // Load and update feedback
    const feedbackPath = path.join(__dirname, '../data/feedback.json');
    let feedbacks = [];
    
    try {
      if (fs.existsSync(feedbackPath)) {
        const feedbackData = fs.readFileSync(feedbackPath, 'utf8');
        feedbacks = JSON.parse(feedbackData);
        console.log('📊 Loaded', feedbacks.length, 'total feedbacks');
      }
    } catch (error) {
      console.error('❌ Error reading feedback file:', error);
      // Continue even if feedback deletion fails
    }

    // Remove associated feedback
    const initialFeedbackCount = feedbacks.length;
    const updatedFeedbacks = feedbacks.filter(feedback => feedback.interviewId !== interviewId);
    const deletedFeedbackCount = initialFeedbackCount - updatedFeedbacks.length;
    
    console.log('🗑️ Deleted', deletedFeedbackCount, 'feedback records');
    
    try {
      fs.writeFileSync(feedbackPath, JSON.stringify(updatedFeedbacks, null, 2));
      console.log('💾 Associated feedback deleted from feedback.json');
    } catch (writeError) {
      console.error('❌ Failed to write feedback.json:', writeError);
      // Continue even if feedback deletion fails
    }

    console.log('✅ Interview and feedback deleted successfully');

    res.status(200).json({
      success: true,
      message: 'Interview deleted successfully',
      deletedInterview: {
        id: deletedInterview._id,
        targetRole: deletedInterview.targetRole
      }
    });

  } catch (error) {
    console.error('❌ Delete interview error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting interview',
      error: error.message
    });
  }
};

// Helper function to generate interview feedback
const generateInterviewFeedback = async (answers, questions, userId, interviewId) => {
  try {
    console.log('🔍 Starting feedback generation...');
    console.log('Answers count:', answers.length);
    console.log('Questions count:', questions.length);

    let totalScore = 0;
    let technicalScore = 0;
    let communicationScore = 0;
    let confidenceScore = 0;
    let technicalCount = 0;
    let behavioralCount = 0;

    const questionFeedback = [];

    // Analyze each answer against keywords
    for (let i = 0; i < answers.length && i < questions.length; i++) {
      const answer = answers[i].toLowerCase();
      const question = questions[i];
      const keywords = question.answer_keywords || [];
      
      console.log(`📝 Analyzing question ${i + 1}:`, question.question);
      console.log('Keywords:', keywords);
      console.log('Answer:', answers[i]);
      
      // Calculate keyword match percentage
      let matchedKeywords = 0;
      const keywordMatches = [];
      
      keywords.forEach(keyword => {
        if (answer.includes(keyword.toLowerCase())) {
          matchedKeywords++;
          keywordMatches.push(keyword);
        }
      });

      const keywordMatchPercentage = keywords.length > 0 ? 
        Math.round((matchedKeywords / keywords.length) * 100) : 50;

      console.log(`✅ Matched ${matchedKeywords}/${keywords.length} keywords (${keywordMatchPercentage}%)`);

      // Calculate answer quality based on length and keyword matches
      const answerLength = answer.trim().split(' ').length;
      let lengthScore = Math.min(answerLength / 20, 1) * 100; // Ideal answer ~20 words
      
      // Combine keyword match and length for final score
      const questionScore = Math.round((keywordMatchPercentage * 0.7) + (lengthScore * 0.3));

      console.log(`📊 Question ${i + 1} score: ${questionScore}%`);

      questionFeedback.push({
        questionId: question.id,
        question: question.question,
        answer: answers[i],
        score: questionScore,
        keywordMatchPercentage: keywordMatchPercentage,
        matchedKeywords: keywordMatches,
        totalKeywords: keywords.length,
        feedback: generateQuestionFeedback(questionScore, keywordMatchPercentage, question.skills)
      });

      totalScore += questionScore;

      // Categorize scores
      if (question.type === 'technical') {
        technicalScore += questionScore;
        technicalCount++;
      } else {
        behavioralCount++;
      }
    }

    // Calculate averages
    const overallScore = Math.round(totalScore / answers.length);
    const avgTechnicalScore = technicalCount > 0 ? Math.round(technicalScore / technicalCount) : 0;
    
    console.log('📈 Overall score:', overallScore + '%');
    console.log('🔧 Technical score:', avgTechnicalScore + '%');
    
    // Generate communication and confidence scores based on answer quality
    communicationScore = calculateCommunicationScore(answers);
    confidenceScore = calculateConfidenceScore(answers, overallScore);

    console.log('💬 Communication score:', communicationScore + '%');
    console.log('💪 Confidence score:', confidenceScore + '%');

    // Generate strengths and weaknesses
    const { strengths, weaknesses } = generateStrengthsWeaknesses(overallScore, avgTechnicalScore, communicationScore);

    // Generate improvement suggestions
    const improvementSuggestions = generateImprovementSuggestions(overallScore, avgTechnicalScore, communicationScore);

    const feedback = {
      _id: Date.now().toString(),
      userId: userId,
      interviewId: interviewId,
      overallScore: overallScore,
      communicationScore: communicationScore,
      technicalScore: avgTechnicalScore,
      confidenceScore: confidenceScore,
      strengths: strengths,
      weaknesses: weaknesses,
      detailedAnalysis: generateDetailedAnalysis(overallScore, communicationScore, avgTechnicalScore, confidenceScore, answers.length),
      improvementSuggestions: improvementSuggestions,
      answers: answers,
      questionFeedback: questionFeedback,
      categoryBreakdown: {
        technical: avgTechnicalScore,
        behavioral: overallScore - avgTechnicalScore + 10, // Approximate behavioral score
        communication: communicationScore
      },
      createdAt: new Date().toISOString()
    };

    console.log('✅ Feedback generation completed successfully');
    return feedback;

  } catch (error) {
    console.error('❌ Error generating feedback:', error);
    throw error;
  }
};

// Helper function to calculate communication score
const calculateCommunicationScore = (answers) => {
  let totalWords = 0;
  let totalSentences = 0;
  let clarityScore = 0;

  answers.forEach(answer => {
    const words = answer.trim().split(/\s+/).length;
    const sentences = answer.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    
    totalWords += words;
    totalSentences += sentences;
    
    // Basic clarity check (avoid very short or very long answers)
    if (words >= 5 && words <= 100) {
      clarityScore += 20;
    } else if (words >= 2) {
      clarityScore += 10;
    }
  });

  const avgWordsPerAnswer = totalWords / answers.length;
  const avgSentencesPerAnswer = totalSentences / answers.length;
  
  // Score based on answer completeness and structure
  let communicationScore = clarityScore;
  
  if (avgWordsPerAnswer >= 10) communicationScore += 20;
  if (avgSentencesPerAnswer >= 1.5) communicationScore += 20;
  
  return Math.min(Math.round(communicationScore / answers.length), 100);
};

// Helper function to calculate confidence score
const calculateConfidenceScore = (answers, overallScore) => {
  let confidenceIndicators = 0;
  
  answers.forEach(answer => {
    const lowerAnswer = answer.toLowerCase();
    
    // Positive indicators
    if (lowerAnswer.includes('i have') || lowerAnswer.includes('i can') || 
        lowerAnswer.includes('i will') || lowerAnswer.includes('i am')) {
      confidenceIndicators += 10;
    }
    
    // Negative indicators
    if (lowerAnswer.includes('i think') || lowerAnswer.includes('maybe') || 
        lowerAnswer.includes('i guess') || lowerAnswer.includes('not sure')) {
      confidenceIndicators -= 5;
    }
    
    // Length indicates preparation
    if (answer.trim().split(' ').length >= 15) {
      confidenceIndicators += 5;
    }
  });
  
  // Base confidence on overall performance
  const baseConfidence = Math.max(overallScore - 10, 40);
  const finalConfidence = Math.min(baseConfidence + confidenceIndicators, 100);
  
  return Math.max(finalConfidence, 30);
};

// Helper function to generate question-specific feedback
const generateQuestionFeedback = (score, keywordMatch, skills) => {
  const skillsText = skills ? skills.join(', ') : 'general';
  
  if (score >= 80) {
    return `Excellent answer! You demonstrated strong understanding of ${skillsText} with ${keywordMatch}% keyword coverage.`;
  } else if (score >= 60) {
    return `Good answer with room for improvement. Consider including more specific details about ${skillsText}.`;
  } else if (score >= 40) {
    return `Your answer shows basic understanding but lacks depth. Focus on ${skillsText} concepts and provide more examples.`;
  } else {
    return `This answer needs significant improvement. Study ${skillsText} fundamentals and practice explaining concepts clearly.`;
  }
};

// Helper function to generate strengths and weaknesses
const generateStrengthsWeaknesses = (overallScore, technicalScore, communicationScore) => {
  const strengths = [];
  const weaknesses = [];

  if (communicationScore >= 75) {
    strengths.push("Clear and articulate communication throughout the interview");
  } else if (communicationScore < 60) {
    weaknesses.push("Could improve clarity and structure in responses");
  }

  if (technicalScore >= 75) {
    strengths.push("Demonstrated solid technical knowledge and understanding");
  } else if (technicalScore < 60) {
    weaknesses.push("Technical knowledge could be strengthened with more specific examples");
  }

  if (overallScore >= 80) {
    strengths.push("Showed confidence and composure during responses");
  } else if (overallScore < 60) {
    weaknesses.push("Could provide more detailed responses");
  }

  if (overallScore >= 85) {
    strengths.push("Provided detailed and comprehensive answers");
  } else if (overallScore < 70) {
    weaknesses.push("Time management could be improved");
  }

  return { strengths, weaknesses };
};

// Helper function to generate improvement suggestions
const generateImprovementSuggestions = (overallScore, technicalScore, communicationScore) => {
  const suggestions = [];

  if (overallScore < 80) {
    suggestions.push("Practice the STAR method (Situation, Task, Action, Result) for structured responses");
  }

  if (technicalScore < 75) {
    suggestions.push("Prepare specific examples from past projects to demonstrate technical skills");
  }

  if (communicationScore < 75 || overallScore < 75) {
    suggestions.push("Practice mock interviews to build confidence and reduce hesitation");
  }

  suggestions.push("Research common interview questions for your target role and prepare thoughtful answers");

  return suggestions;
};

// Helper function to generate detailed analysis
const generateDetailedAnalysis = (overallScore, communicationScore, technicalScore, confidenceScore, questionCount) => {
  let performanceLevel = "needs improvement";
  if (overallScore >= 90) performanceLevel = "excellent";
  else if (overallScore >= 80) performanceLevel = "strong";
  else if (overallScore >= 70) performanceLevel = "good";

  let preparationLevel = "excellent preparation and delivery";
  if (overallScore < 80) preparationLevel = "solid fundamentals and room for refinement";
  if (overallScore < 60) preparationLevel = "basic preparation with significant room for improvement";

  let responseDetail = "good depth";
  if (questionCount <= 5) responseDetail = "room for more detail";
  else if (questionCount >= 10) responseDetail = "comprehensive coverage";

  return `Overall, your interview performance was ${performanceLevel}. You scored ${overallScore}% overall, which indicates ${performanceLevel} performance with ${preparationLevel}. Your communication skills scored ${communicationScore}%, technical knowledge ${technicalScore}%, and confidence level ${confidenceScore}%. You answered ${questionCount} questions with an average response length that shows ${responseDetail}. Continue practicing to improve your interview skills and build confidence.`;
};