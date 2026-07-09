const { prisma } = require('./db');
const { hashPassword } = require('../../src/utils/password');
const { signToken } = require('../../src/utils/jwt');

let ineCounter = 100000000;

function nextIne() {
  ineCounter += 1;
  return `${ineCounter}AB`;
}

async function createUser({ role = 'STUDENT', email, password = 'Password1', ...rest } = {}) {
  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      email: email || `user-${Date.now()}-${Math.random().toString(36).slice(2)}@test.fr`,
      passwordHash,
      role,
      firstName: rest.firstName || 'Test',
      lastName: rest.lastName || 'User',
      ine: role === 'STUDENT' ? rest.ine || nextIne() : undefined,
    },
  });
  return { user, token: signToken(user), password };
}

async function createAdmin(overrides = {}) {
  return createUser({ role: 'ADMIN', ...overrides });
}

async function createStudent(overrides = {}) {
  return createUser({ role: 'STUDENT', ...overrides });
}

module.exports = { createUser, createAdmin, createStudent, nextIne };
