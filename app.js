const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const authMiddleware = require('./middleware/authMiddleware');
const sequelize = require('./config/db');
const registerEventRoutes = require('./routes/registerEventRoutes');
require('./models/associations');
const notificacionRoutes = require('./routes/notificacionRoutes');

// Crear una instancia de la aplicación Express
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api', authRoutes);

app.use('/api', userRoutes); 

app.use('/api/events', eventRoutes);

app.use('/api/register', registerEventRoutes);

app.use('/api/notificaciones', notificacionRoutes);


app.get('/dashboard', authMiddleware, (req, res) => {
  res.json({ message: `Welcome ${req.userRole}` });
});

// Configurar el puerto
const PORT = process.env.PORT || 5000;

// Sincronizar la base de datos y arrancar el servidor
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
}).catch(err => {
  console.error('Error al sincronizar la base de datos:', err);
});
