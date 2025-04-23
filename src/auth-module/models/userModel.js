
const { sequelize, Sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const Usuario = sequelize.define('Usuario', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  nombre: {
    type: Sequelize.STRING,
    allowNull: false
  },
  apellido: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  rol: {
    type: Sequelize.ENUM('Administrador', 'Cliente'),
    defaultValue: 'Cliente'
  },
  eliminado: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'usuarios',
  timestamps: true,
  createdAt: 'fechaRegistro',
  updatedAt: 'fechaActualizacion'
});

// Hook para hashear la contraseña antes de crear o actualizar un usuario
Usuario.beforeCreate(async (usuario) => {
  if (usuario.password) {
    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(usuario.password, salt);
  }
});

Usuario.beforeUpdate(async (usuario) => {
  if (usuario.changed('password')) {
    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(usuario.password, salt);
  }
});

// Método para validar la contraseña
Usuario.prototype.validarPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// Método para obtener el usuario sin la contraseña
Usuario.prototype.toJSON = function() {
  const values = { ...this.get() };
  delete values.password;
  return values;
};

module.exports = Usuario;