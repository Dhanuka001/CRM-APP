const express = require('express');
const { authController } = require('../../../../controllers');
const authMiddleware = require('../../../../middleware/authMiddleware');
const { requireRole } = require('../../../../middleware/roleGuard');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Auth root (placeholder)' });
});

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authMiddleware, authController.logout);
router.get('/me', authMiddleware, (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  return res.json({ user: req.user });
});
router.get(
  '/admin-check',
  authMiddleware,
  requireRole('ADMIN'),
  (req, res) => {
    return res.json({
      message: 'You are an admin',
      user: req.user,
    });
  },
);

module.exports = router;
