import jwt from 'jsonwebtoken';
import User from '../models_backup/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      console.log('🔐 Protecting route with token verification');
      
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      console.log('🎫 Token received:', token ? 'Present' : 'Missing');

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('✅ Token decoded, user ID:', decoded.id);

      // Get user from MongoDB
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        console.log('❌ User not found for ID:', decoded.id);
        return res.status(401).json({ 
          success: false,
          message: 'Not authorized, user not found' 
        });
      }

      console.log('✅ User authenticated:', user.email);

      // Set user with both id and _id for compatibility
      req.user = {
        ...user.toObject(),
        id: user._id,
        _id: user._id
      };

      next();
    } catch (error) {
      console.error('❌ Auth error:', error.message);
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ 
          success: false,
          message: 'Not authorized, invalid token' 
        });
      } else if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          success: false,
          message: 'Not authorized, token expired' 
        });
      } else {
        return res.status(401).json({ 
          success: false,
          message: 'Not authorized, token failed' 
        });
      }
    }
  } else {
    console.log('❌ No authorization header found');
    return res.status(401).json({ 
      success: false,
      message: 'Not authorized, no token' 
    });
  }
};

// Generate JWT Token
export const generateToken = (id) => {
  console.log('🎫 Generating token for user ID:', id);
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};
