const express = require('express');
const router = express.Router();
const client_controller = require('../controllers/client.controller');

// URL to check if all files are communicating correctly.
router.get('/test', client_controller.test);
router.post('/create', client_controller.client_create);
router.get('/:id', client_controller.client_details);

module.exports = router;