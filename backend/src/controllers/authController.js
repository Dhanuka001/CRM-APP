const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { successResponse, errorResponse } = require('../utils/responseHelper');

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

const register = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    if (!email || !password) {
      return errorResponse(res, 'Email and password are required', 400);
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

module.exports = { register };
