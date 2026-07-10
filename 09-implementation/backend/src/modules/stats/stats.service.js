const prisma = require('../../utils/prisma');
const AppError = require('../../utils/AppError');

// Taux d'accès = admis / vœux, exprimé en pourcentage, arrondi à 1 décimale.
// Calculé automatiquement à chaque écriture — jamais fourni par le client.
function computeTauxAcces(nbAdmis, nbVoeux) {
  if (!nbVoeux) return 0;
  return Math.round((nbAdmis / nbVoeux) * 1000) / 10;
}

async function listByFormation(formationId) {
  const formation = await prisma.formation.findUnique({ where: { id: formationId } });
  if (!formation) throw AppError.notFound('Formation introuvable.');

  return prisma.formationStat.findMany({
    where: { formationId },
    orderBy: { year: 'asc' },
  });
}

async function upsert(formationId, { year, nbVoeux, nbPropositions, nbAdmis }, actingUser) {
  const formation = await prisma.formation.findUnique({ where: { id: formationId } });
  if (!formation) throw AppError.notFound('Formation introuvable.');

  if (actingUser.role === 'SCHOOL_STAFF' && actingUser.schoolId !== formation.schoolId) {
    throw AppError.forbidden('Vous ne pouvez gérer que les statistiques de votre propre établissement.');
  }

  if (nbAdmis > nbVoeux) {
    throw AppError.badRequest("Le nombre d'admis ne peut pas dépasser le nombre de vœux.", [
      { field: 'nbAdmis', message: "Le nombre d'admis ne peut pas dépasser le nombre de vœux." },
    ]);
  }
  if (nbPropositions > nbVoeux) {
    throw AppError.badRequest('Le nombre de propositions ne peut pas dépasser le nombre de vœux.', [
      { field: 'nbPropositions', message: 'Le nombre de propositions ne peut pas dépasser le nombre de vœux.' },
    ]);
  }

  const tauxAcces = computeTauxAcces(nbAdmis, nbVoeux);

  return prisma.formationStat.upsert({
    where: { formationId_year: { formationId, year } },
    update: { nbVoeux, nbPropositions, nbAdmis, tauxAcces },
    create: { formationId, year, nbVoeux, nbPropositions, nbAdmis, tauxAcces },
  });
}

module.exports = { listByFormation, upsert, computeTauxAcces };
