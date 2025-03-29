const mongoose = require("mongoose");
const {
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_DB,
  DATABASE_PORT,
} = require("../config/env");

const URI = `mongodb://${DATABASE_USERNAME}:${DATABASE_PASSWORD}@localhost:${DATABASE_PORT}/${DATABASE_DB}?authSource=admin`;

async function connectMongo() {
  try {
    await mongoose.connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to Mongo");
  } catch (e) {
    console.error(`Error connecting to Mongo: ${e}`);
  }
}

async function closeMongo() {
  try {
    await mongoose.connection.close();
    console.log("Closed MongoDB connection");
  } catch (e) {
    console.error(`Error closing Mongo connection: ${e}`);
  }
}

module.exports = {
  connectMongo,
  closeMongo,
};