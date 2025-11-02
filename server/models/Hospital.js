const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Hospital name is required'],
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Government', 'Private', 'Super Specialty', 'Multi-Specialty', 'Clinic']
  },
  address: {
    street: String,
    district: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      match: [/^[0-9]{6}$/, 'Please enter a valid 6-digit pincode']
    }
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
      validate: {
        validator: function(v) {
          return v.length === 2 && v[0] >= -180 && v[0] <= 180 && v[1] >= -90 && v[1] <= 90;
        },
        message: 'Invalid coordinates'
      }
    }
  },
  contact: {
    phone: {
      type: String,
      match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
    },
    emergency: String,
    website: String,
    email: String
  },
  specialties: [String],
  facilities: [String],
  availability: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  beds: {
    total: Number,
    available: Number
  },
  timings: {
    type: String,
    default: '24/7'
  }
}, {
  timestamps: true
});

// Create 2dsphere index for geospatial queries
hospitalSchema.index({ location: '2dsphere' });
// Index for filtering
hospitalSchema.index({ type: 1, 'address.state': 1 });
hospitalSchema.index({ specialties: 1 });

module.exports = mongoose.model('Hospital', hospitalSchema);
