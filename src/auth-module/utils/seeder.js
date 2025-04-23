const { faker } = require('@faker-js/faker/locale/es');
const Usuario = require('../models/usuario.model');
const { sequelize } = require('../config/database');

async function seedUsuarios(cantidad = 150) {
  console.log(`Generando ${cantidad} usuarios...`);
  
  try {
    // Limpiar la tabla antes de seed (opcional)
    await Usuario.destroy({ where: {}, force: true });
    
    // Crear un usuario administrador fijo para pruebas
    await Usuario.create({
      nombre: 'Admin',
      apellido: 'StreamFlow',
      email: 'admin@streamflow.com',
      password: 'admin123',
      rol: 'Administrador'
    });
    
    console.log('Usuario administrador creado:');
    console.log({
      email: 'admin@streamflow.com',
      password: 'admin123',
      rol: 'Administrador'
    });
    
    // Crear un usuario cliente fijo para pruebas
    await Usuario.create({
      nombre: 'Cliente',
      apellido: 'StreamFlow',
      email: 'cliente@streamflow.com',
      password: 'cliente123',
      rol: 'Cliente'
    });
    
    console.log('Usuario cliente creado:');
    console.log({
      email: 'cliente@streamflow.com',
      password: 'cliente123',
      rol: 'Cliente'
    });
    
    // Generar usuarios aleatorios
    const lotes = Math.ceil(cantidad / 50); // Dividir en lotes de 50 para evitar sobrecarga
    
    for (let lote = 0; lote < lotes; lote++) {
      const loteTamaño = Math.min(50, cantidad - lote * 50);
      const usuariosLote = [];
      
      for (let i = 0; i < loteTamaño; i++) {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const email = faker.internet.email({ firstName, lastName }).toLowerCase();
        
        usuariosLote.push({
          nombre: firstName,
          apellido: lastName,
          email: email,
          password: 'password123', // Se hasheará automáticamente por el hook del modelo
          rol: faker.helpers.arrayElement(['Cliente', 'Cliente', 'Cliente', 'Cliente', 'Cliente', 'Cliente', 'Cliente', 'Cliente', 'Cliente', 'Administrador']), // 10% probabilidad de ser admin
          eliminado: faker.datatype.boolean({ probability: 0.05 }) // 5% probabilidad de estar eliminado
        });
      }
      
      // Guardar el lote actual en PostgreSQL
      await Usuario.bulkCreate(usuariosLote);
      console.log(`Lote ${lote + 1}/${lotes} completado`);
    }
    
    console.log(`¡${cantidad} usuarios generados con éxito!`);
  } catch (error) {
    console.error('Error al generar usuarios:', error);
  } finally {
    // Cerrar la conexión de Sequelize
    await sequelize.close();
  }
}

// Ejecutar el seeder si este archivo es invocado directamente
if (require.main === module) {
  require('dotenv').config();
  seedUsuarios()
    .then(() => {
      console.log('Seeder finalizado.');
      process.exit(0);
    })
    .catch(error => {
      console.error('Error en el seeder:', error);
      process.exit(1);
    });
}

module.exports = seedUsuarios;