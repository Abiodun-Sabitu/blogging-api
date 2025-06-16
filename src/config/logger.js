const winston = require('winston');
const morgan = require('morgan');

// Winston logger configuration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console()
  ]
});

// Morgan stream to use winston for logging HTTP requests
const morganStream = {
  write: (message) => logger.info(message.trim())
};

module.exports = {
  logger,
  morganMiddleware: morgan('combined', { stream: morganStream })
};