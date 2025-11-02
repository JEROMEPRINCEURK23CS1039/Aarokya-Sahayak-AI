const User = require('../models/User');
const { generateAccessToken, generateRefreshToken } = require('../middleware/authMiddleware');
const logger = require('../utils/logger');

// Register new user
exports.registerUser = async (req, res) => {
  try {
    const { email, password, profile } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create new user (password will be hashed by pre-save hook)
    const user = new User({
      email,
      passwordHash: password,
      profile
    });

    await user.save();

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Store refresh token
    user.refreshTokens.push({
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });
    await user.save();

    logger.info(`User registered: ${email}`);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user._id,
        email: user.email,
        profile: user.profile
      },
      accessToken,
      refreshToken
    });

  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Store refresh token
    user.refreshTokens.push({
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });
    await user.save();

    logger.info(`User logged in: ${email}`);

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        profile: user.profile,
        preferences: user.preferences
      },
      accessToken,
      refreshToken
    });

  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};

// Refresh access token
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token required'
      });
    }

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key'
    );

    // Find user and verify refresh token
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    const tokenExists = user.refreshTokens.some(
      t => t.token === refreshToken && t.expiresAt > new Date()
    );

    if (!tokenExists) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token expired or invalid'
      });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user._id);

    res.json({
      success: true,
      accessToken: newAccessToken
    });

  } catch (error) {
    logger.error('Token refresh error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid refresh token'
    });
  }
};

// Logout user
exports.logoutUser = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const user = await User.findById(req.user._id);

    if (user && refreshToken) {
      // Remove refresh token
      user.refreshTokens = user.refreshTokens.filter(
        t => t.token !== refreshToken
      );
      await user.save();
    }

    logger.info(`User logged out: ${req.user.email}`);

    res.json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    logger.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
  }
};

// Get current user profile
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash -refreshTokens');
    
    res.json({
      success: true,
      user
    });

  } catch (error) {
    logger.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user profile'
    });
  }
};
