const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const {
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
  updateMedicalHistory
} = require('../controllers/userController');

// GET /api/v1/users/profile - Get current user profile
router.get('/profile', verifyToken, getUserProfile);

// GET /api/v1/users/:id - Get user profile by ID
router.get('/:id', verifyToken, getUserProfile);

// PUT /api/v1/users/profile - Update current user profile
router.put('/profile', verifyToken, updateUserProfile);

// PUT /api/v1/users/:id - Update user profile by ID
router.put('/:id', verifyToken, updateUserProfile);

// PUT /api/v1/users/:id/medical-history - Update medical history
router.put('/:id/medical-history', verifyToken, updateMedicalHistory);

// DELETE /api/v1/users/:id - Delete user account
router.delete('/:id', verifyToken, deleteUserAccount);

module.exports = router;
