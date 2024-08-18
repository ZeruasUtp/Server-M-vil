const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const RegistroEv = sequelize.define('RegistroEv', {
    registro_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    evento_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Eventos',
            key: 'evento_id'
        }
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Usuarios',
            key: 'usuario_id'
        }
    },
    fecha_registro: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'RegistroEv',
    timestamps: false
});


module.exports = RegistroEv;
