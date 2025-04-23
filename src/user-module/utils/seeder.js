
const { faker } = require('@faker-js/faker/locale/es');
const bcrypt = require('bcryptjs');
const { usuariosCollection } = require('../config/firebase');

async function seedUsuarios(cantidad = 150) {
  console.log(`Generando ${cantidad} usuarios...`);
  
  try {
    // Crear un usuario administrador fijo para pruebas
    const adminPassword = await bcrypt.hash('admin123', 10);
    await usuariosCollection.add({
      nombre: 'Admin',
      apellido: 'StreamFlow',
      email: 'admin@streamflow.com',
      password: adminPassword,
      rol: 'Administrador',
      fechaRegistro: new Date(),
      eliminado: false
    });
    
    console.log('Usuario administrador creado:');
    console.log({
      email: 'admin@streamflow.com',
      password: 'admin123',
      rol: 'Administrador'
    });
    
    // Crear un usuario cliente fijo para pruebas
    const clientePassword = await bcrypt.hash('cliente123', 10);
    await usuariosCollection.add({
      nombre: 'Cliente',
      apellido: 'StreamFlow',
      email: 'cliente@streamflow.com',
      password: clientePassword,
      rol: 'Cliente',
      fechaRegistro: new Date(),
      eliminado: false
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
      const batch = [];
      
      for (let i = 0; i < loteTamaño; i++) {
        const password = await bcrypt.hash('password123', 10);
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const email = faker.internet.email({ firstName, lastName }).toLowerCase();
        
        batch.push({
          nombre: firstName,
          apellido: lastName,
          email: email,
          password: password,
          rol: faker.helpers.arrayElement(['Cliente', 'Cliente', 'Cliente', 'Cliente', 'Cliente', 'Cliente', 'Cliente', 'Cliente', 'Cliente', 'Administrador']), // 10% probabilidad de ser admin
          fechaRegistro: faker.date.past({ years: 2 }),
          eliminado: faker.datatype.boolean({ probability: 0.05 }) // 5% probabilidad de estar eliminado
        });
      }
      
      // Guardar el lote actual en Firebase
      const batchOperation = batch.map(usuario => {
        return usuariosCollection.add(usuario);
      });
      
      await Promise.all(batchOperation);
      console.log(`Lote ${lote + 1}/${lotes} completado`);
    }
    
    console.log(`¡${cantidad} usuarios generados con éxito!`);
  } catch (error) {
    console.error('Error al generar usuarios:', error);
  }
}

// Ejecutar el seeder si este archivo es invocado directamente
if (require.main === module) {
  require('dotenv').config();
  seedUsuarios()
    .then(() => {
      console.log('Seeder finalizado. Presione Ctrl+C para salir.');
    })
    .catch(error => {
      console.error('Error en el seeder:', error);
      process.exit(1);
    });
}

module.exports = seedUsuarios;