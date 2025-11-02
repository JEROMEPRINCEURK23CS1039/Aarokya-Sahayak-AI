# Aarogya Sahayak AI Healthcare Platform

## 🚀 Quick Start (One-Click Setup)

### First Time Setup
1. Double-click `setup.bat` to install all dependencies
2. Wait for installation to complete (5-10 minutes)

### Running the Application
1. Double-click `start.bat` to start all services
2. The application will automatically open in your browser at http://localhost:5173

### Stopping the Application
- Double-click `stop.bat` to stop all services
- Or simply close all the terminal windows

## 📋 Manual Commands

If you prefer running commands manually:

### Backend Server
```bash
cd server
npm run dev
# Runs on http://localhost:5000
```

### Frontend
```bash
cd client
npm run dev
# Runs on http://localhost:5173
```

### ML Service (Optional)
```bash
cd ml-service
python app.py
# Runs on http://localhost:5001
```

## 🗄️ Database Seeding

To populate the database with sample data:

```bash
cd server
node scripts/seedSymptoms.js
node scripts/seedHospitals.js
```

## 🔧 Prerequisites

- Node.js 18+ (https://nodejs.org/)
- MongoDB 6.0+ (Already installed)
- Python 3.9+ (Optional, for ML service)

## 📦 Tech Stack

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Socket.IO for real-time features
- Winston for logging

### Frontend
- React 18 + TypeScript
- Redux Toolkit
- Material-UI
- React-Leaflet for maps
- Chart.js for analytics

### ML Service
- Flask + Python
- XGBoost for disease prediction
- Scikit-learn

## 🌐 API Endpoints

### Authentication
- POST `/api/v1/auth/register` - Register new user
- POST `/api/v1/auth/login` - Login
- POST `/api/v1/auth/refresh` - Refresh token
- POST `/api/v1/auth/logout` - Logout
- GET `/api/v1/auth/me` - Get current user

### Analysis
- POST `/api/v1/analysis/predict` - Analyze symptoms
- GET `/api/v1/analysis/history/:userId` - Get analysis history
- POST `/api/v1/analysis/feedback` - Submit feedback
- GET `/api/v1/analysis/symptoms` - Get all symptoms

### Hospitals
- GET `/api/v1/hospitals/nearby?lat=X&lon=Y&radius=Z` - Find nearby hospitals
- GET `/api/v1/hospitals/filter` - Filter hospitals
- GET `/api/v1/hospitals/:id` - Get hospital details
- GET `/api/v1/hospitals/specialties` - Get all specialties
- GET `/api/v1/hospitals/locations` - Get states and districts

### Users
- GET `/api/v1/users/:id` - Get user profile
- PUT `/api/v1/users/:id` - Update profile
- PUT `/api/v1/users/:id/medical-history` - Update medical history
- DELETE `/api/v1/users/:id` - Delete account

### Analytics (Admin)
- GET `/api/v1/analytics/dashboard` - Dashboard statistics
- GET `/api/v1/analytics/disease-trends` - Disease trends
- GET `/api/v1/analytics/outbreaks` - Outbreak hotspots
- GET `/api/v1/analytics/feedback` - Feedback statistics

### Emergency
- POST `/api/v1/emergency/ambulance` - Request ambulance
- GET `/api/v1/emergency/hotlines` - Get emergency numbers

## 🔒 Environment Variables

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/aarogya-sahayak
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-refresh-secret-key-change-in-production
ML_SERVICE_URL=http://localhost:5001/api/ml/predict
CLIENT_URL=http://localhost:5173
DATA_DIR=C:\Users\jancy\Desktop\3rd Ia web tech\data
```

## 🧪 Testing

Test the backend health:
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-11-03T...",
  "mongodb": "connected"
}
```

## 📱 Features

- ✅ Symptom-based disease prediction
- ✅ AI/ML integration with fallback rules
- ✅ Geospatial hospital search
- ✅ Real-time ambulance tracking
- ✅ Multilingual support (English, Hindi, Odia, Tamil, Kannada, Malayalam, Marathi)
- ✅ Triage level determination
- ✅ Emergency hotlines
- ✅ Disease outbreak tracking
- ✅ Analytics dashboard
- ✅ Medical history management
- ✅ JWT authentication

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
sc query MongoDB

# Start MongoDB manually
net start MongoDB
```

### Port Already in Use
```bash
# Stop all services
.\stop.bat

# Then restart
.\start.bat
```

### Node Modules Issues
```bash
# Clean install
cd server
rmdir /s /q node_modules
npm install

cd ../client
rmdir /s /q node_modules
npm install
```

## 📄 License

MIT License

## 👥 Support

For issues and questions, please check the project documentation or create an issue on GitHub.
