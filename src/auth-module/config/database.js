const { Sequelize } = require('sequelize');
require('dotenv').config();

// Opciones de conexión
const sequelize = new Sequelize(
  process.env.DB_URL || 
  `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    }
  }
);

// Verificar la conexión
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a PostgreSQL establecida correctamente.');
  } catch (error) {
    console.error('No se pudo conectar a PostgreSQL:', error);
  }
};

testConnection();

module.exports = {
  sequelize,
  Sequelize
};