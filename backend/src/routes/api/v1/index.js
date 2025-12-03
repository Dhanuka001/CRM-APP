const express = require('express');
const authRoutes = require('./authRoutes');
const leadsRoutes = require('./leadsRoutes');
const tasksRoutes = require('./tasksRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/leads', leadsRoutes);
router.use('/tasks', tasksRoutes);

module.exports = router;
