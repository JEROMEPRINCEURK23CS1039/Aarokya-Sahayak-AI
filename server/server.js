const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth');
const analysisRoutes = require('./routes/analysis');
const hospitalRoutes = require('./routes/hospital');
const userRoutes = require('./routes/user');
const analyticsRoutes = require('./routes/analytics');
const emergencyRoutes = require('./routes/emergency');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
  }
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: logger.stream }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

// Auth rate limiting
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5 // limit each IP to 5 login requests per hour
});
app.use('/api/v1/auth/login', authLimiter);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/aarogya-sahayak')
  .then(() => logger.info('MongoDB connected successfully'))
  .catch(err => logger.error('MongoDB connection error:', err));

// Socket.IO setup
require('./config/socket')(io);

// Make io accessible to routes
app.set('io', io);

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/analysis', analysisRoutes);
app.use('/api/v1/hospitals', hospitalRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/emergency', emergencyRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, '0.0.0.0', () => {
  logger.info(`Server running on http://localhost:${PORT}`);
  console.log(`✅ Server is running on http://localhost:${PORT}`);
  console.log(`✅ MongoDB: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
});

// Prevent server from exiting
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
  });
});

module.exports = { app, server, io };
