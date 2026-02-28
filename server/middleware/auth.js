import jwt from 'jsonwebtoken';
import { simpleDB } from '../config/simpleDB.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token (decoded.id is the _id from database)
      const user = simpleDB.users.findOne(decoded.id);

      if (!user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      // Remove password and set user with both id and _id for compatibility
      const { password, ...userWithoutPassword } = user;
      req.user = {
        ...userWithoutPassword,
        id: user._id // Add id property for compatibility
      };

      next();
    } catch (error) {
      console.error('Auth error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Generate JWT Token
export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};
