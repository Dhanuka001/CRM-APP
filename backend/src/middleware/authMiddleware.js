const { errorResponse } = require('../utils/responseHelper');
const { verifyToken } = require('../utils/jwt');
const authErrors = require('../constants/authErrors');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || typeof authHeader !== 'string') {
    return errorResponse(res, authErrors.AUTH_HEADER_MISSING, 401);
  }

  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return errorResponse(res, authErrors.AUTH_HEADER_MALFORMED, 401);
  }

  try {
    const payload = verifyToken(token);
    req.user = {
      id: payload.userId,
      role: payload.role,
    };
    return next();
  } catch (error) {
    return errorResponse(res, authErrors.INVALID_TOKEN, 401);
  }
};

module.exports = authMiddleware;
