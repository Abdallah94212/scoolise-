const prisma = require('../../utils/prisma');
const AppError = require('../../utils/AppError');
const { paginationMeta } = require('../../utils/pagination');
const { toPublicUser } = require('../auth/auth.service');

async function dashboard() {
  const [totalStudents, totalAdmins, totalSchools, totalFormations, totalWishes] = await Promise.all([
    prisma.user.count({ where: { role: 'STUDENT' } }),
    prisma.user.count({ where: { role: 'ADMIN' } }),
    prisma.school.count(),
    prisma.formation.count(),
    prisma.wish.count(),
  ]);

  return { totalStudents, totalAdmins, totalSchools, totalFormations, totalWishes };
}

async function listUsers({ q, role, page, pageSize }) {
  const where = {
    AND: [
      role ? { role } : {},
      q
        ? {
            OR: [
              { email: { contains: q, mode: 'insensitive' } },
              { firstName: { contains: q, mode: 'insensitive' } },
              { lastName: { contains: q, mode: 'insensitive' } },
              { ine: { contains: q, mode: 'insensitive' } },
            ],
          }
        : {},
    ],
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * pageSize, take: pageSize }),
    prisma.user.count({ where }),
  ]);

  return { items: users.map(toPublicUser), ...paginationMeta({ total, page, pageSize }) };
}

async function getUserOr404(id) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw AppError.notFound('Utilisateur introuvable.');
  return user;
}

async function updateUser(id, data) {
  await getUserOr404(id);
  const updateData = { ...data };
  if (updateData.email) updateData.email = updateData.email.toLowerCase().trim();
  const user = await prisma.user.update({ where: { id }, data: updateData });
  return toPublicUser(user);
}

async function deleteUser(id, requestingUserId) {
  await getUserOr404(id);
  if (id === requestingUserId) {
    throw AppError.badRequest('Vous ne pouvez pas supprimer votre propre compte administrateur.');
  }
  await prisma.user.delete({ where: { id } });
}

module.exports = { dashboard, listUsers, updateUser, deleteUser };
