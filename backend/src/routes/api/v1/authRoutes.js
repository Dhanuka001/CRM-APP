const express = require('express');

const router = express.Router();

// TODO: replace with real auth controllers
router.get('/', (req, res) => {
  res.json({ message: 'Auth root (placeholder)' });
});

module.exports = router;
