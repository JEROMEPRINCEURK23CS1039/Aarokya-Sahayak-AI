const mongoose = require('mongoose');
const Hospital = require('../models/Hospital');
require('dotenv').config();

const hospitals = [
  {
    name: 'All India Institute of Medical Sciences (AIIMS)',
    type: 'Super Specialty',
    address: {
      street: 'Ansari Nagar',
      district: 'New Delhi',
      state: 'Delhi',
      pincode: '110029'
    },
    location: {
      type: 'Point',
      coordinates: [77.2090, 28.5672] // [longitude, latitude]
    },
    contact: {
      phone: '1126588500',
      emergency: '1126588700',
      website: 'https://www.aiims.edu',
      email: 'aiimsnewdelhi@gmail.com'
    },
    specialties: ['Cardiology', 'Neurology', 'Oncology', 'Orthopedics', 'Pediatrics'],
    facilities: ['ICU', 'Emergency', 'OT', 'Ambulance', 'Blood Bank', 'Pharmacy'],
    isAvailable: true,
    rating: 4.5,
    totalRatings: 1200,
    beds: {
      total: 2500,
      available: 150
    }
  },
  {
    name: 'Apollo Hospital',
    type: 'Multi-Specialty',
    address: {
      street: 'Sarita Vihar',
      district: 'South Delhi',
      state: 'Delhi',
      pincode: '110076'
    },
    location: {
      type: 'Point',
      coordinates: [77.2900, 28.5355]
    },
    contact: {
      phone: '1126825000',
      emergency: '1126825050',
      website: 'https://www.apollohospitals.com',
      email: 'enquiry@apollohospdelhi.com'
    },
    specialties: ['Cardiology', 'Nephrology', 'Gastroenterology', 'Urology'],
    facilities: ['ICU', 'Emergency', 'OT', 'Ambulance', 'Blood Bank', 'Pharmacy'],
    isAvailable: true,
    rating: 4.3,
    totalRatings: 850,
    beds: {
      total: 700,
      available: 45
    }
  },
  {
    name: 'Fortis Hospital',
    type: 'Multi-Specialty',
    address: {
      street: 'Sector B, Pocket 1',
      district: 'South Delhi',
      state: 'Delhi',
      pincode: '110025'
    },
    location: {
      type: 'Point',
      coordinates: [77.2070, 28.5244]
    },
    contact: {
      phone: '1142776222',
      emergency: '1142776000',
      website: 'https://www.fortishealthcare.com'
    },
    specialties: ['Cardiology', 'Oncology', 'Neurology', 'Orthopedics'],
    facilities: ['ICU', 'Emergency', 'OT', 'Ambulance', 'Blood Bank'],
    isAvailable: true,
    rating: 4.2,
    totalRatings: 620,
    beds: {
      total: 400,
      available: 30
    }
  },
  {
    name: 'Max Super Speciality Hospital',
    type: 'Super Specialty',
    address: {
      street: 'Press Enclave Road',
      district: 'South Delhi',
      state: 'Delhi',
      pincode: '110017'
    },
    location: {
      type: 'Point',
      coordinates: [77.2150, 28.5430]
    },
    contact: {
      phone: '1126515050',
      emergency: '1126515000',
      website: 'https://www.maxhealthcare.in'
    },
    specialties: ['Cardiology', 'Oncology', 'Neurosurgery', 'Transplant'],
    facilities: ['ICU', 'Emergency', 'OT', 'Ambulance', 'Blood Bank', 'Pharmacy'],
    isAvailable: true,
    rating: 4.4,
    totalRatings: 750,
    beds: {
      total: 500,
      available: 40
    }
  },
  {
    name: 'Government General Hospital',
    type: 'Government',
    address: {
      street: 'Park Town',
      district: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600003'
    },
    location: {
      type: 'Point',
      coordinates: [80.2707, 13.0827]
    },
    contact: {
      phone: '4425305000',
      emergency: '4425305108'
    },
    specialties: ['General Medicine', 'Surgery', 'Pediatrics', 'Gynecology'],
    facilities: ['Emergency', 'OT', 'Ambulance', 'Blood Bank', 'Pharmacy'],
    isAvailable: true,
    rating: 3.8,
    totalRatings: 420,
    beds: {
      total: 2000,
      available: 200
    }
  }
];

async function seedHospitals() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/aarogya-sahayak');
    console.log('Connected to MongoDB');

    // Clear existing hospitals
    await Hospital.deleteMany({});
    console.log('Cleared existing hospitals');

    // Insert new hospitals
    const result = await Hospital.insertMany(hospitals);
    console.log(`✅ Inserted ${result.length} hospitals`);

    mongoose.connection.close();
    console.log('Database connection closed');

  } catch (error) {
    console.error('Error seeding hospitals:', error);
    process.exit(1);
  }
}

seedHospitals();
