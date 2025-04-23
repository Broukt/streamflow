const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verificarToken, esMismoUsuarioOAdmin } = require('../middleware/auth.middleware');

// Ruta para iniciar sesión
router.post('/login', authController.login);

// Ruta para actualizar contraseña (requiere autenticación y ser el mismo usuario)
router.patch('/usuarios/:id', verificarToken, esMismoUsuarioOAdmin, authController.actualizarPassword);

module.exports = router;