const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middleware/authMiddleware');
const {
  getDashboard,
  getDiseaseTrends,
  getOutbreaks,
  getFeedbackStats
} = require('../controllers/analyticsController');

// GET /api/v1/analytics/dashboard - Dashboard statistics
router.get('/dashboard', verifyToken, getDashboard);

// GET /api/v1/analytics/disease-trends - Disease trends over time
router.get('/disease-trends', getDiseaseTrends);

// GET /api/v1/analytics/outbreaks - Outbreak hotspots
router.get('/outbreaks', getOutbreaks);

// GET /api/v1/analytics/feedback - Feedback statistics (admin only)
router.get('/feedback', verifyToken, checkRole('admin'), getFeedbackStats);

module.exports = router;
