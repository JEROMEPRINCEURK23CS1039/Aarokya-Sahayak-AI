const logger = require('../utils/logger');

module.exports = (io) => {
  io.use((socket, next) => {
    // Authenticate socket connection
    const token = socket.handshake.auth.token;
    if (token) {
      // Verify JWT token here if needed
      next();
    } else {
      next();
    }
  });

  io.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.id}`);

    // Emergency ambulance request
    socket.on('request:ambulance', async (data) => {
      try {
        const { userId, location, symptoms, triageLevel } = data;
        
        logger.info('Ambulance requested:', {
          userId,
          location,
          triageLevel
        });

        // Create room for this emergency
        const roomId = `emergency_${userId}_${Date.now()}`;
        socket.join(roomId);

        // Broadcast to nearby ambulance drivers (simulated)
        // In production, query ambulance service and notify drivers
        io.to(socket.id).emit('ambulance:searching', {
          message: 'Searching for nearest ambulance...',
          roomId
        });

        // Simulate ambulance assignment after 3 seconds
        setTimeout(() => {
          const mockDriver = {
            name: 'Driver Name',
            phone: '9876543210',
            vehicleNumber: 'OR-01-AB-1234',
            eta: '8 minutes',
            location: {
              lat: location.lat + 0.01,
              lon: location.lon + 0.01
            }
          };

          io.to(roomId).emit('ambulance:assigned', {
            driver: mockDriver,
            message: 'Ambulance assigned successfully'
          });
        }, 3000);

      } catch (error) {
        logger.error('Ambulance request error:', error);
        socket.emit('ambulance:error', {
          message: 'Failed to request ambulance'
        });
      }
    });

    // Ambulance location updates from driver
    socket.on('ambulance:location', (data) => {
      const { roomId, location } = data;
      io.to(roomId).emit('ambulance:location_update', {
        location,
        timestamp: new Date()
      });
    });

    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id}`);
    });
  });
};
