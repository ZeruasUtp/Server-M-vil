const Evento = require('../models/eventModel');
const RegistroEv = require('../models/registroEvModel');
const DetallesEvento = require('../models/detalleEvento');

const registerEventController = {
    listAvailableEvents: async (req, res) => {
        try {
            const eventos = await Evento.findAll({
                attributes: [
                    'evento_id',
                    'nombre',
                    'fecha_inicio',
                    'fecha_termino',
                    'hora',
                    'tipo_evento_id',
                    'organizador_id',
                    'categoria_id',
                    'ubicacion',
                    'max_per',
                    'estado'
                ],
                where: { estado: 'Approved' }
            });

            res.status(200).json(eventos);
        } catch (error) {
            console.error('Error al listar los eventos disponibles:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },
    
    listEventAvailableDetails: async (req, res) => {
        const { evento_id } = req.params;

        try {
            const evento = await Evento.findByPk(evento_id, {
                attributes: [
                    'evento_id',
                    'nombre',
                    'fecha_inicio',
                    'fecha_termino',
                    'hora',
                    'tipo_evento_id',
                    'organizador_id',
                    'categoria_id',
                    'ubicacion',
                    'max_per',
                    'estado'
                ],
                include: {
                    model: DetallesEvento,
                    attributes: ['detalle_evento_id', 'descripcion', 'requerimientos']
                }
            });

            if (!evento) {
                return res.status(404).json({ error: 'Evento no encontrado' });
            }

            res.status(200).json(evento);
        } catch (error) {
            console.error('Error al obtener los detalles del evento:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },

    registerToEvent: async (req, res) => {
        const { evento_id } = req.params;
        const usuario_id = req.user.usuario_id;

        try {
            const evento = await Evento.findOne({ where: { evento_id } });
            if (!evento) {
                return res.status(404).json({ error: 'Evento no encontrado' });
            }

            const registros = await RegistroEv.count({ where: { evento_id } });
            if (registros >= evento.max_per) {
                return res.status(400).json({ error: 'No hay espacio disponible en el evento' });
            }

            await RegistroEv.create({ evento_id, usuario_id });
            res.status(201).json({ message: 'Registro exitoso' });
        } catch (error) {
            console.error('Error al registrarse en el evento:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },

    listRegisteredEvents: async (req, res) => {
        const usuario_id = req.user.usuario_id;

        try {
            const registros = await RegistroEv.findAll({
                where: { usuario_id },
                include: [{
                    model: Evento,
                    attributes: ['nombre', 'fecha_inicio', 'fecha_termino', 'hora', 'tipo_evento_id', 'organizador_id', 'categoria_id', 'ubicacion', 'max_per', 'estado'],
                    include: {
                        model: DetallesEvento,
                        attributes: ['descripcion', 'requerimientos'],
                    }
                }]
            });

            const eventos = registros.map(registro => registro.Evento);

            res.status(200).json(eventos);
        } catch (error) {
            console.error('Error al listar los eventos registrados:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
};

module.exports = registerEventController;
