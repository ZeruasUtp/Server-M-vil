const express = require('express');
const router = express.Router();
const notificacionController = require('../controllers/notificacionController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/create', authMiddleware, notificacionController.createNotification);
router.get('/list', authMiddleware, notificacionController.listNotifications);

module.exports = router;
