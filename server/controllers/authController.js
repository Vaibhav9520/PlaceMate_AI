import { db } from '../config/database.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../middleware/auth.js';

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    console.log('🔐 Register request received:', req.body);
    const { name, email, password, contactNumber, collegeName, degree, branch, yearOfStudy } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide name, email, and password' 
      });
    }

    // Check if user exists
    const userExists = await db.users.findOne({ email });
    if (userExists) {
      console.log('❌ User already exists:', email);
      return res.status(400).json({ 
        success: false,
        message: 'User already exists' 
      });
    }

    // Create user (password will be hashed by the User model pre-save hook)
    const user = await db.users.create({
      name,
      email,
      password, // Don't hash here - let the model handle it
      contactNumber: contactNumber || '',
      collegeName: collegeName || '',
      degree: degree || '',
      branch: branch || '',
      yearOfStudy: yearOfStudy || '',
      skills: [],
      totalInterviews: 0,
      averageScore: 0
    });

    console.log('✅ User created successfully:', user.email);

    if (user) {
      res.status(201).json({
        success: true,
        message: 'Account created successfully',
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          contactNumber: user.contactNumber,
          collegeName: user.collegeName,
          degree: user.degree,
          branch: user.branch,
          yearOfStudy: user.yearOfStudy,
          skills: user.skills,
          totalInterviews: user.totalInterviews,
          averageScore: user.averageScore
        },
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ 
        success: false,
        message: 'Invalid user data' 
      });
    }
  } catch (error) {
    console.error('❌ Register error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during registration',
      error: error.message 
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    console.log('🔐 Login request received:', { email: req.body.email });
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide email and password' 
      });
    }

    // Find user with password field included
    console.log('🔍 Looking for user:', email);
    const user = await db.users.findOne({ email, includePassword: true });
    
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    console.log('✅ User found:', user.email);
    console.log('🔑 Password field exists:', !!user.password);

    // Compare password using the model's method
    let isMatch = false;
    if (user.comparePassword && typeof user.comparePassword === 'function') {
      // Use model method if available
      isMatch = await user.comparePassword(password);
      console.log('🔐 Password comparison (model method):', isMatch);
    } else {
      // Fallback to bcrypt direct comparison
      isMatch = await bcrypt.compare(password, user.password);
      console.log('🔐 Password comparison (bcrypt):', isMatch);
    }
    
    if (!isMatch) {
      console.log('❌ Password mismatch for user:', email);
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    console.log('✅ Login successful for user:', email);

    // Remove password from response
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      contactNumber: user.contactNumber,
      collegeName: user.collegeName,
      degree: user.degree,
      branch: user.branch,
      yearOfStudy: user.yearOfStudy,
      skills: user.skills,
      totalInterviews: user.totalInterviews,
      averageScore: user.averageScore,
      cvURL: user.cvURL,
      profileURL: user.profileURL,
      education: user.education,
      experience: user.experience,
      projects: user.projects
    };

    res.json({
      success: true,
      message: 'Login successful',
      user: userResponse,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during login',
      error: error.message 
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    console.log('👤 Get me request for user:', req.user._id);
    const user = await db.users.findById(req.user._id);
    
    if (!user) {
      console.log('❌ User not found:', req.user._id);
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    console.log('✅ User profile retrieved:', user.email);

    res.json({
      success: true,
      user: user
    });
  } catch (error) {
    console.error('❌ Get me error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message 
    });
  }
};
