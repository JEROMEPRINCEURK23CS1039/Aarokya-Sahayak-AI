const Analysis = require('../models/Analysis');
const Hospital = require('../models/Hospital');
const User = require('../models/User');
const logger = require('../utils/logger');

/**
 * Get dashboard analytics
 * GET /api/v1/analytics/dashboard
 */
exports.getDashboard = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Total analyses
    const totalAnalyses = await Analysis.countDocuments({
      createdAt: { $gte: startDate }
    });

    // Total users
    const totalUsers = await User.countDocuments({
      createdAt: { $gte: startDate }
    });

    // Emergency cases
    const emergencyCases = await Analysis.countDocuments({
      triageLevel: 'Emergency',
      createdAt: { $gte: startDate }
    });

    // Top diseases
    const topDiseases = await Analysis.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: { _id: '$topDisease', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Triage distribution
    const triageDistribution = await Analysis.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: { _id: '$triageLevel', count: { $sum: 1 } } }
    ]);

    // Average confidence
    const confidenceStats = await Analysis.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: null,
          avgConfidence: { $avg: '$confidence' },
          minConfidence: { $min: '$confidence' },
          maxConfidence: { $max: '$confidence' }
        }
      }
    ]);

    // Method distribution (AI vs Rule-based)
    const methodDistribution = await Analysis.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: { _id: '$method', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      period: `Last ${days} days`,
      dashboard: {
        totalAnalyses,
        totalUsers,
        emergencyCases,
        topDiseases: topDiseases.map(d => ({
          disease: d._id,
          count: d.count
        })),
        triageDistribution: triageDistribution.map(t => ({
          level: t._id,
          count: t.count
        })),
        confidence: confidenceStats[0] || {
          avgConfidence: 0,
          minConfidence: 0,
          maxConfidence: 0
        },
        methodDistribution: methodDistribution.map(m => ({
          method: m._id,
          count: m.count
        }))
      }
    });

  } catch (error) {
    logger.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard analytics'
    });
  }
};

/**
 * Get disease trends over time
 * GET /api/v1/analytics/disease-trends
 */
exports.getDiseaseTrends = async (req, res) => {
  try {
    const { disease, days = 90 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const matchStage = {
      createdAt: { $gte: startDate }
    };

    if (disease) {
      matchStage.topDisease = disease;
    }

    const trends = await Analysis.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            disease: '$topDisease'
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.date': 1 } },
      {
        $group: {
          _id: '$_id.date',
          diseases: {
            $push: {
              disease: '$_id.disease',
              count: '$count'
            }
          },
          total: { $sum: '$count' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      period: `Last ${days} days`,
      disease: disease || 'All',
      trends
    });

  } catch (error) {
    logger.error('Get disease trends error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch disease trends'
    });
  }
};

/**
 * Get outbreak hotspots (GeoJSON for heatmap)
 * GET /api/v1/analytics/outbreaks
 */
exports.getOutbreaks = async (req, res) => {
  try {
    const { disease, days = 30, minCases = 5 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const matchStage = {
      createdAt: { $gte: startDate },
      'metadata.location.state': { $ne: null }
    };

    if (disease) {
      matchStage.topDisease = disease;
    }

    const hotspots = await Analysis.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            state: '$metadata.location.state',
            district: '$metadata.location.district',
            disease: '$topDisease'
          },
          count: { $sum: 1 }
        }
      },
      { $match: { count: { $gte: parseInt(minCases) } } },
      { $sort: { count: -1 } }
    ]);

    // Get hospital locations for the affected areas
    const affectedDistricts = [...new Set(hotspots.map(h => h._id.district).filter(Boolean))];
    
    const hospitalPoints = await Hospital.aggregate([
      {
        $match: {
          'address.district': { $in: affectedDistricts }
        }
      },
      {
        $project: {
          name: 1,
          location: 1,
          district: '$address.district',
          state: '$address.state'
        }
      }
    ]);

    // Format as GeoJSON
    const geojson = {
      type: 'FeatureCollection',
      features: hotspots.map(hotspot => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [0, 0] // Placeholder - would need district centroids
        },
        properties: {
          state: hotspot._id.state,
          district: hotspot._id.district,
          disease: hotspot._id.disease,
          cases: hotspot.count,
          severity: hotspot.count >= 20 ? 'High' : hotspot.count >= 10 ? 'Medium' : 'Low'
        }
      }))
    };

    res.json({
      success: true,
      period: `Last ${days} days`,
      minCases: parseInt(minCases),
      hotspots,
      geojson,
      hospitalPoints
    });

  } catch (error) {
    logger.error('Get outbreaks error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch outbreak data'
    });
  }
};

/**
 * Get feedback statistics
 * GET /api/v1/analytics/feedback
 */
exports.getFeedbackStats = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const feedbackStats = await Analysis.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          'feedback.submittedAt': { $ne: null }
        }
      },
      {
        $group: {
          _id: null,
          totalFeedback: { $sum: 1 },
          useful: { $sum: { $cond: [{ $eq: ['$feedback.useful', 1] }, 1, 0] } },
          notUseful: { $sum: { $cond: [{ $eq: ['$feedback.useful', 0] }, 1, 0] } },
          avgRating: { $avg: '$feedback.rating' }
        }
      }
    ]);

    // Feedback by method
    const feedbackByMethod = await Analysis.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          'feedback.submittedAt': { $ne: null }
        }
      },
      {
        $group: {
          _id: '$method',
          totalFeedback: { $sum: 1 },
          useful: { $sum: { $cond: [{ $eq: ['$feedback.useful', 1] }, 1, 0] } },
          avgRating: { $avg: '$feedback.rating' }
        }
      }
    ]);

    res.json({
      success: true,
      period: `Last ${days} days`,
      overall: feedbackStats[0] || {
        totalFeedback: 0,
        useful: 0,
        notUseful: 0,
        avgRating: 0
      },
      byMethod: feedbackByMethod
    });

  } catch (error) {
    logger.error('Get feedback stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feedback statistics'
    });
  }
};

module.exports = exports;
