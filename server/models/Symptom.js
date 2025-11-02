const mongoose = require('mongoose');

const symptomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['General', 'Respiratory', 'Gastrointestinal', 'Neurological', 'Cardiovascular', 'Dermatological', 'Musculoskeletal', 'Other']
  },
  severity: {
    type: String,
    enum: ['Mild', 'Moderate', 'Severe', 'Critical']
  },
  translations: {
    hi: String, // Hindi
    or: String, // Odia
    ta: String, // Tamil
    kn: String, // Kannada
    ml: String, // Malayalam
    mr: String  // Marathi
  },
  commonDiseases: [String], // Associated diseases
  description: String
}, {
  timestamps: true
});

// Index for search
symptomSchema.index({ name: 'text' });
symptomSchema.index({ category: 1 });

module.exports = mongoose.model('Symptom', symptomSchema);
