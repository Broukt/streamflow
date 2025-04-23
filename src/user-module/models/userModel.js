const { usuariosCollection } = require('../config/firebase');
const bcrypt = require('bcryptjs');

class Usuario {
  constructor(nombre, apellido, email, password, rol = 'Cliente') {
    this.nombre = nombre;
    this.apellido = apellido;
    this.email = email;
    this.password = password;
    this.rol = rol;
    this.fechaRegistro = new Date();
    this.eliminado = false;
  }

  static async findByEmail(email) {
    const snapshot = await usuariosCollection.where('email', '==', email).where('eliminado', '==', false).get();
    if (snapshot.empty) {
      return null;
    }
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  }

  static async findById(id) {
    const doc = await usuariosCollection.doc(id).get();
    if (!doc.exists || doc.data().eliminado) {
      return null;
    }
    return { id: doc.id, ...doc.data() };
  }

  static async findAll(filtros = {}) {
    let query = usuariosCollection.where('eliminado', '==', false);
    
    if (filtros.email) {
      query = query.where('email', '>=', filtros.email)
                   .where('email', '<=', filtros.email + '\uf8ff');
    }
    
    const snapshot = await query.get();
    return snapshot.docs.map(doc => {
      const data = doc.data();
      delete data.password;
      return { id: doc.id, ...data };
    });
  }

  async save() {
    // Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    
    const docRef = await usuariosCollection.add(this);
    return { id: docRef.id, ...this };
  }

  static async update(id, datosActualizados) {
    const usuarioRef = usuariosCollection.doc(id);
    const usuario = await usuarioRef.get();
    
    if (!usuario.exists || usuario.data().eliminado) {
      return null;
    }
    
    await usuarioRef.update(datosActualizados);
    const usuarioActualizado = await usuarioRef.get();
    
    return { id, ...usuarioActualizado.data() };
  }

  static async softDelete(id) {
    const usuarioRef = usuariosCollection.doc(id);
    const usuario = await usuarioRef.get();
    
    if (!usuario.exists || usuario.data().eliminado) {
      return null;
    }
    
    await usuarioRef.update({ eliminado: true });
    return true;
  }

  static async validatePassword(providedPassword, storedPassword) {
    return await bcrypt.compare(providedPassword, storedPassword);
  }
}

module.exports = Usuario;