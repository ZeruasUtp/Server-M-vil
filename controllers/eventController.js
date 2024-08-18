const Evento = require('../models/eventModel');
const DetallesEvento = require('../models/detalleEvento');
const sequelize = require('../config/db');

const eventController = {
    createEvent: async (req, res) => {
        const { nombre, fecha_inicio, fecha_termino, hora, ubicacion, max_per, tipo_evento_id, categoria_id, descripcion, requerimientos } = req.body;

        try {
            const user = req.user;

            const result = await sequelize.transaction(async (t) => {
                const newEvent = await Evento.create({
                    nombre,
                    fecha_inicio,
                    fecha_termino,
                    hora,
                    ubicacion,
                    max_per,
                    tipo_evento_id,
                    organizador_id: user.usuario_id,
                    categoria_id,
                    estado: 'Pending',
                }, { transaction: t });

                const newDetails = await DetallesEvento.create({
                    evento_id: newEvent.evento_id,
                    descripcion,
                    requerimientos
                }, { transaction: t });

                return { newEvent, newDetails };
            });

            res.status(201).json(result);
        } catch (error) {
            console.error('Error creating event:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    getEventDetails: async (req, res) => {
        const { evento_id } = req.params;

        try {
            const event = await Evento.findByPk(evento_id, {
                attributes: ['evento_id', 'nombre', 'fecha_inicio', 'fecha_termino', 'hora', 'ubicacion', 'max_per', 'tipo_evento_id', 'categoria_id'],
                include: {
                    model: DetallesEvento,
                    attributes: ['descripcion', 'requerimientos'],
                },
            });

            if (!event) {
                return res.status(404).json({ error: 'Event not found' });
            }

            res.status(200).json(event);
        } catch (error) {
            console.error('Error fetching event details:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    updateEvent: async (req, res) => {
        const { evento_id } = req.params;
        const { nombre, fecha_inicio, fecha_termino, hora, ubicacion, max_per, tipo_evento_id, categoria_id, descripcion, requerimientos } = req.body;

        try {
            const result = await sequelize.transaction(async (t) => {
                const event = await Evento.findByPk(evento_id, { transaction: t });

                if (!event) {
                    return res.status(404).json({ error: 'Event not found' });
                }

                if (event.organizador_id !== req.user.usuario_id) {
                    return res.status(403).json({ error: 'No tienes permisos para actualizar este evento' });
                }

                await event.update({
                    nombre,
                    fecha_inicio,
                    fecha_termino,
                    hora,
                    ubicacion,
                    max_per,
                    tipo_evento_id,
                    categoria_id,
                    estado: 'Pending',
                }, { transaction: t });

                const details = await DetallesEvento.findOne({ where: { evento_id: event.evento_id }, transaction: t });

                if (details) {
                    await details.update({
                        descripcion,
                        requerimientos,
                    }, { transaction: t });
                }

                return { event, details };
            });

            res.status(200).json(result);
        } catch (error) {
            console.error('Error updating event:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    listPendingEvents: async (req, res) => {
        try {
            const pendingEvents = await Evento.findAll({ where: { estado: 'Pending' } });
            res.status(200).json(pendingEvents);
        } catch (error) {
            console.error('Error listing pending events:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    approveEvent: async (req, res) => {
        const { evento_id } = req.params;

        try {
            const event = await Evento.findByPk(evento_id);

            if (!event) {
                return res.status(404).json({ error: 'Event not found' });
            }

            await event.update({
                estado: 'Approved',
                autorizado_por: req.user.usuario_id,
                fecha_autorizacion: new Date(),
            });

            res.status(200).json(event);
        } catch (error) {
            console.error('Error approving event:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    disapproveEvent: async (req, res) => {
        const { evento_id } = req.params;

        try {
            const event = await Evento.findByPk(evento_id);

            if (!event) {
                return res.status(404).json({ error: 'Event not found' });
            }

            await event.update({
                estado: 'Disapproved',
                autorizado_por: req.user.usuario_id,
                fecha_autorizacion: new Date(),
            });

            res.status(200).json(event);
        } catch (error) {
            console.error('Error disapproving event:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    listOrganizerEvents: async (req, res) => {
        try {
            const events = await Evento.findAll({ where: { organizador_id: req.user.usuario_id } });
            res.status(200).json(events);
        } catch (error) {
            console.error('Error listing organizer events:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
};

module.exports = eventController;
