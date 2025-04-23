// src/authModule/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const admin = require('firebase-admin');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Asegúrate de inicializar Firebase Admin antes de usar este middleware
// const serviceAccount = require('../../path/to/serviceAccountKey.json');
// admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

/**
 * Protección de rutas: verifica JWT y carga el usuario de Firestore en req.user
 */
exports.protect = catchAsync(async (req, res, next) => {
  let token;

  // 1) Obtener token de cabecera
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new AppError('No estás autenticado. Por favor inicia sesión.', 401)
    );
  }

  // 2) Verificar token
  let decoded;
  try {
    decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  } catch (err) {
    return next(new AppError('Token inválido o expirado.', 401));
  }

  // 3) Verificar que el usuario existe en Firestore (colección 'usuario')
  const userRef = admin.firestore().collection('usuario').doc(decoded.id);
  const userSnap = await userRef.get();
  if (!userSnap.exists) {
    return next(new AppError('El usuario del token no existe.', 401));
  }

  // 4) Construir objeto de usuario (incluye campo 'role')
  const userData = userSnap.data();
  req.user = { id: userSnap.id, ...userData };

  next();
});

/**
 * Restricción de acceso: sólo permite roles específicos
 */
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError('No tienes permiso para realizar esta acción.', 403)
      );
    }
    next();
  };
};
