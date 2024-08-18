const NotificacionO = require('../models/notificacionModel');

const notificacionController = {
    createNotification: async (req, res) => {
        const { mensaje } = req.body;

        try {
            const user = req.user;

            const newNotification = await NotificacionO.create({
                usuario_id: user.usuario_id,
                mensaje
            });

            res.status(201).json(newNotification);
        } catch (error) {
            console.error('Error creating notification:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    listNotifications: async (req, res) => {
        try {
            const notifications = await NotificacionO.findAll({
                where: { usuario_id: req.user.usuario_id }
            });
            res.status(200).json(notifications);
        } catch (error) {
            console.error('Error listing notifications:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = notificacionController;
