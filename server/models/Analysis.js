const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  symptoms: [{
    type: String,
    required: true
  }],
  duration: {
    type: Number, // in days
    required: true
  },
  intensity: {
    type: String,
    enum: ['Mild', 'Moderate', 'Severe'],
    required: true
  },
  predictions: [{
    disease: {
      type: String,
      required: true
    },
    probability: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    icdCode: String
  }],
  triageLevel: {
    type: String,
    enum: ['Emergency', 'Urgent', 'OPD', 'HomeCare'],
    required: true
  },
  method: {
    type: String,
    enum: ['AI', 'Rule-based', 'XGBoost Classifier'],
    required: true
  },
  confidence: {
    type: Number,
    min: 0,
    max: 100
  },
  feedback: {
    accurate: Boolean,
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comments: String,
    submittedAt: Date
  },
  metadata: {
    age: Number,
    gender: String,
    location: {
      state: String,
      district: String
    }
  }
}, {
  timestamps: true
});

// Index for user lookups
analysisSchema.index({ userId: 1, createdAt: -1 });
// Index for analytics queries
analysisSchema.index({ 'predictions.disease': 1, createdAt: -1 });
analysisSchema.index({ 'metadata.location.state': 1, createdAt: -1 });

module.exports = mongoose.model('Analysis', analysisSchema);
