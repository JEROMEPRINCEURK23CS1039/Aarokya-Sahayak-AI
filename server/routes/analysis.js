const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { body, validationResult } = require('express-validator');
const {
  analyzeSymptoms,
  getAnalysisHistory,
  submitFeedback,
  getSymptoms
} = require('../controllers/analysisController');

// POST /api/v1/analysis/predict - Analyze symptoms
router.post(
  '/predict',
  verifyToken,
  [
    body('symptoms').isArray({ min: 1 }).withMessage('At least one symptom required'),
    body('age').isInt({ min: 1, max: 120 }).withMessage('Valid age required'),
    body('gender').isIn(['Male', 'Female', 'Other']).withMessage('Valid gender required'),
    body('duration').optional().isInt({ min: 1 }),
    body('intensity').optional().isIn(['Mild', 'Moderate', 'Severe'])
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
  analyzeSymptoms
);

// GET /api/v1/analysis/history/:userId - Get analysis history
router.get('/history/:userId', verifyToken, getAnalysisHistory);

// POST /api/v1/analysis/feedback - Submit feedback
router.post(
  '/feedback',
  verifyToken,
  [
    body('analysisId').notEmpty().withMessage('Analysis ID required'),
    body('useful').isBoolean().withMessage('Useful must be boolean'),
    body('rating').optional().isInt({ min: 1, max: 5 }),
    body('reason').optional().isString()
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
  submitFeedback
);

// GET /api/v1/analysis/symptoms - Get all symptoms
router.get('/symptoms', getSymptoms);

module.exports = router;
