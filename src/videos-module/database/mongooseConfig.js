const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

let URI;

if (process.env.NODE_ENV !== "production") {
  const authPart =
    process.env.DATABASE_USERNAME && process.env.DATABASE_PASSWORD
      ? `${encodeURIComponent(process.env.DATABASE_USERNAME)}:${encodeURIComponent(
          process.env.DATABASE_PASSWORD
        )}@`
      : "";
  const host = process.env.DATABASE_HOST || "localhost";
  URI = `mongodb://${authPart}${host}:${process.env.DATABASE_PORT}/${process.env.DATABASE_DB}?authSource=admin`;
} else {
  URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
}
/**
 * Conecta a MongoDB usando Mongoose y devuelve la conexión.
 */
async function connectMongo() {
  try {
    await mongoose.connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to Mongo");
    return mongoose.connection;
  } catch (err) {
    console.error("Error connecting to Mongo:", err);
    throw err; // propagamos para manejar en el caller
  }
}

/**
 * Cierra la conexión de Mongoose.
 */
async function closeMongo() {
  try {
    await mongoose.connection.close();
    console.log("Closed MongoDB connection");
  } catch (err) {
    console.error("Error closing MongoDB connection:", err);
  }
}

module.exports = {
  connectMongo,
  closeMongo,
};
