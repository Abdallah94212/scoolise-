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

async function create(data) {
  await assertSchoolExists(data.schoolId);
  return prisma.formation.create({ data, include: includeSchool });
}

async function update(id, data) {
  await getById(id);
  if (data.schoolId) await assertSchoolExists(data.schoolId);
  return prisma.formation.update({ where: { id }, data, include: includeSchool });
}

async function remove(id) {
  await getById(id);
  await prisma.formation.delete({ where: { id } });
}

module.exports = { list, getById, create, update, remove };
