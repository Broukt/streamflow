const mongoose = require('mongoose');
const {
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_DB,
  DATABASE_PORT,
  DATABASE_HOST // add host if needed
} = require('../config/env');

const authPart = DATABASE_USERNAME && DATABASE_PASSWORD
  ? `${encodeURIComponent(DATABASE_USERNAME)}:${encodeURIComponent(DATABASE_PASSWORD)}@`
  : '';
const host = DATABASE_HOST || 'localhost';
const URI = `mongodb://${authPart}${host}:${DATABASE_PORT}/${DATABASE_DB}?authSource=admin`;

/**
 * Conecta a MongoDB usando Mongoose y devuelve la conexión.
 */
async function connectMongo() {
  try {
    await mongoose.connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to Mongo');
    return mongoose.connection;
  } catch (err) {
    console.error('Error connecting to Mongo:', err);
    throw err; // propagamos para manejar en el caller
  }
}

/**
 * Cierra la conexión de Mongoose.
 */
async function closeMongo() {
  try {
    await mongoose.connection.close();
    console.log('Closed MongoDB connection');
  } catch (err) {
    console.error('Error closing MongoDB connection:', err);
  }
}

module.exports = {
  connectMongo,
  closeMongo,
};