const express = require('express');
const authMiddleware = require('../../../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', (req, res) => {
  res.json({ message: 'Leads root (placeholder)' });
});

module.exports = router;
