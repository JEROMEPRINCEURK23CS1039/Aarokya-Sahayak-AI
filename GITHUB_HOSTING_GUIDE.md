# 🚀 GitHub Hosting Guide - Healthcare AI Application

## 📋 Complete Deployment Guide

---

## PART 1: SETUP GITHUB REPOSITORY

### Step 1: Install Git (If Not Installed)

1. **Download Git:**
   - Go to: https://git-scm.com/download/win
   - Download Git for Windows
   - Run the installer (use default settings)

2. **Verify Installation:**
   ```bash
   git --version
   ```

### Step 2: Create GitHub Account

1. Go to: https://github.com
2. Sign up for free account
3. Verify your email

### Step 3: Create New Repository

1. Click the **"+"** icon (top right) → **"New repository"**
2. **Repository name:** `healthcare-ai-app` (or your preferred name)
3. **Description:** "AI-powered healthcare symptom analysis platform"
4. **Visibility:** 
   - ✅ Public (free hosting options)
   - ⚠️ Private (if you want to keep code private)
5. ❌ **DO NOT** initialize with README (we'll add our own)
6. Click **"Create repository"**

---

## PART 2: PREPARE YOUR PROJECT

### Step 1: Create .gitignore File

Create a file named `.gitignore` in your project root:

```gitignore
# Node modules
node_modules/
*/node_modules/

# Environment variables
.env
.env.local
.env.development
.env.production
server/.env
client/.env

# Build outputs
dist/
build/
*/dist/
*/build/

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# OS files
.DS_Store
Thumbs.db
desktop.ini

# IDE files
.vscode/
.idea/
*.swp
*.swo
*~

# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
ml-service/venv/
ml-service/.venv/

# Data files (optional - if large)
data/*.csv
data/*.json
!data/README.md

# Temporary files
*.tmp
*.temp
.cache/

# MongoDB data (local)
data/db/
```

### Step 2: Create README.md

Create an attractive README for your project:

```markdown
# 🏥 Aarogya Sahayak - AI Healthcare Assistant

> An intelligent healthcare platform for symptom analysis and disease prediction using machine learning

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 🌟 Features

- 🤖 **AI-Powered Diagnosis** - Machine learning-based disease prediction
- 🏥 **Hospital Finder** - Locate nearby healthcare facilities
- 📊 **Health Dashboard** - Track your health history
- 🚨 **Triage System** - Emergency/Urgent/OPD/Home Care classification
- 📱 **Responsive Design** - Works on all devices
- 🌙 **Dark Mode** - Modern, eye-friendly interface

## 🛠️ Tech Stack

**Frontend:**
- React 18 + TypeScript
- Material-UI (MUI)
- Redux Toolkit
- Recharts (Data Visualization)
- React Leaflet (Maps)

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Socket.io (Real-time features)

**ML Service:**
- Python + Flask
- XGBoost Classifier
- Scikit-learn

## 📦 Installation

### Prerequisites
- Node.js (v16+)
- Python (v3.8+)
- MongoDB (v5+)

### 1. Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/healthcare-ai-app.git
cd healthcare-ai-app
```

### 2. Setup Backend
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

### 3. Setup Frontend
```bash
cd client
npm install
npm run dev
```

### 4. Setup ML Service
```bash
cd ml-service
pip install -r requirements.txt
python app.py
```

## 🚀 Quick Start

1. **Start MongoDB:**
   ```bash
   net start MongoDB
   ```

2. **Run all services:**
   ```bash
   # From project root
   start.bat  # Windows
   # OR
   ./start.sh # Linux/Mac
   ```

3. **Access Application:**
   - Frontend: http://localhost:5174
   - Backend API: http://localhost:5000
   - ML Service: http://localhost:5001

## 📸 Screenshots

[Add screenshots here]

## 🔐 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/aarogya-sahayak
JWT_SECRET=your-secret-key
ML_SERVICE_URL=http://localhost:5001/api/ml/predict
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api/v1
```

## 🌐 Deployment

### Option 1: Vercel (Frontend) + Railway (Backend)
- Frontend: Deploy to Vercel
- Backend: Deploy to Railway
- Database: MongoDB Atlas

### Option 2: Heroku (Full Stack)
- Use Heroku for backend + frontend
- Use MongoDB Atlas for database

### Option 3: AWS/Azure
- EC2/App Service for backend
- S3/Blob Storage for frontend
- Atlas for database

## 📚 API Documentation

### Authentication
- `POST /api/v1/auth/register` - Create account
- `POST /api/v1/auth/login` - User login

### Analysis
- `POST /api/v1/analysis/predict` - Analyze symptoms
- `GET /api/v1/analysis/history/:userId` - Get history

### Hospitals
- `GET /api/v1/hospitals` - Get hospitals near location

[Full API docs in /docs/API.md]

## 🧪 Testing

```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- Disease dataset from [source]
- Hospital data from [source]
- Inspired by healthcare accessibility needs in India

## 📞 Support

For support, email: your.email@example.com

---

⭐ **Star this repo if you find it helpful!**
```

### Step 3: Create .env.example Files

**For Backend (server/.env.example):**
```env
# Server Configuration
PORT=5000
NODE_ENV=production

# MongoDB Configuration (Use MongoDB Atlas for production)
MONGO_URI=mongodb://localhost:27017/aarogya-sahayak

# JWT Configuration
JWT_SECRET=CHANGE_THIS_TO_SECURE_RANDOM_STRING
JWT_REFRESH_SECRET=CHANGE_THIS_TO_ANOTHER_SECURE_STRING
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# ML Service Configuration
ML_SERVICE_URL=http://localhost:5001/api/ml/predict
ML_SERVICE_TIMEOUT=10000

# CORS Configuration
CLIENT_URL=http://localhost:5173
```

**For Frontend (client/.env.example):**
```env
# API Configuration
VITE_API_URL=http://localhost:5000/api/v1

# Map Configuration (if using maps)
VITE_MAPBOX_TOKEN=your_mapbox_token_here
```

---

## PART 3: PUSH TO GITHUB

### Open Terminal in Project Root

```bash
# Navigate to your project folder
cd "C:\Users\jancy\Desktop\3rd Ia web tech"

# Initialize Git
git init

# Configure Git (first time only)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Add all files
git add .

# Commit
git commit -m "Initial commit: Healthcare AI Application"

# Add remote repository (replace with YOUR GitHub URL)
git remote add origin https://github.com/YOUR_USERNAME/healthcare-ai-app.git

# Push to GitHub
git push -u origin main
```

**Note:** If you get an error about 'master' vs 'main', run:
```bash
git branch -M main
git push -u origin main
```

---

## PART 4: DEPLOYMENT OPTIONS

### Option 1: Deploy Frontend to Vercel (FREE & EASY)

**Vercel - Perfect for React apps**

1. **Sign up at:** https://vercel.com
2. **Connect GitHub:** Link your GitHub account
3. **Import Project:** 
   - Click "New Project"
   - Select your repository
   - Framework: Vite
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Environment Variables: Add your API URL

4. **Deploy:** Click "Deploy" button
5. **Done!** You'll get a URL like: `https://your-app.vercel.app`

**Frontend Environment Variables on Vercel:**
```
VITE_API_URL=https://your-backend-url.railway.app/api/v1
```

### Option 2: Deploy Backend to Railway (FREE TIER)

**Railway - Free hosting for Node.js**

1. **Sign up at:** https://railway.app
2. **New Project → Deploy from GitHub**
3. **Select your repository**
4. **Settings:**
   - Root Directory: `server`
   - Start Command: `npm start`
   - Environment Variables: Add all from .env

5. **Database:** 
   - Add MongoDB plugin (or use MongoDB Atlas)
   - Railway will provide MONGO_URI automatically

6. **Deploy:** Automatic on every push!

**Backend Environment Variables on Railway:**
```
PORT=5000
NODE_ENV=production
MONGO_URI=[Railway provides this]
JWT_SECRET=your-secure-secret
ML_SERVICE_URL=https://your-ml-service-url
CLIENT_URL=https://your-app.vercel.app
```

### Option 3: Deploy ML Service to Render (FREE)

**Render - Free Python hosting**

1. **Sign up at:** https://render.com
2. **New → Web Service**
3. **Connect repository**
4. **Settings:**
   - Environment: Python 3
   - Root Directory: `ml-service`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python app.py`

5. **Deploy:** Click "Create Web Service"

### Option 4: MongoDB Atlas (FREE Cloud Database)

**MongoDB Atlas - Cloud database**

1. **Sign up at:** https://www.mongodb.com/cloud/atlas
2. **Create Cluster:** (FREE M0 tier)
3. **Get Connection String:**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/aarogya-sahayak
   ```
4. **Whitelist IP:** Add `0.0.0.0/0` (allow from anywhere)
5. **Create Database User**
6. **Use connection string in your backend .env**

---

## PART 5: COMPLETE DEPLOYMENT FLOW

### Recommended Architecture

```
┌─────────────────────┐
│   Vercel (Frontend) │  ← User accesses here
│   your-app.vercel.app│
└──────────┬──────────┘
           │
           ↓ API Calls
┌─────────────────────┐
│  Railway (Backend)  │
│  API + Socket.io    │
└──────────┬──────────┘
           │
      ┌────┴────┐
      ↓         ↓
┌──────────┐  ┌─────────────┐
│ MongoDB  │  │   Render    │
│  Atlas   │  │ (ML Service)│
└──────────┘  └─────────────┘
```

### Step-by-Step Deployment

1. **Setup MongoDB Atlas** (Database)
   - Create cluster
   - Get connection string
   - Save for later

2. **Deploy ML Service to Render** (Python)
   - Connect GitHub
   - Deploy `ml-service` folder
   - Get URL (e.g., `https://ml-service.onrender.com`)

3. **Deploy Backend to Railway** (Node.js)
   - Connect GitHub
   - Deploy `server` folder
   - Add environment variables:
     - `MONGO_URI`: Atlas connection string
     - `ML_SERVICE_URL`: Render ML service URL
     - `JWT_SECRET`: Random secure string
     - `CLIENT_URL`: (will add after frontend deployment)
   - Get URL (e.g., `https://backend.railway.app`)

4. **Deploy Frontend to Vercel** (React)
   - Connect GitHub
   - Deploy `client` folder
   - Add environment variable:
     - `VITE_API_URL`: Railway backend URL
   - Get URL (e.g., `https://healthcare.vercel.app`)

5. **Update Backend CLIENT_URL**
   - Go back to Railway
   - Update `CLIENT_URL` with Vercel URL
   - Redeploy

6. **Test Your Live App! 🎉**

---

## PART 6: CONTINUOUS DEPLOYMENT

Once setup, every time you push to GitHub:

```bash
# Make changes to your code
git add .
git commit -m "Add new feature"
git push

# Automatic deployments:
# ✓ Vercel redeploys frontend
# ✓ Railway redeploys backend
# ✓ Render redeploys ML service
```

---

## 🎯 PRICING SUMMARY

| Service | Free Tier | Best For |
|---------|-----------|----------|
| **Vercel** | Unlimited hobby projects | Frontend (React) |
| **Railway** | $5 credit/month | Backend (Node.js) |
| **Render** | 750 hours/month | ML Service (Python) |
| **MongoDB Atlas** | 512MB storage | Database |
| **GitHub** | Unlimited public repos | Code hosting |

**Total Cost: $0/month** (within free tiers)

---

## 📋 PRE-DEPLOYMENT CHECKLIST

- [ ] Remove sensitive data from code
- [ ] Create `.gitignore` file
- [ ] Create `.env.example` files
- [ ] Write comprehensive README.md
- [ ] Test locally before deploying
- [ ] Setup MongoDB Atlas
- [ ] Deploy ML service first
- [ ] Deploy backend second
- [ ] Deploy frontend last
- [ ] Update CORS settings
- [ ] Test production app
- [ ] Setup custom domain (optional)

---

## 🔒 SECURITY BEST PRACTICES

1. **Never commit `.env` files** (use .gitignore)
2. **Use strong JWT secrets** (random 64+ characters)
3. **Setup CORS properly** (whitelist specific domains)
4. **Use HTTPS** (automatic on Vercel/Railway/Render)
5. **Whitelist MongoDB IPs** (or use 0.0.0.0/0 for development)
6. **Enable rate limiting** (already in code)
7. **Validate all inputs** (already in code)

---

## 🆘 TROUBLESHOOTING

### Git Issues
```bash
# If "git not found"
# Install Git from: https://git-scm.com

# If authentication fails
git config --global credential.helper wincred
```

### Deployment Issues
```bash
# Vercel build fails
# Check: Build command and output directory
# Fix: Ensure package.json has correct scripts

# Railway backend crashes
# Check: Logs in Railway dashboard
# Fix: Ensure environment variables are set

# MongoDB connection fails
# Check: Whitelist IPs in MongoDB Atlas
# Fix: Add 0.0.0.0/0 to IP whitelist
```

---

## 📚 ADDITIONAL RESOURCES

- **Git Tutorial:** https://git-scm.com/docs
- **GitHub Guides:** https://guides.github.com
- **Vercel Docs:** https://vercel.com/docs
- **Railway Docs:** https://docs.railway.app
- **Render Docs:** https://render.com/docs
- **MongoDB Atlas:** https://docs.atlas.mongodb.com

---

## ✅ QUICK COMMAND REFERENCE

```bash
# Git basics
git init                          # Initialize repository
git add .                         # Stage all files
git commit -m "message"           # Commit changes
git push origin main              # Push to GitHub
git status                        # Check status
git log                           # View history

# Branch management
git branch feature-name           # Create branch
git checkout feature-name         # Switch branch
git merge feature-name            # Merge branch

# Remote
git remote -v                     # View remotes
git remote add origin <url>       # Add remote
git pull origin main              # Pull latest changes
```

---

**🎉 You're ready to host your project on GitHub and deploy it to the world!**

**Questions? Need help?**
- GitHub Support: https://support.github.com
- Stack Overflow: https://stackoverflow.com
- Dev Community: https://dev.to
