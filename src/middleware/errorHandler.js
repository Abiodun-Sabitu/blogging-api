const { logger } = require('../config/logger');

const errorHandler = (err, req, res, next) => {
  // Log only the error message and status for cleaner output
  logger.error(`${err.status || 500} - ${err.message}`);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
};

module.exports = errorHandler;