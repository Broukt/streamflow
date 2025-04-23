const admin = require("firebase-admin");
const path = require("path");
require("dotenv").config();

const keyFile = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
if (!keyFile) {
  throw new Error("Missing FIREBASE_SERVICE_ACCOUNT_KEY in .env");
}

const serviceAccountPath = path.resolve(__dirname, keyFile);
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

console.log("Connected to Firestore");

module.exports = { db: admin.firestore() };