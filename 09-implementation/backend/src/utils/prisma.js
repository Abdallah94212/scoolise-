const { PrismaClient } = require('@prisma/client');

// Instance unique partagée par toute l'app (évite d'épuiser le pool de
// connexions Postgres en recréant un client par requête).
const prisma = global.__scoolizePrisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.__scoolizePrisma = prisma;
}

module.exports = prisma;
