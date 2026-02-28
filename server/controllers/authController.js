import { db } from '../config/database.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../middleware/auth.js';

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, password, contactNumber, collegeName, degree, branch, yearOfStudy } = req.body;

    // Check if user exists
    const userExists = await db.users.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await db.users.create({
      name,
      email,
      password: hashedPassword,
      contactNumber: contactNumber || '',
      collegeName: collegeName || '',
      degree: degree || '',
      branch: branch || '',
      yearOfStudy: yearOfStudy || '',
      skills: [],
      totalInterviews: 0,
      averageScore: 0
    });

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
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user - need to get password for comparison
    const users = await db.users.find({ email });
    const user = users.find(u => u.email === email);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: 'Login successful',
      user: userWithoutPassword,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await db.users.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
