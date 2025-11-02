const Analysis = require('../models/Analysis');
const { predictDisease, ruleBasedPrediction } = require('../services/mlService');
const logger = require('../utils/logger');
const { appendToCSV } = require('../utils/csvLogger');

/**
 * Analyze symptoms and predict diseases
 * POST /api/v1/analysis/predict
 */
exports.analyzeSymptoms = async (req, res) => {
  try {
    const { symptoms, age, gender, state, district, duration, intensity } = req.body;

    // Validate input
    if (!symptoms || symptoms.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one symptom is required'
      });
    }

    if (!age || age < 1 || age > 120) {
      return res.status(400).json({
        success: false,
        message: 'Valid age (1-120) is required'
      });
    }

    if (!gender || !['Male', 'Female', 'Other'].includes(gender)) {
      return res.status(400).json({
        success: false,
        message: 'Valid gender is required'
      });
    }

    logger.info('Analysis request:', {
      symptoms: symptoms.length,
      age,
      gender,
      userId: req.user?._id
    });

    let predictions, confidence, method, modelVersion;

    // Try ML service first
    try {
      const mlResult = await predictDisease(symptoms, age, gender);
      predictions = mlResult.predictions;
      confidence = mlResult.confidence;
      method = mlResult.method;
      modelVersion = mlResult.modelVersion;
    } catch (mlError) {
      logger.warn('ML service failed, using rule-based fallback:', mlError.message);
      // Fallback to rule-based
      const fallbackResult = ruleBasedPrediction(symptoms, age, gender);
      predictions = fallbackResult.predictions;
      confidence = fallbackResult.confidence;
      method = fallbackResult.method;
      modelVersion = 'rule_v1';
    }

    // Determine triage level based on symptoms and confidence
    const severeSymptoms = [
      'chest pain',
      'severe chest pain',
      'breathlessness',
      'difficulty breathing',
      'severe headache',
      'unconsciousness',
      'severe bleeding',
      'stroke symptoms',
      'heart attack',
      'seizure'
    ];

    const hasSevereSymptom = symptoms.some(s =>
      severeSymptoms.some(severe => s.toLowerCase().includes(severe))
    );

    let triageLevel;
    let severity;

    if (hasSevereSymptom) {
      triageLevel = 'Emergency';
      severity = 'Severe';
    } else if (confidence >= 0.80) {
      triageLevel = 'Urgent';
      severity = intensity || 'Moderate';
    } else if (confidence >= 0.60) {
      triageLevel = 'OPD';
      severity = intensity || 'Moderate';
    } else {
      triageLevel = 'HomeCare';
      severity = intensity || 'Mild';
    }

    // Create analysis record
    const analysis = new Analysis({
      userId: req.user?._id,
      symptoms,
      age,
      gender,
      duration: duration || 1,
      intensity: intensity || 'Moderate',
      predictions,
      topDisease: predictions[0].disease,
      topProbability: predictions[0].probability,
      confidence,
      triageLevel,
      severity,
      method,
      modelVersion,
      metadata: {
        age,
        gender,
        location: {
          state: state || null,
          district: district || null
        }
      }
    });

    await analysis.save();

    logger.info('Analysis saved:', {
      analysisId: analysis._id,
      topDisease: predictions[0].disease,
      triageLevel
    });

    // Log to CSV for backup
    try {
      await appendToCSV('feedback_log.csv', {
        ts: new Date().toISOString(),
        method,
        age,
        gender,
        symptoms: symptoms.join('|'),
        top_disease: predictions[0].disease,
        top_prob: predictions[0].probability,
        triage: triageLevel,
        state: state || '',
        district: district || ''
      });
    } catch (csvError) {
      logger.error('CSV logging failed:', csvError);
      // Don't fail the request if CSV logging fails
    }

    // Generate recommendations
    const recommendations = generateRecommendations(triageLevel, predictions[0].disease);

    res.json({
      success: true,
      analysisId: analysis._id,
      predictions,
      topDisease: predictions[0].disease,
      topProbability: predictions[0].probability,
      confidence,
      triageLevel,
      severity,
      method,
      recommendations,
      timestamp: analysis.createdAt
    });

  } catch (error) {
    logger.error('Analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze symptoms',
      error: error.message
    });
  }
};

