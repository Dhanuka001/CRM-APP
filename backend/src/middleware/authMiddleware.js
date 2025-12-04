const { errorResponse } = require('../utils/responseHelper');
const { verifyToken } = require('../utils/jwt');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || typeof authHeader !== 'string') {
    return errorResponse(res, 'Authorization header missing', 401);
  }

  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return errorResponse(res, 'Authorization header malformed', 401);
  }

  try {
    const payload = verifyToken(token);
    req.user = {
      id: payload.userId,
      role: payload.role,
    };
    return next();
  } catch (error) {
    return errorResponse(res, 'Invalid or expired token', 401);
  }
};

module.exports = authMiddleware;
