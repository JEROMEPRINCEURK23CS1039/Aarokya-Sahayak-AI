const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

// Generate access token (15 minutes)
const generateAccessToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '15m' }
  );
};

// Generate refresh token (7 days)
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
    { expiresIn: '7d' }
  );
};

// Verify JWT token middleware
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided' 
      });
    }

    const token = authHeader.substring(7);
    
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'your-secret-key'
    );
    
    const user = await User.findById(decoded.userId).select('-passwordHash -refreshTokens');
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired' 
      });
    }
    
    logger.error('Token verification error:', error);
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid token' 
    });
  }
};

// Check user role middleware
const checkRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Unauthorized' 
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Forbidden: Insufficient permissions' 
      });
    }
    
    next();
  };
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  checkRole
};
