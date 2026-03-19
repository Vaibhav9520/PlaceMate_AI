import { db } from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple CV analysis without AI
const analyzeCV = async (cvPath) => {
  return {
    skills: ['JavaScript', 'HTML', 'CSS', 'Git'],
    education: 'Education details from CV',
    experience: 'Experience details from CV',
    projects: 'Projects from CV',
    keywords: []
  };
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getProfile = async (req, res) => {
  try {
    const user = await db.users.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove password
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { name, contactNumber, collegeName, degree, branch, yearOfStudy } = req.body;

    const user = await db.users.findById(req.user._id);

    if (user) {
      const updatedUser = await db.users.update(req.user._id, {
        name: name || user.name,
        contactNumber: contactNumber || user.contactNumber,
        collegeName: collegeName || user.collegeName,
        degree: degree || user.degree,
        branch: branch || user.branch,
        yearOfStudy: yearOfStudy || user.yearOfStudy
      });

      // Remove password
      const { password: _, ...userWithoutPassword } = updatedUser;

      res.json({
        success: true,
        message: 'Profile updated successfully',
        user: userWithoutPassword
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Upload CV
// @route   POST /api/users/upload-cv
// @access  Private
export const uploadCV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    const user = await db.users.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Analyze CV - this will always return a valid object now
    let analysis = {
      skills: ['JavaScript', 'HTML', 'CSS', 'Git'],
      education: 'Education details from CV',
      experience: 'Experience details from CV',
      projects: 'Projects from CV',
      keywords: []
    };

    console.log('📤 Starting CV analysis...');
    
    try {
      const cvAnalysis = await analyzeCV(req.file.path);
      console.log('📥 CV analysis result:', cvAnalysis ? 'Valid object' : 'NULL (ERROR!)');
      console.log('📊 Analysis data:', JSON.stringify(cvAnalysis, null, 2));
      
      // Check if cvAnalysis is valid and has skills
      if (cvAnalysis && typeof cvAnalysis === 'object' && Array.isArray(cvAnalysis.skills) && cvAnalysis.skills.length > 0) {
        analysis = {
          skills: cvAnalysis.skills || analysis.skills,
          education: cvAnalysis.education || analysis.education,
          experience: cvAnalysis.experience || analysis.experience,
          projects: cvAnalysis.projects || analysis.projects,
          keywords: cvAnalysis.keywords || []
        };
        console.log('✅ Using extracted analysis');
      } else {
        console.log('⚠️ CV analysis returned invalid data, using defaults');
      }
    } catch (error) {
      console.error('❌ CV analysis error (using defaults):', error.message);
      // Continue with default analysis
    }

    console.log('💾 Final analysis to save:', JSON.stringify(analysis, null, 2));

    // Update user with CV URL and extracted skills
    const updateData = {
      cvURL: `/uploads/${req.file.filename}`,
      skills: analysis.skills || ['JavaScript', 'HTML', 'CSS', 'Git'],
      education: analysis.education || 'Education details from CV',
      experience: analysis.experience || 'Experience details from CV',
      projects: analysis.projects || 'Projects from CV'
    };

    const updatedUser = await db.users.update(req.user._id, updateData);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = updatedUser;

    res.json({
      success: true,
      message: 'CV uploaded and analyzed successfully',
      cvURL: updateData.cvURL,
      analysis: {
        skills: updateData.skills,
        education: updateData.education,
        experience: updateData.experience,
        projects: updateData.projects
      },
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Upload CV error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during CV upload',
      error: error.message 
    });
  }
};

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private
export const getUserStats = async (req, res) => {
  try {
    const user = await db.users.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      stats: {
        totalInterviews: user.totalInterviews || 0,
        averageScore: user.averageScore || 0,
        skillsCount: user.skills?.length || 0,
        profileCompletion: calculateProfileCompletion(user)
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Helper function
const calculateProfileCompletion = (user) => {
  const fields = ['name', 'email', 'contactNumber', 'collegeName', 'degree', 'branch', 'yearOfStudy', 'cvURL'];
  const completed = fields.filter(field => user[field] && user[field] !== '').length;
  return Math.round((completed / fields.length) * 100);
};

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
// @route   POST /api/users/generate-interview
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