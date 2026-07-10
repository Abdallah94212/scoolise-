const prisma = require('../../utils/prisma');
const AppError = require('../../utils/AppError');
const { paginationMeta } = require('../../utils/pagination');
const { toPublicUser } = require('../auth/auth.service');

async function dashboard() {
  const [totalStudents, totalAdmins, totalSchoolStaff, totalSchools, totalFormations, totalWishes] = await Promise.all([
    prisma.user.count({ where: { role: 'STUDENT' } }),
    prisma.user.count({ where: { role: 'ADMIN' } }),
    prisma.user.count({ where: { role: 'SCHOOL_STAFF' } }),
    prisma.school.count(),
    prisma.formation.count(),
    prisma.wish.count(),
  ]);

  return { totalStudents, totalAdmins, totalSchoolStaff, totalSchools, totalFormations, totalWishes };
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
    prisma.user.findMany({
      where,
      include: { school: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
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
  const existing = await getUserOr404(id);
  const updateData = { ...data };
  if (updateData.email) updateData.email = updateData.email.toLowerCase().trim();

  const resultingRole = updateData.role || existing.role;
  if (resultingRole === 'SCHOOL_STAFF') {
    const resultingSchoolId = updateData.schoolId !== undefined ? updateData.schoolId : existing.schoolId;
    if (!resultingSchoolId) {
      throw AppError.badRequest("Un établissement doit être associé à un compte « personnel d'établissement ».", [
        { field: 'schoolId', message: "Un établissement doit être associé à un compte « personnel d'établissement »." },
      ]);
    }
    const school = await prisma.school.findUnique({ where: { id: resultingSchoolId } });
    if (!school) {
      throw AppError.badRequest("L'établissement indiqué n'existe pas.", [
        { field: 'schoolId', message: "L'établissement indiqué n'existe pas." },
      ]);
    }
  } else if (updateData.role) {
    // Change de rôle vers STUDENT/ADMIN : un rattachement à un établissement n'a plus de sens.
    updateData.schoolId = null;
  }

  const user = await prisma.user.update({
    where: { id },
    data: updateData,
    include: { school: { select: { id: true, name: true } } },
  });
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