/**
 * Get user's analysis history
 * GET /api/v1/analysis/history/:userId
 */
exports.getAnalysisHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 20, skip = 0 } = req.query;

    // Check authorization
    if (req.user._id.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to view this history'
      });
    }

    const analyses = await Analysis.find({ userId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .select('-__v');

    const total = await Analysis.countDocuments({ userId });

    res.json({
      success: true,
      count: analyses.length,
      total,
      analyses
    });

  } catch (error) {
    logger.error('Get history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analysis history'
    });
  }
};

/**
 * Submit feedback for an analysis
 * POST /api/v1/analysis/feedback
 */
exports.submitFeedback = async (req, res) => {
  try {
    const { analysisId, useful, rating, reason } = req.body;

    if (!analysisId) {
      return res.status(400).json({
        success: false,
        message: 'Analysis ID is required'
      });
    }

    const analysis = await Analysis.findById(analysisId);

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analysis not found'
      });
    }

    // Update feedback
    analysis.feedback = {
      useful: useful ? 1 : 0,
      rating: rating || null,
      reason: reason || null,
      submittedAt: new Date()
    };

    await analysis.save();

    // Log feedback to CSV
    try {
      await appendToCSV('feedback_log.csv', {
        ts: new Date().toISOString(),
        useful: useful ? 1 : 0,
        reason: reason || '',
        state: analysis.metadata?.location?.state || '',
        district: analysis.metadata?.location?.district || '',
        method: analysis.method,
        age: analysis.age,
        gender: analysis.gender,
        symptoms: analysis.symptoms.join('|'),
        top_disease: analysis.topDisease,
        top_prob: analysis.topProbability,
        triage: analysis.triageLevel
      });
    } catch (csvError) {
      logger.error('CSV feedback logging failed:', csvError);
    }

    logger.info('Feedback submitted:', {
      analysisId,
      useful,
      rating
    });

    res.json({
      success: true,
      message: 'Feedback submitted successfully',
      feedback: analysis.feedback
    });

  } catch (error) {
    logger.error('Submit feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit feedback'
    });
  }
};

/**
 * Get all available symptoms
 * GET /api/v1/analysis/symptoms
 */
exports.getSymptoms = async (req, res) => {
  try {
    const Symptom = require('../models/Symptom');
    
    const symptoms = await Symptom.find()
      .select('name category severity translations')
      .sort('name');

    res.json({
      success: true,
      count: symptoms.length,
      symptoms
    });

  } catch (error) {
    logger.error('Get symptoms error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch symptoms'
    });
  }
};

/**
 * Generate recommendations based on triage level and disease
 */
function generateRecommendations(triageLevel, disease) {
  const recommendations = {
    Emergency: {
      message: '⚠️ EMERGENCY: Seek immediate medical attention!',
      actions: [
        'Call ambulance (108/112) immediately',
        'Go to nearest hospital emergency room',
        'Do not wait or try home remedies',
        'Have someone accompany you'
      ]
    },
    Urgent: {
      message: '⚡ Urgent: Consult a doctor within 24 hours',
      actions: [
        'Schedule appointment with doctor today',
        'Visit nearby clinic or hospital',
        'Monitor symptoms closely',
        'Take prescribed medications if any'
      ]
    },
    OPD: {
      message: '🏥 OPD Visit: Schedule an appointment',
      actions: [
        'Book appointment with general physician',
        'Visit OPD within 2-3 days',
        'Maintain symptom diary',
        'Follow preventive measures'
      ]
    },
    HomeCare: {
      message: '🏠 Home Care: Rest and monitor symptoms',
      actions: [
        'Get adequate rest',
        'Stay hydrated',
        'Monitor symptoms for 24-48 hours',
        'Consult doctor if symptoms worsen'
      ]
    }
  };

  return recommendations[triageLevel] || recommendations.HomeCare;
}

module.exports = exports;
