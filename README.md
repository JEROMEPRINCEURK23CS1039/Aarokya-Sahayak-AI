# Aarogya Sahayak AI - Healthcare Assistant Platform

> **Full-Stack MERN Application with Machine Learning Integration**

A comprehensive healthcare platform providing AI-powered symptom analysis, disease prediction, hospital locator, and emergency services.

## 🏥 Overview

**Aarogya Sahayak AI** combines Machine Learning disease prediction using trained XGBoost models, geospatial hospital search, real-time emergency services, multilingual support, and analytics dashboards for disease outbreak tracking.

## 🛠️ Technology Stack

- **Frontend:** React 18.2+ (Vite), Material-UI, Redux Toolkit, React-Leaflet, Chart.js
- **Backend:** Node.js 18+, Express.js 4.x, MongoDB 6.0+, Socket.IO, JWT Authentication
- **ML Service:** Python 3.9+, Flask, XGBoost, Scikit-learn, Pre-trained PKL models

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ ([Download](https://nodejs.org/))
- Python 3.9+ ([Download](https://www.python.org/))
- MongoDB 6.0+ ([Download](https://www.mongodb.com/try/download/community))

### Installation

**1. Install Backend Dependencies**
```powershell
cd "C:\Users\jancy\Desktop\3rd Ia web tech\server"
npm install
copy .env.example .env
```

**2. Install Frontend Dependencies**
```powershell
cd ..\client
npm install
```

**3. Install Python ML Service**
```powershell
cd ..\ml-service
pip install -r requirements.txt
```

**4. Start MongoDB**
```powershell
net start MongoDB
```

### Running the Application

**Terminal 1: Python ML Service**
```powershell
cd "C:\Users\jancy\Desktop\3rd Ia web tech\ml-service"
python app.py
```
✅ ML Service: http://localhost:5001

**Terminal 2: Node.js Backend**
```powershell
cd "C:\Users\jancy\Desktop\3rd Ia web tech\server"
npm run dev
```
✅ Backend API: http://localhost:5000

**Terminal 3: React Frontend**
```powershell
cd "C:\Users\jancy\Desktop\3rd Ia web tech\client"
npm run dev
```
✅ Frontend: http://localhost:5173

## 📊 Key Features

- **Intelligent Symptom Analysis** with XGBoost ML predictions
- **Hospital Locator** with geospatial search and Leaflet maps
- **User Authentication** with JWT and profile management
- **Analytics Dashboard** for disease outbreak tracking
- **Emergency Services** with real-time ambulance tracking
- **Multilingual Support** (EN, HI, OR, TA, KN, ML, MR)

## 🔌 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/me` - Get current user

### Symptom Analysis
- `POST /api/v1/analysis/predict` - Analyze symptoms
- `GET /api/v1/analysis/history/:userId` - Get history

### Hospitals
- `GET /api/v1/hospitals/nearby?lat=&lon=&radius=` - Find nearby hospitals
- `GET /api/v1/hospitals/:id` - Get hospital details

### ML Service
- `POST /api/ml/predict` - Disease prediction
- `GET /health` - Health check

## 🔒 Security

- Helmet.js security headers
- CORS configuration
- Rate limiting (100 req/15 min)
- JWT with refresh tokens
- bcrypt password hashing

## 📝 Environment Variables

**Server (.env)**
```ini
PORT=5000
MONGO_URI=mongodb://localhost:27017/aarogya-sahayak
JWT_SECRET=your-secret-key
ML_SERVICE_URL=http://localhost:5001/api/ml/predict
```

## 🐛 Troubleshooting

**MongoDB Connection Error:** Ensure MongoDB is running with `net start MongoDB`

**PKL Files Not Found:** Copy `disease_predictor_v2.pkl` and `processed_data_info.pkl` to `ml-service/` directory

For detailed documentation, see inline comments in source files.
