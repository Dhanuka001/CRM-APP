const { successResponse, errorResponse } = require('../utils/responseHelper');
const authErrors = require('../constants/authErrors');
const {
  registerUser,
  loginUser,
  logoutUser,
} = require('../services/authService');

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const isStrongPassword = (value) =>
  typeof value === 'string' && value.length >= 8;

const register = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    if (!email || !password) {
      return errorResponse(res, authErrors.MISSING_CREDENTIALS, 400);
    }

    if (!isValidEmail(email)) {
      return errorResponse(res, 'Invalid email format', 400);
    }

    if (!isStrongPassword(password)) {
      return errorResponse(
        res,
        'Password must be at least 8 characters',
        400,
      );
    }

    const user = await registerUser({ email, password, name, role });

    return successResponse(res, user, 'User registered', 201);
  } catch (error) {
    if (error?.code === 'P2002' && error?.meta?.target?.includes('email')) {
      return errorResponse(res, 'Email already registered', 409);
    }

    return errorResponse(res, 'Unable to register user', 500, error.message);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, authErrors.MISSING_CREDENTIALS, 400);
    }

    if (!isValidEmail(email)) {
      return errorResponse(res, 'Invalid email format', 400);
    }

    if (!isStrongPassword(password)) {
      return errorResponse(
        res,
        'Password must be at least 8 characters',
        400,
      );
    }

    const payload = await loginUser({ email, password });

    return successResponse(res, payload, 'Login successful');
  } catch (error) {
    if (error?.message === authErrors.INVALID_CREDENTIALS) {
      return errorResponse(res, authErrors.INVALID_CREDENTIALS, 401);
    }

    return errorResponse(res, 'Unable to complete login', 500, error.message);
  }
};

const logout = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return errorResponse(res, authErrors.UNAUTHORIZED, 401);
    }

    await logoutUser(req.user.id);

    return successResponse(
      res,
      null,
      'Logout successful; remove the token client-side',
    );
  } catch (error) {
    if (error?.message === authErrors.UNAUTHORIZED) {
      return errorResponse(res, authErrors.UNAUTHORIZED, 401);
    }

    return errorResponse(res, 'Unable to complete logout', 500, error.message);
  }
};

module.exports = { register, login, logout };
