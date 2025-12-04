const { errorResponse } = require('../utils/responseHelper');
const authErrors = require('../constants/authErrors');

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, authErrors.UNAUTHORIZED, 401);
    }

    if (!roles.length) {
      return next();
    }

    if (!roles.includes(req.user.role)) {
      return errorResponse(res, authErrors.FORBIDDEN, 403);
    }

    return next();
  };
};

module.exports = { requireRole };
