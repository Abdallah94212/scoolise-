const request = require('supertest');
const app = require('../src/app');
const { resetDb, disconnectDb } = require('./helpers/db');
const { createAdmin, createStudent } = require('./helpers/auth');
const { createSchool, createFormation } = require('./helpers/fixtures');

beforeEach(async () => {
  await resetDb();
});

afterAll(async () => {
  await disconnectDb();
});

describe('GET /api/formations', () => {
  it('liste les formations publiquement avec l\'établissement inclus', async () => {
    const school = await createSchool({ name: 'IUT de Bordeaux' });
    await createFormation(school, { name: 'BUT Informatique' });
    const res = await request(app).get('/api/formations');
    expect(res.status).toBe(200);
    expect(res.body.items).toHaveLength(1);
    expect(res.body.items[0].school.name).toBe('IUT de Bordeaux');
  });

  it('filtre par domaine et par type', async () => {
    const school = await createSchool();
    await createFormation(school, { name: 'BUT Informatique', type: 'BUT', domain: 'Sciences & ingénierie' });
    await createFormation(school, { name: 'Licence Droit', type: 'Licence', domain: 'Droit' });
    const res = await request(app).get('/api/formations').query({ domain: 'Droit' });
    expect(res.status).toBe(200);
    expect(res.body.items).toHaveLength(1);
    expect(res.body.items[0].name).toBe('Licence Droit');
  });

  it('recherche par nom (q)', async () => {
    const school = await createSchool();
    await createFormation(school, { name: 'BUT Techniques de Commercialisation' });
    await createFormation(school, { name: 'Licence Mathématiques' });
    const res = await request(app).get('/api/formations').query({ q: 'commercialisation' });
    expect(res.status).toBe(200);
    expect(res.body.items).toHaveLength(1);
  });

  it('filtre par établissement via schoolId', async () => {
    const school1 = await createSchool({ name: 'École A' });
    const school2 = await createSchool({ name: 'École B' });
    await createFormation(school1, { name: 'Formation A' });
    await createFormation(school2, { name: 'Formation B' });
    const res = await request(app).get('/api/formations').query({ schoolId: school1.id });
    expect(res.status).toBe(200);
    expect(res.body.items).toHaveLength(1);
    expect(res.body.items[0].name).toBe('Formation A');
  });
});

describe('GET /api/schools/:id/formations', () => {
  it("liste uniquement les formations de l'établissement demandé", async () => {
    const school1 = await createSchool({ name: 'École A' });
    const school2 = await createSchool({ name: 'École B' });
    await createFormation(school1, { name: 'Formation A' });
    await createFormation(school2, { name: 'Formation B' });
    const res = await request(app).get(`/api/schools/${school1.id}/formations`);
    expect(res.status).toBe(200);
    expect(res.body.items).toHaveLength(1);
    expect(res.body.items[0].name).toBe('Formation A');
  });
});

describe('POST /api/formations', () => {
  it('crée une formation pour un administrateur avec un établissement valide', async () => {
    const { token } = await createAdmin();
    const school = await createSchool();
    const res = await request(app)
      .post('/api/formations')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'BUT Informatique', type: 'BUT', domain: 'Sciences', schoolId: school.id, capacity: 30 });
    expect(res.status).toBe(201);
    expect(res.body.school.id).toBe(school.id);
  });

  it('refuse un établissement inexistant avec un message clair', async () => {
    const { token } = await createAdmin();
    const res = await request(app)
      .post('/api/formations')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'BUT Informatique', type: 'BUT', domain: 'Sciences', schoolId: '00000000-0000-0000-0000-000000000000' });
    expect(res.status).toBe(400);
    expect(res.body.errors[0].field).toBe('schoolId');
  });

  it('refuse pour un étudiant', async () => {
    const { token } = await createStudent();
    const school = await createSchool();
    const res = await request(app)
      .post('/api/formations')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'BUT Informatique', type: 'BUT', domain: 'Sciences', schoolId: school.id });
    expect(res.status).toBe(403);
  });
});

describe('PUT /api/formations/:id et DELETE /api/formations/:id', () => {
  it('modifie une formation (admin)', async () => {
    const { token } = await createAdmin();
    const school = await createSchool();
    const formation = await createFormation(school, { name: 'Ancien nom' });
    const res = await request(app)
      .put(`/api/formations/${formation.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Nouveau nom' });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Nouveau nom');
  });

  it('supprime une formation (admin)', async () => {
    const { token } = await createAdmin();
    const school = await createSchool();
    const formation = await createFormation(school);
    const res = await request(app).delete(`/api/formations/${formation.id}`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(204);
    const getRes = await request(app).get(`/api/formations/${formation.id}`);
    expect(getRes.status).toBe(404);
  });
});
