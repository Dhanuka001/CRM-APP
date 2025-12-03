const requestLogger = (req, res, next) => {
  console.info(`${req.method} ${req.originalUrl}`);
  next();
};

module.exports = requestLogger;
