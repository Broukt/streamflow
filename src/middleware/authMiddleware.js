
const Usuario = require('../models/usermodel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');

// Iniciar sesión
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validar que se proporcionen email y password
    if (!email || !password) {
      return res.status(400).json({ message: 'Por favor proporcione email y contraseña' });
    }
    
    // Buscar el usuario por email
    const usuario = await Usuario.findOne({ 
      where: { email, eliminado: false } 
    });
    
    // Si no existe el usuario o la contraseña es incorrecta
    if (!usuario || !(await usuario.validarPassword(password))) {
      return res.status(401).json({ message: 'Email o contraseña incorrectos' });
    }
    
    // Generar token JWT
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    
    // Enviar respuesta con token y datos del usuario
    res.status(200).json({
      token,
      usuario: usuario.toJSON()
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
  }
};

// Actualizar contraseña
exports.actualizarPassword = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const { passwordActual, nuevaPassword, confirmacionPassword } = req.body;
    
    // Validar que el usuario existe
    const usuario = await Usuario.findOne({ 
      where: { id, eliminado: false },
      transaction
    });
    
    if (!usuario) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    // Validar que la contraseña actual es correcta
    const esPasswordValido = await usuario.validarPassword(passwordActual);
    if (!esPasswordValido) {
      await transaction.rollback();
      return res.status(401).json({ message: 'Contraseña actual incorrecta' });
    }
    
    // Validar que la nueva contraseña y su confirmación coincidan
    if (nuevaPassword !== confirmacionPassword) {
      await transaction.rollback();
      return res.status(400).json({ message: 'La nueva contraseña y su confirmación no coinciden' });
    }
    
    // Actualizar la contraseña
    usuario.password = nuevaPassword;
    await usuario.save({ transaction });
    
    await transaction.commit();
    
    res.status(200).json({
      message: 'Contraseña actualizada correctamente',
      usuario: usuario.toJSON()
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error al actualizar contraseña:', error);
    res.status(500).json({ message: 'Error al actualizar contraseña', error: error.message });
  }
};