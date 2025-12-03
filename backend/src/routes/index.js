const express = require('express');
const router = express.Router();
const { statusController } = require('../controllers');

router.get('/health', statusController.ping);

module.exports = router;
