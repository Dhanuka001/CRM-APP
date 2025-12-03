const requestLogger = (req, res, next) => {
  res.on('finish', () => {
    console.info(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode}`
    );
  });

  next();
};

module.exports = requestLogger;
