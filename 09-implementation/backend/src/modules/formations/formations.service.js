const prisma = require('../../utils/prisma');
const AppError = require('../../utils/AppError');
const { paginationMeta } = require('../../utils/pagination');

const includeSchool = { school: { select: { id: true, name: true, city: true, type: true } } };

async function list({ q, type, domain, schoolId, page, pageSize }) {
  const where = {
    AND: [
      q ? { name: { contains: q, mode: 'insensitive' } } : {},
      type ? { type: { equals: type, mode: 'insensitive' } } : {},
      domain ? { domain: { equals: domain, mode: 'insensitive' } } : {},
      schoolId ? { schoolId } : {},
    ],
  };

  const [items, total] = await Promise.all([
    prisma.formation.findMany({
      where,
      include: includeSchool,
      orderBy: { name: 'asc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.formation.count({ where }),
  ]);

  return { items, ...paginationMeta({ total, page, pageSize }) };
}

async function getById(id) {
  const formation = await prisma.formation.findUnique({ where: { id }, include: includeSchool });
  if (!formation) throw AppError.notFound('Formation introuvable.');
  return formation;
}

async function assertSchoolExists(schoolId) {
  const school = await prisma.school.findUnique({ where: { id: schoolId } });
  if (!school) {
    throw AppError.badRequest("L'établissement indiqué n'existe pas.", [
      { field: 'schoolId', message: "L'établissement indiqué n'existe pas." },
    ]);
  }
}

// Un ADMIN gère toutes les écoles ; un SCHOOL_STAFF ne peut gérer que les
// formations de son propre établissement (schoolId associé à son compte).
function assertOwnership(actingUser, schoolId) {
  if (actingUser.role === 'SCHOOL_STAFF' && actingUser.schoolId !== schoolId) {
    throw AppError.forbidden('Vous ne pouvez gérer que les formations de votre propre établissement.');
  }
}

async function create(data, actingUser) {
  await assertSchoolExists(data.schoolId);
  assertOwnership(actingUser, data.schoolId);
  return prisma.formation.create({ data, include: includeSchool });
}

async function update(id, data, actingUser) {
  const existing = await getById(id);
  assertOwnership(actingUser, existing.schoolId);
  if (data.schoolId) {
    await assertSchoolExists(data.schoolId);
    assertOwnership(actingUser, data.schoolId);
  }
  return prisma.formation.update({ where: { id }, data, include: includeSchool });
}

async function remove(id, actingUser) {
  const existing = await getById(id);
  assertOwnership(actingUser, existing.schoolId);
  await prisma.formation.delete({ where: { id } });
}

module.exports = { list, getById, create, update, remove, assertOwnership };
