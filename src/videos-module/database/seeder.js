const { connectMongo, closeMongo } = require("./mongooseConfig");
const Video = require("../models/videoModel");
const { faker } = require("@faker-js/faker");

/**
 * Semilla de la colección de videos: crea documentos falsos si hay menos de 5 existents.
 */
async function seedDatabase() {
  try {
    await connectMongo();

    // Verificar cantidad de documentos activos para no resembrar innecesariamente
    const count = await Video.countDocuments({ isActive: true });
    if (count > 5) {
      console.log("Collection already seeded");
      return;
    }

    // Limpiar colección
    await Video.deleteMany({});

    // Generar y almacenar 10 videos falsos
    const movies = Array.from({ length: 10 }).map(() => ({
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      genre: faker.music.genre(),
      isActive: true,
    }));

    await Video.insertMany(movies);
    console.log("Database seeded with movies");
  } catch (err) {
    console.error("Seeding error:", err);
  } finally {
    await closeMongo();
  }
}

module.exports = {
  seedDatabase,
};
