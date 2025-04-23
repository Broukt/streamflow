require('dotenv').config();
const prisma = require('../database/prisma');
const { faker } = require('@faker-js/faker');
const { v4: uuidv4 } = require('uuid');

async function seedReceipts() {
  try {
    // 1. Verificar si ya hay suficientes documentos
    const count = await prisma.receipt.count({ where: { isActive: true } });
    if (count >= 10) {
      console.log('📄 Receipts already seeded');
      return;
    }

    // 2. Limpiar colección
    await prisma.receipt.deleteMany({});

    // 3. Generar datos falsos
    const statuses = ['Pendiente', 'Pagado', 'Vencido'];
    const receiptsData = Array.from({ length: 300 }).map(() => ({
      id: uuidv4(),
      totalAmount: parseInt(faker.commerce.price({ min: 100, max: 100000, dec: 0 })),
      status: faker.helpers.arrayElement(statuses),
      isActive: faker.datatype.boolean(),
      // userId puede poblarse con UUID de usuarios existentes, si es necesario
      userId: faker.string.uuid(),
    }));

    // 4. Insertar en batch
    await prisma.receipt.createMany({ data: receiptsData });
    console.log('✅ Seeded receipts:', receiptsData.length);
  } catch (err) {
    console.error('❌ Error seeding receipts:', err);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar
seedReceipts();