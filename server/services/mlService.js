const axios = require('axios');
const NodeCache = require('node-cache');
const logger = require('../utils/logger');

// Cache predictions for 5 minutes
const predictionCache = new NodeCache({ stdTTL: 300 });

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5001/api/ml/predict';
const ML_SERVICE_TIMEOUT = parseInt(process.env.ML_SERVICE_TIMEOUT) || 10000;

/**
 * Call Python Flask ML service for disease prediction
 * @param {Array} symptoms - Array of symptom strings
 * @param {Number} age - Patient age
 * @param {String} gender - Patient gender
 * @returns {Object} Prediction results
 */
exports.predictDisease = async (symptoms, age, gender) => {
  try {
    // Create cache key
    const cacheKey = `${symptoms.sort().join('_')}_${age}_${gender}`;
    
    // Check cache
    const cachedResult = predictionCache.get(cacheKey);
    if (cachedResult) {
      logger.info('Returning cached prediction');
      return cachedResult;
    }

    logger.info('Calling ML service:', { symptoms, age, gender });

    // Call Flask ML service
    const response = await axios.post(
      ML_SERVICE_URL,
      {
        symptoms: symptoms.map(s => s.toLowerCase()),
        age,
        gender
      },
      {
        timeout: ML_SERVICE_TIMEOUT,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const result = {
      predictions: response.data.predictions || [],
      confidence: response.data.confidence || 0,
      method: response.data.method || 'AI Machine Learning Model',
      modelVersion: response.data.model_version || 'v2'
    };

    // Cache result
    predictionCache.set(cacheKey, result);

    logger.info('ML prediction successful:', {
      topDisease: result.predictions[0]?.disease,
      confidence: result.confidence
    });

    return result;

  } catch (error) {
    logger.error('ML service error:', {
      message: error.message,
      url: ML_SERVICE_URL
    });

    // Return error indicator
    throw new Error('ML service unavailable');
  }
};

/**
 * Rule-based fallback prediction
 * @param {Array} symptoms - Array of symptom strings
 * @param {Number} age - Patient age
 * @param {String} gender - Patient gender
 * @returns {Object} Rule-based prediction results
 */
exports.ruleBasedPrediction = (symptoms, age, gender) => {
  const lowerSymptoms = symptoms.map(s => s.toLowerCase());
  const predictions = [];

  // Rule 1: Respiratory infections
  if (lowerSymptoms.includes('fever') && lowerSymptoms.includes('cough')) {
    let prob = 0.75;
    if (age > 65 || age < 5) prob += 0.1;
    predictions.push({
      disease: 'Respiratory Infection (Flu-like)',
      probability: Math.min(prob, 0.95)
    });
  }

  // Rule 2: Cardiac/Respiratory emergency
  const emergencySymptoms = ['chest pain', 'breathlessness', 'difficulty breathing', 'severe chest pain'];
  if (emergencySymptoms.some(s => lowerSymptoms.includes(s))) {
    let prob = 0.80;
    if (age > 50 && gender === 'Male') prob += 0.1;
    predictions.push({
      disease: 'Cardiac/Respiratory Concern',
      probability: Math.min(prob, 0.95)
    });
  }

  // Rule 3: Migraine/Vision issues
  if (lowerSymptoms.includes('headache') && lowerSymptoms.includes('blurred vision')) {
    predictions.push({
      disease: 'Migraine / Vision Issue',
      probability: 0.65
    });
  }

  // Rule 4: Gastrointestinal
  const giSymptoms = ['abdominal pain', 'vomiting', 'diarrhea', 'nausea'];
  if (giSymptoms.filter(s => lowerSymptoms.includes(s)).length >= 2) {
    predictions.push({
      disease: 'Gastrointestinal Issue',
      probability: 0.70
    });
  }

  // Rule 5: Common cold/allergies
  if (lowerSymptoms.includes('runny nose') && lowerSymptoms.includes('sneezing')) {
    predictions.push({
      disease: 'Common Cold / Allergies',
      probability: 0.60
    });
  }

  // Rule 6: Allergic reaction
  if (lowerSymptoms.includes('rash') || lowerSymptoms.includes('itchy eyes')) {
    predictions.push({
      disease: 'Allergic Reaction',
      probability: 0.65
    });
  }

  // Rule 7: Influenza
  if (lowerSymptoms.includes('fever') && lowerSymptoms.includes('fatigue') && lowerSymptoms.includes('body aches')) {
    predictions.push({
      disease: 'Influenza',
      probability: 0.78
    });
  }

  // Sort by probability descending
  predictions.sort((a, b) => b.probability - a.probability);

  // If no predictions, return generic
  if (predictions.length === 0) {
    predictions.push({
      disease: 'General Health Check Recommended',
      probability: 0.50
    });
  }

  // Take top 3
  const topPredictions = predictions.slice(0, 3);

  return {
    predictions: topPredictions,
    confidence: topPredictions[0].probability,
    method: 'Rule-based Clinical Analysis',
    modelVersion: 'rule_v1'
  };
};
