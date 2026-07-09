const { prisma } = require('./db');

async function createSchool(overrides = {}) {
  return prisma.school.create({
    data: {
      name: 'IUT de Bordeaux',
      city: 'Bordeaux',
      type: 'IUT',
      ...overrides,
    },
  });
}

async function createFormation(school, overrides = {}) {
  return prisma.formation.create({
    data: {
      name: 'BUT Informatique',
      type: 'BUT',
      domain: 'Sciences & ingénierie',
      capacity: 30,
      schoolId: school.id,
      ...overrides,
    },
  });
}

module.exports = { createSchool, createFormation };
