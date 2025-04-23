const jwt = require('jsonwebtoken');
const Usuario = require('../../user-module/models/userModel');

exports.verificarToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No se proporcionó token de autenticación' });
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const usuario = await Usuario.findById(decoded.id);
    if (!usuario) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }
    
    req.usuario = usuario;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

exports.esAdmin = (req, res, next) => {
  if (req.usuario.rol !== 'Administrador') {
    return res.status(403).json({ message: 'Acceso denegado. Requiere rol de Administrador' });
  }
  next();
};

exports.esMismoUsuarioOAdmin = (req, res, next) => {
  if (req.usuario.id !== req.params.id && req.usuario.rol !== 'Administrador') {
    return res.status(403).json({ message: 'No tiene permiso para acceder a estos datos' });
  }
  next();
};