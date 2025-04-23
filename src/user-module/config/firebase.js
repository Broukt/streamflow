const admin = require('firebase-admin');
require('dotenv').config();

const serviceAccountPath = path.resolve(
  __dirname,
  process.env.FIREBASE_SERVICE_ACCOUNT
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountPath)
});

const db = admin.firestore();
const usuariosCollection = db.collection('usuarios');

module.exports = {
  admin,
  db,
  usuariosCollection
};