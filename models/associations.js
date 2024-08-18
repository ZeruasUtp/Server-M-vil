const Evento = require('./eventModel');
const RegistroEv = require('./registroEvModel');
const User = require('./userModel');
const DetallesEvento = require('./detalleEvento');

Evento.hasMany(RegistroEv, { foreignKey: 'evento_id' });
RegistroEv.belongsTo(Evento, { foreignKey: 'evento_id' });

RegistroEv.belongsTo(User, { foreignKey: 'usuario_id' });

Evento.hasOne(DetallesEvento, { foreignKey: 'evento_id' });
DetallesEvento.belongsTo(Evento, { foreignKey: 'evento_id' });

module.exports = { Evento, RegistroEv, User, DetallesEvento };
