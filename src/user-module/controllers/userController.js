const Usuario = require('../models/userModel');

// Crear un nuevo usuario
exports.crearUsuario = async (req, res) => {
  try {
    const { nombre, apellido, email, password, confirmPassword, rol } = req.body;
    
    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Las contraseñas no coinciden' });
    }
    
    // Verificar si el rol es Administrador y si el usuario actual es Administrador
    if (rol === 'Administrador') {
      // Si req.usuario no existe (no hay token) o no es Administrador, rechazar
      if (!req.usuario || req.usuario.rol !== 'Administrador') {
        return res.status(403).json({ 
          message: 'Se requiere ser Administrador para registrar un usuario con rol Administrador' 
        });
      }
    }
    
    // Verificar si el correo ya está registrado
    const usuarioExistente = await Usuario.findByEmail(email);
    if (usuarioExistente) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
    }
    
    // Validar que el rol sea válido
    if (rol && !['Administrador', 'Cliente'].includes(rol)) {
      return res.status(400).json({ message: 'Rol inválido. Debe ser "Administrador" o "Cliente"' });
    }
    
    // Crear y guardar el nuevo usuario
    const nuevoUsuario = new Usuario(nombre, apellido, email, password, rol || 'Cliente');
    const usuarioGuardado = await nuevoUsuario.save();
    
    // Eliminar la contraseña del objeto retornado
    const usuarioResponse = { ...usuarioGuardado };
    delete usuarioResponse.password;
    
    res.status(201).json(usuarioResponse);
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ message: 'Error al crear usuario', error: error.message });
  }
};

// Obtener usuario por ID
exports.obtenerUsuarioPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findById(id);
    
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    // Eliminar la contraseña del objeto retornado
    const usuarioResponse = { ...usuario };
    delete usuarioResponse.password;
    
    res.status(200).json(usuarioResponse);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ message: 'Error al obtener usuario', error: error.message });
  }
};

// Actualizar usuario
exports.actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, email, password } = req.body;
    
    // Verificar si se está intentando modificar la contraseña
    if (password) {
      return res.status(400).json({ 
        message: 'No se puede modificar la contraseña aquí. Use el endpoint de actualización de contraseña.' 
      });
    }
    
    // Datos a actualizar
    const datosActualizados = {};
    if (nombre) datosActualizados.nombre = nombre;
    if (apellido) datosActualizados.apellido = apellido;
    if (email) datosActualizados.email = email;
    
    // Verificar si el correo ya está en uso por otro usuario
    if (email) {
      const usuarioExistente = await Usuario.findByEmail(email);
      if (usuarioExistente && usuarioExistente.id !== id) {
        return res.status(400).json({ message: 'El correo electrónico ya está en uso' });
      }
    }
    
    const usuarioActualizado = await Usuario.update(id, datosActualizados);
    
    if (!usuarioActualizado) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    // Eliminar la contraseña del objeto retornado
    delete usuarioActualizado.password;
    
    res.status(200).json(usuarioActualizado);
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ message: 'Error al actualizar usuario', error: error.message });
  }
};

// Eliminar usuario (soft delete)
exports.eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    
    const resultado = await Usuario.softDelete(id);
    
    if (!resultado) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ message: 'Error al eliminar usuario', error: error.message });
  }
};

// Listar todos los usuarios
exports.listarUsuarios = async (req, res) => {
  try {
    const { email, nombre } = req.query;
    
    const filtros = {};
    if (email) filtros.email = email;
    if (nombre) filtros.nombre = nombre;
    
    const usuarios = await Usuario.findAll(filtros);
    
    // Filtrar resultados por nombre y apellido si se especifica en la consulta
    let resultadosFiltrados = usuarios;
    if (nombre) {
      const terminoBusqueda = nombre.toLowerCase();
      resultadosFiltrados = resultadosFiltrados.filter(usuario => 
        usuario.nombre.toLowerCase().includes(terminoBusqueda) || 
        usuario.apellido.toLowerCase().includes(terminoBusqueda)
      );
    }
    
    res.status(200).json(resultadosFiltrados);
  } catch (error) {
    console.error('Error al listar usuarios:', error);
    res.status(500).json({ message: 'Error al listar usuarios', error: error.message });
  }
};