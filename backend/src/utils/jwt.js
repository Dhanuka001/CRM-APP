const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '2h';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET must be set to sign/verify tokens.');
}

const signToken = (payload, options = {}) => {
  const tokenOptions = {
    expiresIn: JWT_EXPIRES_IN,
    ...options,
  };

  return jwt.sign(payload, JWT_SECRET, tokenOptions);
};

const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = { signToken, verifyToken };
