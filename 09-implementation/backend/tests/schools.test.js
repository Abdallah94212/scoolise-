const request = require('supertest');
const app = require('../src/app');
const { resetDb, disconnectDb } = require('./helpers/db');
const { createAdmin, createStudent } = require('./helpers/auth');
const { createSchool } = require('./helpers/fixtures');

beforeEach(async () => {
  await resetDb();
});

afterAll(async () => {
  await disconnectDb();
});

describe('GET /api/schools', () => {
  it('liste les établissements publiquement, sans authentification', async () => {
    await createSchool({ name: 'IUT de Bordeaux', city: 'Bordeaux' });
    await createSchool({ name: 'Université Lyon 2', city: 'Lyon' });
    const res = await request(app).get('/api/schools');
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(2);
    expect(res.body.items).toHaveLength(2);
  });

  it('recherche par nom (q) insensible à la casse', async () => {
    await createSchool({ name: 'IUT de Bordeaux' });
    await createSchool({ name: 'Université Lyon 2' });
    const res = await request(app).get('/api/schools').query({ q: 'bordeaux' });
    expect(res.status).toBe(200);
    expect(res.body.items).toHaveLength(1);
    expect(res.body.items[0].name).toBe('IUT de Bordeaux');
  });

  it('filtre par ville et par type', async () => {
    await createSchool({ name: 'IUT de Bordeaux', city: 'Bordeaux', type: 'IUT' });
    await createSchool({ name: 'Université de Bordeaux', city: 'Bordeaux', type: 'Université' });
    const res = await request(app).get('/api/schools').query({ city: 'Bordeaux', type: 'IUT' });
    expect(res.status).toBe(200);
    expect(res.body.items).toHaveLength(1);
    expect(res.body.items[0].type).toBe('IUT');
  });

  it('pagine les résultats', async () => {
    for (let i = 0; i < 15; i += 1) {
      await createSchool({ name: `École ${i}` });
    }
    const res = await request(app).get('/api/schools').query({ page: 2, pageSize: 10 });
    expect(res.status).toBe(200);
    expect(res.body.items).toHaveLength(5);
    expect(res.body.totalPages).toBe(2);
  });
});

describe('GET /api/schools/:id', () => {
  it('retourne 404 si introuvable', async () => {
    const res = await request(app).get('/api/schools/00000000-0000-0000-0000-000000000000');
    expect(res.status).toBe(404);
  });
});

describe('POST /api/schools', () => {
  it('refuse sans authentification', async () => {
    const res = await request(app).post('/api/schools').send({ name: 'X', city: 'Y', type: 'Z' });
    expect(res.status).toBe(401);
  });

  it('refuse pour un étudiant', async () => {
    const { token } = await createStudent();
    const res = await request(app)
      .post('/api/schools')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'X', city: 'Y', type: 'Z' });
    expect(res.status).toBe(403);
  });

  it('crée un établissement pour un administrateur', async () => {
    const { token } = await createAdmin();
    const res = await request(app)
      .post('/api/schools')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'IUT de Bordeaux', city: 'Bordeaux', type: 'IUT' });
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
  });

  it('refuse des champs manquants avec des messages clairs', async () => {
    const { token } = await createAdmin();
    const res = await request(app).post('/api/schools').set('Authorization', `Bearer ${token}`).send({ name: 'X' });
    expect(res.status).toBe(400);
    expect(res.body.errors.some((e) => e.field === 'city')).toBe(true);
    expect(res.body.errors.some((e) => e.field === 'type')).toBe(true);
  });
});

describe('PUT /api/schools/:id et DELETE /api/schools/:id', () => {
  it('modifie un établissement (admin)', async () => {
    const { token } = await createAdmin();
    const school = await createSchool({ name: 'Ancien nom' });
    const res = await request(app)
      .put(`/api/schools/${school.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Nouveau nom' });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Nouveau nom');
  });

  it('supprime un établissement (admin)', async () => {
    const { token } = await createAdmin();
    const school = await createSchool();
    const res = await request(app).delete(`/api/schools/${school.id}`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(204);
    const getRes = await request(app).get(`/api/schools/${school.id}`);
    expect(getRes.status).toBe(404);
  });
});
