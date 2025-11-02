const express = require('express');
const router = express.Router();
const {
  getNearbyHospitals,
  getHospitalById,
  filterHospitals,
  getSpecialties,
  getLocations
} = require('../controllers/hospitalController');

// GET /api/v1/hospitals/nearby - Geospatial search
router.get('/nearby', getNearbyHospitals);

// GET /api/v1/hospitals/filter - Filter hospitals
router.get('/filter', filterHospitals);

// GET /api/v1/hospitals/specialties - Get all specialties
router.get('/specialties', getSpecialties);

// GET /api/v1/hospitals/locations - Get states and districts
router.get('/locations', getLocations);

// GET /api/v1/hospitals/:id - Get single hospital (must be last)
router.get('/:id', getHospitalById);

module.exports = router;
