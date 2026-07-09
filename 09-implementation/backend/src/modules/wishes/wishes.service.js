const prisma = require('../../utils/prisma');
const AppError = require('../../utils/AppError');
const { paginationMeta } = require('../../utils/pagination');

const MAX_WISHES_PER_STUDENT = 10;

const includeDetails = {
  student: { select: { id: true, firstName: true, lastName: true, email: true, ine: true } },
  formation: {
    select: {
      id: true,
      name: true,
      type: true,
      domain: true,
      school: { select: { id: true, name: true, city: true } },
    },
  },
};

// Vue administrateur : consultation de toutes les candidatures (vœux) tous
// étudiants confondus. La création/modification côté étudiant est ajoutée
// dans le module student (voir wishes.routes.js, phase "vœux côté frontend").
async function listAll({ status, formationId, studentId, page, pageSize }) {
  const where = {
    AND: [status ? { status } : {}, formationId ? { formationId } : {}, studentId ? { studentId } : {}],
  };

  const [items, total] = await Promise.all([
    prisma.wish.findMany({
      where,
      include: includeDetails,
      orderBy: [{ createdAt: 'desc' }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.wish.count({ where }),
  ]);

  return { items, ...paginationMeta({ total, page, pageSize }) };
}

async function listMine(studentId) {
  return prisma.wish.findMany({
    where: { studentId },
    include: includeDetails,
    orderBy: { rank: 'asc' },
  });
}

async function create(studentId, formationId) {
  const formation = await prisma.formation.findUnique({ where: { id: formationId } });
  if (!formation) {
    throw AppError.badRequest("Cette formation n'existe pas.", [
      { field: 'formationId', message: "Cette formation n'existe pas." },
    ]);
  }

  const existing = await prisma.wish.findUnique({
    where: { studentId_formationId: { studentId, formationId } },
  });
  if (existing) {
    throw AppError.conflict('Vous avez déjà fait un vœu pour cette formation.', [
      { field: 'formationId', message: 'Vous avez déjà fait un vœu pour cette formation.' },
    ]);
  }

  const count = await prisma.wish.count({ where: { studentId } });
  if (count >= MAX_WISHES_PER_STUDENT) {
    throw AppError.badRequest(`Vous ne pouvez pas dépasser ${MAX_WISHES_PER_STUDENT} vœux.`);
  }

  return prisma.wish.create({
    data: { studentId, formationId, rank: count + 1 },
    include: includeDetails,
  });
}

async function getOwnedOr404(id, studentId) {
  const wish = await prisma.wish.findUnique({ where: { id } });
  if (!wish || wish.studentId !== studentId) {
    throw AppError.notFound('Vœu introuvable.');
  }
  return wish;
}

async function updateRank(id, studentId, rank) {
  await getOwnedOr404(id, studentId);
  return prisma.wish.update({ where: { id }, data: { rank }, include: includeDetails });
}

async function remove(id, studentId) {
  await getOwnedOr404(id, studentId);
  await prisma.wish.delete({ where: { id } });
}

module.exports = { listAll, listMine, create, updateRank, remove, includeDetails, MAX_WISHES_PER_STUDENT };
