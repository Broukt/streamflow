// index.js
require('dotenv').config();
const express = require('express');
const admin = require('firebase-admin');

// Inicializar Firebase Admin para Firestore (Usuarios y Auth)
const { db } = require('../src/user-module/config/firebase');
// Inicializar Firestore

// Conexiones a bases de datos de cada módulo
const { connectMongo } = require('../src/videos-module/database/mongooseConfig');
const prismaReceipt     = require('../src/receipt-module/database/prisma');
// Firestore ya está inicializado con Firebase Admin para usuarios y auth

// Importar rutas de cada módulo
const userRoutes    = require('../src/user-module/routes/userRoutes');
const authRoutes    = require('../src/auth-module/routes/authRoutes');
const receiptRoutes = require('../src/receipt-module/routes/receiptRoutes');
const videoRoutes   = require('../src/videos-module/routes/videoRoutes');

// Middleware global de errores
const globalErrorMiddleware = require('../src/middlewares/globalErrorMiddleware');

const app = express();
app.use(express.json());

// Ruta de salud
app.get('/', (req, res) => {
  res.status(200).json({ status: 'success', message: 'API is running' });
});

(async () => {
  try {
    // 1) Conectar a MongoDB (Videos)
    await connectMongo();
    console.log('🔗 Connected to MongoDB (Videos)');

    // 2) Conectar a base de datos SQL (Facturas)
    await prismaReceipt.$connect();
    console.log('🔗 Connected to SQL Database (Receipts)');

    // 3) Montar rutas de los módulos
    app.use('/usuarios', userRoutes);
    app.use('/auth', authRoutes);
    app.use('/facturas', receiptRoutes);
    app.use('/videos', videoRoutes);

    // 4) Manejador global de errores (debe ir al final)
    app.use(globalErrorMiddleware);

    // 5) Iniciar servidor
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Error initializing server:', err);
    process.exit(1);
  }
})();
