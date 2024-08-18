const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const NotificacionO = sequelize.define('NotificacionO', {
    notificacion_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Usuarios',
            key: 'usuario_id'
        }
    },
    mensaje: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fecha_envio: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'NotificacionO',
    timestamps: false
});

module.exports = NotificacionO;
