const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Evento = require('./eventModel');

const DetallesEvento = sequelize.define('Detalles_Evento', {
  detalle_evento_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  evento_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Eventos',
      key: 'evento_id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  requerimientos: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'Detalles_Evento',
  timestamps: false,
});

module.exports = DetallesEvento;
