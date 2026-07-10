const prisma = require('../../utils/prisma');
const AppError = require('../../utils/AppError');
const { paginationMeta } = require('../../utils/pagination');

async function list({ q, type, city, page, pageSize }) {
  const where = {
    AND: [
      q ? { name: { contains: q, mode: 'insensitive' } } : {},
      type ? { type: { equals: type, mode: 'insensitive' } } : {},
      city ? { city: { equals: city, mode: 'insensitive' } } : {},
    ],
  };

  const [items, total] = await Promise.all([
    prisma.school.findMany({
      where,
      orderBy: { name: 'asc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.school.count({ where }),
  ]);

  return { items, ...paginationMeta({ total, page, pageSize }) };
}

async function getById(id) {
  const school = await prisma.school.findUnique({ where: { id } });
  if (!school) throw AppError.notFound('Établissement introuvable.');
  return school;
}

async function create(data) {
  return prisma.school.create({ data: normalize(data) });
}

async function update(id, data, actingUser) {
  await getById(id);
  if (actingUser.role === 'SCHOOL_STAFF' && actingUser.schoolId !== id) {
    throw AppError.forbidden('Vous ne pouvez modifier que votre propre établissement.');
  }
  return prisma.school.update({ where: { id }, data: normalize(data) });
}

async function remove(id) {
  await getById(id);
  await prisma.school.delete({ where: { id } });
}

function normalize(data) {
  const clean = { ...data };
  if (clean.website === '') clean.website = null;
  return clean;
}

module.exports = { list, getById, create, update, remove };
