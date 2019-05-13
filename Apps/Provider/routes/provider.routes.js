const express = require('express');
const router = express.Router();
const provider_controller = require('../controllers/provider.controller');
//A simple URL to check if all files are communicating correctly.
router.get('/test', provider_controller.test);
router.post('/create', provider_controller.provider_create);
router.get('/:id', provider_controller.provider_details);

module.exports = router;