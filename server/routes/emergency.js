const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');

/**
 * Request ambulance
 * POST /api/v1/emergency/ambulance
 */
router.post('/ambulance', verifyToken, (req, res) => {
  const { location, patientDetails, emergency } = req.body;
  
  // Socket.IO handles the real-time ambulance request
  // This endpoint just creates the initial request
  
  res.json({
    success: true,
    message: 'Ambulance request created. Use Socket.IO for real-time updates.',
    requestId: Math.random().toString(36).substr(2, 9)
  });
});

/**
 * Get emergency hotlines by state
 * GET /api/v1/emergency/hotlines?state=Odisha
 */
router.get('/hotlines', (req, res) => {
  const { state } = req.query;
  
  const hotlines = {
    'All India': [
      { name: 'National Emergency', number: '112', description: 'Universal emergency number' },
      { name: 'Ambulance', number: '108', description: 'Free ambulance service' },
      { name: 'Medical Helpline', number: '104', description: 'Medical consultation' },
      { name: 'Women Helpline', number: '1091', description: 'Women emergency' },
      { name: 'Child Helpline', number: '1098', description: 'Child emergency' }
    ],
    'Odisha': [
      { name: 'State Ambulance', number: '108', description: 'Odisha ambulance service' },
      { name: 'COVID Helpline', number: '104', description: 'COVID-19 helpline' },
      { name: 'Health Helpline', number: '0674-2390466', description: 'Odisha health helpline' }
    ],
    'Karnataka': [
      { name: 'State Ambulance', number: '108', description: 'Karnataka ambulance' },
      { name: 'Arogya Sahayavani', number: '104', description: 'Health helpline' }
    ],
    'Maharashtra': [
      { name: 'State Ambulance', number: '108', description: 'Maharashtra ambulance' },
      { name: 'Health Helpline', number: '104', description: 'Medical consultation' }
    ],
    'Tamil Nadu': [
      { name: 'State Ambulance', number: '108', description: 'Tamil Nadu ambulance' },
      { name: 'Health Helpline', number: '104', description: 'Medical helpline' }
    ]
  };
  
  let result = hotlines['All India'];
  
  if (state && hotlines[state]) {
    result = [...hotlines['All India'], ...hotlines[state]];
  }
  
  res.json({
    success: true,
    state: state || 'All India',
    hotlines: result
  });
});

module.exports = router;
