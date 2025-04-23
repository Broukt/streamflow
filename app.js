const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

// Importar configuración de base de datos
const { sequelize } = require('./config/database');

// Importar rutas
const authRoutes = require('./routes/auth.routes');

// Inicializar la app
const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Rutas
app.use('/auth', authRoutes);

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenido al módulo de autenticación de StreamFlow' });
});

// Manejador de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    status: 'error',
    message: err.message || 'Error interno del servidor'
  });
});

// Inicializar base de datos y servidor
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Base de datos conectada correctamente');
    app.listen(PORT, () => {
      console.log(`Servidor de autenticación corriendo en el puerto ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error al conectar a la base de datos:', err);
  });

module.exports = app;