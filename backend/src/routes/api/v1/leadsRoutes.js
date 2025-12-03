const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Leads root (placeholder)' });
});

module.exports = router;
