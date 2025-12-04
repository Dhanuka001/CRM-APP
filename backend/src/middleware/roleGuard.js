const { errorResponse } = require('../utils/responseHelper');

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Unauthorized', 401);
    }

    if (!roles.length) {
      return next();
    }

    if (!roles.includes(req.user.role)) {
      return errorResponse(res, 'Forbidden', 403);
    }

    return next();
  };
};

module.exports = { requireRole };
