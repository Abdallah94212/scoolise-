const prisma = require('../../utils/prisma');
const { hashPassword, comparePassword } = require('../../utils/password');
const { signToken } = require('../../utils/jwt');
const { normalizeIne } = require('../../utils/ine');
const AppError = require('../../utils/AppError');

function toPublicUser(user) {
  const { passwordHash, ...publicUser } = user;
  return publicUser;
}

async function register({ email, password, firstName, lastName, ine }) {
  const normalizedEmail = email.toLowerCase().trim();
  const normalizedIne = normalizeIne(ine);

  // Vérifications préalables : messages clairs et ciblés avant même de
  // taper la contrainte unique en base (qui reste le filet de sécurité final).
  const existingEmail = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existingEmail) {
    throw AppError.conflict('Cette adresse email est déjà utilisée par un compte existant.', [
      { field: 'email', message: 'Cette adresse email est déjà utilisée par un compte existant.' },
    ]);
  }

  const existingIne = await prisma.user.findUnique({ where: { ine: normalizedIne } });
  if (existingIne) {
    throw AppError.conflict('Ce numéro INE est déjà associé à un autre compte.', [
      { field: 'ine', message: 'Ce numéro INE est déjà associé à un autre compte.' },
    ]);
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      email: normalizedEmail,
      passwordHash,
      firstName,
      lastName,
      ine: normalizedIne,
      role: 'STUDENT',
    },
  });

  return { user: toPublicUser(user), token: signToken(user) };
}

async function login({ email, password }) {
  const normalizedEmail = email.toLowerCase().trim();
  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (!user) {
    throw AppError.unauthorized('Email ou mot de passe incorrect.');
  }

  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) {
    throw AppError.unauthorized('Email ou mot de passe incorrect.');
  }

  return { user: toPublicUser(user), token: signToken(user) };
}

module.exports = { register, login, toPublicUser };
