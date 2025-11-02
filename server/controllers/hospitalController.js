const Hospital = require('../models/Hospital');
const logger = require('../utils/logger');
const { haversineDistance } = require('../utils/haversine');

/**
 * Get nearby hospitals using geospatial search
 * GET /api/v1/hospitals/nearby?lat=X&lon=Y&radius=Z
 */
exports.getNearbyHospitals = async (req, res) => {
  try {
    const { lat, lon, radius = 10, type, specialty, limit = 20 } = req.query;

    // Validate coordinates
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    if (!latitude || !longitude || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return res.status(400).json({
        success: false,
        message: 'Valid latitude and longitude are required'
      });
    }

    const radiusInKm = parseFloat(radius);
    if (radiusInKm <= 0 || radiusInKm > 100) {
      return res.status(400).json({
        success: false,
        message: 'Radius must be between 0 and 100 km'
      });
    }

    // Build query
    const query = {
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          $maxDistance: radiusInKm * 1000 // Convert km to meters
        }
      }
    };

    // Add filters
    if (type) {
      query.type = type;
    }

    if (specialty) {
      query.specialties = { $in: [specialty] };
    }

    // Execute query
    const hospitals = await Hospital.find(query)
      .limit(parseInt(limit))
      .select('-__v');

    // Calculate distances
    const hospitalsWithDistance = hospitals.map(hospital => {
      const distance = haversineDistance(
        latitude,
        longitude,
        hospital.location.coordinates[1],
        hospital.location.coordinates[0]
      );

      return {
        ...hospital.toObject(),
        distance: Math.round(distance * 100) / 100 // Round to 2 decimals
      };
    });

    // Sort by distance
    hospitalsWithDistance.sort((a, b) => a.distance - b.distance);

    logger.info('Nearby hospitals search:', {
      lat: latitude,
      lon: longitude,
      radius: radiusInKm,
      found: hospitals.length
    });

    res.json({
      success: true,
      count: hospitalsWithDistance.length,
      location: {
        latitude,
        longitude,
        radius: radiusInKm
      },
      hospitals: hospitalsWithDistance
    });

  } catch (error) {
    logger.error('Get nearby hospitals error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch nearby hospitals',
      error: error.message
    });
  }
};

/**
 * Get hospital by ID
 * GET /api/v1/hospitals/:id
 */
exports.getHospitalById = async (req, res) => {
  try {
    const { id } = req.params;

    const hospital = await Hospital.findById(id).select('-__v');

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: 'Hospital not found'
      });
    }

    res.json({
      success: true,
      hospital
    });

  } catch (error) {
    logger.error('Get hospital by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hospital'
    });
  }
};

/**
 * Filter hospitals by criteria
 * GET /api/v1/hospitals/filter
 */
exports.filterHospitals = async (req, res) => {
  try {
    const {
      state,
      district,
      type,
      specialty,
      minRating,
      availableBedsOnly,
      limit = 50,
      skip = 0
    } = req.query;

    // Build query
    const query = {};

    if (state) {
      query['address.state'] = state;
    }

    if (district) {
      query['address.district'] = district;
    }

    if (type) {
      query.type = type;
    }

    if (specialty) {
      query.specialties = { $in: [specialty] };
    }

    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) };
    }

    if (availableBedsOnly === 'true') {
      query['beds.available'] = { $gt: 0 };
    }

    // Execute query
    const hospitals = await Hospital.find(query)
      .sort({ rating: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .select('-__v');

    const total = await Hospital.countDocuments(query);

    logger.info('Filter hospitals:', {
      filters: query,
      found: hospitals.length
    });

    res.json({
      success: true,
      count: hospitals.length,
      total,
      hospitals
    });

  } catch (error) {
    logger.error('Filter hospitals error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to filter hospitals'
    });
  }
};

/**
 * Get available specialties
 * GET /api/v1/hospitals/specialties
 */
exports.getSpecialties = async (req, res) => {
  try {
    const specialties = await Hospital.distinct('specialties');

    res.json({
      success: true,
      count: specialties.length,
      specialties: specialties.sort()
    });

  } catch (error) {
    logger.error('Get specialties error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch specialties'
    });
  }
};

/**
 * Get states and districts
 * GET /api/v1/hospitals/locations
 */
exports.getLocations = async (req, res) => {
  try {
    const states = await Hospital.distinct('address.state');
    
    const locations = await Promise.all(
      states.map(async (state) => {
        const districts = await Hospital.distinct('address.district', { 'address.state': state });
        return {
          state,
          districts: districts.sort()
        };
      })
    );

    res.json({
      success: true,
      count: locations.length,
      locations: locations.sort((a, b) => a.state.localeCompare(b.state))
    });

  } catch (error) {
    logger.error('Get locations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch locations'
    });
  }
};

module.exports = exports;
