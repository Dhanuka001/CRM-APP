const express = require('express');
const { statusController } = require('../controllers');
const v1Routes = require('./api/v1');

const router = express.Router();

router.get('/health', statusController.ping);
router.use('/api/v1', v1Routes);

module.exports = router;
