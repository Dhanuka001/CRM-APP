const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { signToken } = require('../utils/jwt');
const authErrors = require('../constants/authErrors');

const prisma = new PrismaClient();

const logActivity = async ({ userId, type, message }) => {
  try {
    await prisma.activityLog.create({
      data: { userId, type, message },
    });
  } catch (error) {
    console.error('Failed to record activity log', error);
  }
};

const sanitizeUser = (user) => ({
  id: user.id,
  email: user.email,
  name: user.name,
  role: user.role,
  active: user.active,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const normalizeEmail = (value) => String(value).trim().toLowerCase();

const registerUser = async ({ email, password, name, role }) => {
  const normalizedEmail = normalizeEmail(email);
  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email: normalizedEmail,
      passwordHash,
      name: name ? String(name).trim() : null,
      role: role || undefined,
    },
  });

  await logActivity({
    userId: user.id,
    type: 'AUTH_REGISTRATION',
    message: 'User registered via auth endpoint',
  });

  return sanitizeUser(user);
};

const loginUser = async ({ email, password }) => {
  const normalizedEmail = normalizeEmail(email);

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    throw new Error(authErrors.INVALID_CREDENTIALS);
  }

  const passwordsMatch = await bcrypt.compare(password, user.passwordHash);
  if (!passwordsMatch) {
    throw new Error(authErrors.INVALID_CREDENTIALS);
  }

  const token = signToken({ userId: user.id, role: user.role });

  await logActivity({
    userId: user.id,
    type: 'AUTH_LOGIN',
    message: 'User logged in successfully',
  });

  return { token, user: sanitizeUser(user) };
};

const logoutUser = async (userId) => {
  if (!userId) {
    throw new Error(authErrors.UNAUTHORIZED);
  }

  await logActivity({
    userId,
    type: 'AUTH_LOGOUT',
    message: 'User logged out via auth endpoint',
  });
};

module.exports = { registerUser, loginUser, logoutUser };
