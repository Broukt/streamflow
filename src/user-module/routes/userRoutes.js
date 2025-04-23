
const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/userController');
const { verificarToken, esAdmin, esMismoUsuarioOAdmin } = require('../middleware/authMiddleware');

// Ruta para crear un usuario (público para registro de clientes, admin para crear administradores)
router.post('/', usuariosController.crearUsuario);

// Ruta para obtener un usuario por ID (requiere autenticación)
router.get('/:id', verificarToken, esMismoUsuarioOAdmin, usuariosController.obtenerUsuarioPorId);

// Ruta para actualizar un usuario (requiere autenticación y ser el mismo usuario o admin)
router.patch('/:id', verificarToken, esMismoUsuarioOAdmin, usuariosController.actualizarUsuario);

// Ruta para eliminar un usuario (requiere ser admin)
router.delete('/:id', verificarToken, esAdmin, usuariosController.eliminarUsuario);

// Ruta para listar todos los usuarios (requiere ser admin)
router.get('/', verificarToken, esAdmin, usuariosController.listarUsuarios);

module.exports = router;