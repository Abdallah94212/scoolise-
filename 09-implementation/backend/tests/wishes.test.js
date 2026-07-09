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

describe('GET /api/wishes/me', () => {
  it('refuse sans authentification', async () => {
    const res = await request(app).get('/api/wishes/me');
    expect(res.status).toBe(401);
  });

  it('refuse pour un administrateur', async () => {
    const { token } = await createAdmin();
    const res = await request(app).get('/api/wishes/me').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(403);
  });

  it("liste uniquement les vœux de l'étudiant connecté", async () => {
    const { token, user } = await createStudent();
    const { user: other } = await createStudent();
    const school = await createSchool();
    const formation1 = await createFormation(school, { name: 'Formation A' });
    const formation2 = await createFormation(school, { name: 'Formation B' });
    await prisma.wish.create({ data: { studentId: user.id, formationId: formation1.id, rank: 1 } });
    await prisma.wish.create({ data: { studentId: other.id, formationId: formation2.id, rank: 1 } });

    const res = await request(app).get('/api/wishes/me').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].formation.name).toBe('Formation A');
  });
});

describe('POST /api/wishes', () => {
  it('crée un vœu avec un rang auto-assigné', async () => {
    const { token } = await createStudent();
    const school = await createSchool();
    const formation = await createFormation(school);

    const res = await request(app).post('/api/wishes').set('Authorization', `Bearer ${token}`).send({ formationId: formation.id });
    expect(res.status).toBe(201);
    expect(res.body.rank).toBe(1);
    expect(res.body.status).toBe('EN_ATTENTE');
  });

  it('incrémente le rang pour chaque nouveau vœu', async () => {
    const { token } = await createStudent();
    const school = await createSchool();
    const f1 = await createFormation(school, { name: 'F1' });
    const f2 = await createFormation(school, { name: 'F2' });

    await request(app).post('/api/wishes').set('Authorization', `Bearer ${token}`).send({ formationId: f1.id });
    const res2 = await request(app).post('/api/wishes').set('Authorization', `Bearer ${token}`).send({ formationId: f2.id });

    expect(res2.body.rank).toBe(2);
  });

  it('refuse un doublon de vœu sur la même formation', async () => {
    const { token } = await createStudent();
    const school = await createSchool();
    const formation = await createFormation(school);
    await request(app).post('/api/wishes').set('Authorization', `Bearer ${token}`).send({ formationId: formation.id });

    const res = await request(app).post('/api/wishes').set('Authorization', `Bearer ${token}`).send({ formationId: formation.id });
    expect(res.status).toBe(409);
  });

  it('refuse un 11e vœu (limite de 10)', async () => {
    const { token, user } = await createStudent();
    const school = await createSchool();
    for (let i = 0; i < 10; i += 1) {
      const f = await createFormation(school, { name: `Formation ${i}` });
      await prisma.wish.create({ data: { studentId: user.id, formationId: f.id, rank: i + 1 } });
    }
    const overflow = await createFormation(school, { name: 'Formation 11' });

    const res = await request(app).post('/api/wishes').set('Authorization', `Bearer ${token}`).send({ formationId: overflow.id });
    expect(res.status).toBe(400);
  });

  it('refuse une formation inexistante avec un message clair', async () => {
    const { token } = await createStudent();
    const res = await request(app)
      .post('/api/wishes')
      .set('Authorization', `Bearer ${token}`)
      .send({ formationId: '00000000-0000-0000-0000-000000000000' });
    expect(res.status).toBe(400);
    expect(res.body.errors[0].field).toBe('formationId');
  });
});

describe('PUT /api/wishes/:id', () => {
  it('modifie le rang de son propre vœu', async () => {
    const { token, user } = await createStudent();
    const school = await createSchool();
    const formation = await createFormation(school);
    const wish = await prisma.wish.create({ data: { studentId: user.id, formationId: formation.id, rank: 1 } });

    const res = await request(app).put(`/api/wishes/${wish.id}`).set('Authorization', `Bearer ${token}`).send({ rank: 3 });
    expect(res.status).toBe(200);
    expect(res.body.rank).toBe(3);
  });

  it("refuse de modifier le vœu d'un autre étudiant", async () => {
    const { token } = await createStudent();
    const { user: other } = await createStudent();
    const school = await createSchool();
    const formation = await createFormation(school);
    const wish = await prisma.wish.create({ data: { studentId: other.id, formationId: formation.id, rank: 1 } });

    const res = await request(app).put(`/api/wishes/${wish.id}`).set('Authorization', `Bearer ${token}`).send({ rank: 2 });
    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/wishes/:id', () => {
  it('retire son propre vœu', async () => {
    const { token, user } = await createStudent();
    const school = await createSchool();
    const formation = await createFormation(school);
    const wish = await prisma.wish.create({ data: { studentId: user.id, formationId: formation.id, rank: 1 } });

    const res = await request(app).delete(`/api/wishes/${wish.id}`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(204);

    const stillThere = await prisma.wish.findUnique({ where: { id: wish.id } });
    expect(stillThere).toBeNull();
  });

  it("refuse de retirer le vœu d'un autre étudiant", async () => {
    const { token } = await createStudent();
    const { user: other } = await createStudent();
    const school = await createSchool();
    const formation = await createFormation(school);
    const wish = await prisma.wish.create({ data: { studentId: other.id, formationId: formation.id, rank: 1 } });

    const res = await request(app).delete(`/api/wishes/${wish.id}`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
  });
});
