const prisma = require('../../src/utils/prisma');

// Vide toutes les tables applicatives entre chaque test, contre la vraie
// base Postgres de test (pas de mock) — garantit des tests indépendants
// et reproductibles.
async function resetDb() {
  await prisma.$transaction([
    prisma.wish.deleteMany(),
    prisma.formationStat.deleteMany(),
    prisma.formation.deleteMany(),
    prisma.school.deleteMany(),
    prisma.user.deleteMany(),
  ]);
}

async function disconnectDb() {
  await prisma.$disconnect();
}

module.exports = { prisma, resetDb, disconnectDb };
