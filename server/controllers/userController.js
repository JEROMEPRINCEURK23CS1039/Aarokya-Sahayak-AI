const User = require('../models/User');
const logger = require('../utils/logger');

/**
 * Get user profile
 * GET /api/v1/users/:id or GET /api/v1/users/profile
 */
exports.getUserProfile = async (req, res) => {
  try {
    // If no ID in params, use current user ID from token
    const userId = req.params.id || req.user._id.toString();

    // Check authorization
    if (req.user._id.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to view this profile'
      });
    }

    const user = await User.findById(userId)
      .select('-passwordHash -refreshTokens -__v');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });

  } catch (error) {
    logger.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile'
    });
  }
};

/**
 * Update user profile
 * PUT /api/v1/users/:id or PUT /api/v1/users/profile
 */
exports.updateUserProfile = async (req, res) => {
  try {
    // If no ID in params, use current user ID from token
    const userId = req.params.id || req.user._id.toString();
    const updates = req.body;

    // Check authorization
    if (req.user._id.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to update this profile'
      });
    }

    // Don't allow updating sensitive fields
    delete updates.password;
    delete updates.passwordHash;
    delete updates.email;
    delete updates.role;
    delete updates.refreshTokens;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-passwordHash -refreshTokens -__v');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    logger.info('User profile updated:', { userId });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user
    });

  } catch (error) {
    logger.error('Update user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
};

/**
 * Delete user account
 * DELETE /api/v1/users/:id
 */
exports.deleteUserAccount = async (req, res) => {
  try {
    const { id } = req.params;

    // Check authorization
    if (req.user._id.toString() !== id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to delete this account'
      });
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    logger.info('User account deleted:', { userId: id });

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });

  } catch (error) {
    logger.error('Delete user account error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete account'
    });
  }
};

/**
 * Update user medical history
 * PUT /api/v1/users/:id/medical-history
 */
exports.updateMedicalHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const { medicalHistory, allergies } = req.body;

    // Check authorization
    if (req.user._id.toString() !== id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to update medical history'
      });
    }

    const updates = {};
    if (medicalHistory) updates.medicalHistory = medicalHistory;
    if (allergies) updates.allergies = allergies;

    const user = await User.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    ).select('medicalHistory allergies');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    logger.info('Medical history updated:', { userId: id });

    res.json({
      success: true,
      message: 'Medical history updated successfully',
      medicalHistory: user.medicalHistory,
      allergies: user.allergies
    });

  } catch (error) {
    logger.error('Update medical history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update medical history'
    });
  }
};

module.exports = exports;
