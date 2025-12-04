const express = require('express');
const authRoutes = require('./auth');
const leadsRoutes = require('./leadsRoutes');
const tasksRoutes = require('./tasksRoutes');
const { version } = require('../../../../package.json');

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    version,
    timestamp: new Date().toISOString(),
  });
});

router.use('/auth', authRoutes);
router.use('/leads', leadsRoutes);
router.use('/tasks', tasksRoutes);

module.exports = router;
