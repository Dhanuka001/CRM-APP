const express = require('express');
const { authController } = require('../../../../controllers');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Auth root (placeholder)' });
});

router.post('/register', authController.register);

module.exports = router;
