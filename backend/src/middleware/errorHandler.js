const config = require('../config');

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const payload = {
    message: err.message || 'Internal Server Error',
    statusCode,
  };

  if (err.details) {
    payload.details = err.details;
  }

  if (config.env === 'development' && err.stack) {
    payload.stack = err.stack;
  }

  res.status(statusCode).json(payload);
};

module.exports = errorHandler;
