const logger = require('winston');

// Configure Winston logger
const loggerInstance = logger.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logger.format.combine(
    logger.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logger.format.errors({ stack: true }),
    logger.format.splat(),
    logger.format.json()
  ),
  defaultMeta: { service: 'aarogya-sahayak' },
  transports: [
    // Write all logs to console
    new logger.transports.Console({
      format: logger.format.combine(
        logger.format.colorize(),
        logger.format.printf(({ level, message, timestamp, ...metadata }) => {
          let msg = `${timestamp} [${level}]: ${message}`;
          if (Object.keys(metadata).length > 0) {
            msg += ` ${JSON.stringify(metadata)}`;
          }
          return msg;
        })
      )
    }),
    // Write errors to error.log
    new logger.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    // Write all logs to combined.log
    new logger.transports.File({ 
      filename: 'logs/combined.log' 
    })
  ]
});

// Create a stream object for Morgan
loggerInstance.stream = {
  write: (message) => {
    loggerInstance.info(message.trim());
  }
};

module.exports = loggerInstance;
