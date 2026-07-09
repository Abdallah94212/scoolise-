const request = require('supertest');
const app = require('../src/app');
const { resetDb, disconnectDb, prisma } = require('./helpers/db');
const { createAdmin, createStudent } = require('./helpers/auth');
const { createSchool, createFormation } = require('./helpers/fixtures');

beforeEach(async () => {
  await resetDb();
});

afterAll(async () => {
  await disconnectDb();
});

describe('Garde de rôle sur tout le module admin', () => {
  const routes = [
    ['get', '/api/admin/dashboard'],
    ['get', '/api/admin/users'],
    ['get', '/api/admin/wishes'],
  ];

  it.each(routes)('%s %s refuse sans authentification', async (method, path) => {
    const res = await request(app)[method](path);
    expect(res.status).toBe(401);
  });

  it.each(routes)('%s %s refuse pour un étudiant', async (method, path) => {
    const { token } = await createStudent();
    const res = await request(app)[method](path).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(403);
  });
});

describe('GET /api/admin/dashboard', () => {
  it('retourne les compteurs agrégés', async () => {
    const { token } = await createAdmin();
    await createStudent();
    const school = await createSchool();
    await createFormation(school);

    const res = await request(app).get('/api/admin/dashboard').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.totalStudents).toBe(1);
    expect(res.body.totalAdmins).toBe(1);
    expect(res.body.totalSchools).toBe(1);
    expect(res.body.totalFormations).toBe(1);
    expect(res.body.totalWishes).toBe(0);
  });
});

describe('GET /api/admin/users', () => {
  it('liste les utilisateurs et filtre par rôle', async () => {
    const { token } = await createAdmin();
    await createStudent({ email: 'etudiant1@test.fr' });
    await createStudent({ email: 'etudiant2@test.fr' });

    const res = await request(app).get('/api/admin/users').set('Authorization', `Bearer ${token}`).query({ role: 'STUDENT' });
    expect(res.status).toBe(200);
    expect(res.body.items).toHaveLength(2);
    expect(res.body.items.every((u) => u.role === 'STUDENT')).toBe(true);
    expect(res.body.items[0].passwordHash).toBeUndefined();
  });

  it('recherche par nom, prénom, email ou INE', async () => {
    const { token } = await createAdmin();
    await createStudent({ email: 'lea.martin@test.fr', firstName: 'Léa', lastName: 'Martin' });
    await createStudent({ email: 'yanis.k@test.fr', firstName: 'Yanis', lastName: 'Kaci' });

    const res = await request(app).get('/api/admin/users').set('Authorization', `Bearer ${token}`).query({ q: 'martin' });
    expect(res.status).toBe(200);
    expect(res.body.items).toHaveLength(1);
    expect(res.body.items[0].lastName).toBe('Martin');
  });
});

describe('PUT /api/admin/users/:id', () => {
  it('change le rôle d\'un utilisateur', async () => {
    const { token } = await createAdmin();
    const { user } = await createStudent();

    const res = await request(app)
      .put(`/api/admin/users/${user.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ role: 'ADMIN' });

    expect(res.status).toBe(200);
    expect(res.body.role).toBe('ADMIN');
  });

  it('retourne 404 pour un utilisateur inconnu', async () => {
    const { token } = await createAdmin();
    const res = await request(app)
      .put('/api/admin/users/00000000-0000-0000-0000-000000000000')
      .set('Authorization', `Bearer ${token}`)
      .send({ role: 'ADMIN' });
    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/admin/users/:id', () => {
  it('supprime un utilisateur', async () => {
    const { token } = await createAdmin();
    const { user } = await createStudent();

    const res = await request(app).delete(`/api/admin/users/${user.id}`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(204);

    const stillThere = await prisma.user.findUnique({ where: { id: user.id } });
    expect(stillThere).toBeNull();
  });

  it('refuse la suppression de son propre compte', async () => {
    const { token, user } = await createAdmin();
    const res = await request(app).delete(`/api/admin/users/${user.id}`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(400);
  });
});

describe('GET /api/admin/wishes', () => {
  it('liste toutes les candidatures avec étudiant et formation', async () => {
    const { token } = await createAdmin();
    const { user: student } = await createStudent();
    const school = await createSchool();
    const formation = await createFormation(school);
    await prisma.wish.create({ data: { studentId: student.id, formationId: formation.id, rank: 1 } });

    const res = await request(app).get('/api/admin/wishes').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.items).toHaveLength(1);
    expect(res.body.items[0].student.id).toBe(student.id);
    expect(res.body.items[0].formation.id).toBe(formation.id);
  });

  it('filtre par statut', async () => {
    const { token } = await createAdmin();
    const { user: student } = await createStudent();
    const school = await createSchool();
    const formation1 = await createFormation(school, { name: 'Formation A' });
    const formation2 = await createFormation(school, { name: 'Formation B' });
    await prisma.wish.create({ data: { studentId: student.id, formationId: formation1.id, rank: 1, status: 'ACCEPTE' } });
    await prisma.wish.create({ data: { studentId: student.id, formationId: formation2.id, rank: 2, status: 'EN_ATTENTE' } });

    const res = await request(app).get('/api/admin/wishes').set('Authorization', `Bearer ${token}`).query({ status: 'ACCEPTE' });
    expect(res.status).toBe(200);
    expect(res.body.items).toHaveLength(1);
    expect(res.body.items[0].status).toBe('ACCEPTE');
  });
});
