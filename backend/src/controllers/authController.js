const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { successResponse, errorResponse } = require('../utils/responseHelper');
const { signToken } = require('../utils/jwt');
const authErrors = require('../constants/authErrors');

const prisma = new PrismaClient();

const sanitizeUser = (user) => ({
  id: user.id,
  email: user.email,
  name: user.name,
  role: user.role,
  active: user.active,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

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

    const normalizedEmail = String(email).trim().toLowerCase();

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        name: name ? String(name).trim() : null,
        role: role || undefined,
      },
    });

    return successResponse(res, sanitizeUser(user), 'User registered', 201);
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

    const normalizedEmail = String(email).trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return errorResponse(res, authErrors.INVALID_CREDENTIALS, 401);
    }

    const passwordsMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordsMatch) {
      return errorResponse(res, authErrors.INVALID_CREDENTIALS, 401);
    }

    const token = signToken({ userId: user.id, role: user.role });

    return successResponse(
      res,
      { token, user: sanitizeUser(user) },
      'Login successful',
    );
  } catch (error) {
    return errorResponse(res, 'Unable to complete login', 500, error.message);
  }
};

module.exports = { register, login };
