const express = require('express');
const router = express.Router();
const registerEventController = require('../controllers/registerEventController');
const authMiddleware = require('../middleware/authMiddleware');
const authorizeCliente = require('../middleware/authorizeCliente');

router.get('/available-events', authMiddleware, authorizeCliente, registerEventController.listAvailableEvents);

router.post('/register/:evento_id', authMiddleware, authorizeCliente, registerEventController.registerToEvent);

router.get('/registered-events', authMiddleware, authorizeCliente, registerEventController.listRegisteredEvents);

router.get('/events/available/:evento_id', registerEventController.listEventAvailableDetails);

module.exports = router;
