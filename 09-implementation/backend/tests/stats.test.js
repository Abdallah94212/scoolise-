const request = require('supertest');
const app = require('../src/app');
const { resetDb, disconnectDb, prisma } = require('./helpers/db');
const { createAdmin, createStudent } = require('./helpers/auth');
const { createSchool, createFormation } = require('./helpers/fixtures');

const CURRENT_YEAR = new Date().getFullYear();

beforeEach(async () => {
  await resetDb();
});

afterAll(async () => {
  await disconnectDb();
});

describe('GET /api/formations/:id/stats', () => {
  it('retourne un tableau vide si aucune statistique enregistrée', async () => {
    const school = await createSchool();
    const formation = await createFormation(school);
    const res = await request(app).get(`/api/formations/${formation.id}/stats`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('retourne les statistiques triées par année, publiquement', async () => {
    const school = await createSchool();
    const formation = await createFormation(school);
    await prisma.formationStat.createMany({
      data: [
        { formationId: formation.id, year: CURRENT_YEAR - 1, nbVoeux: 100, nbPropositions: 40, nbAdmis: 20, tauxAcces: 20 },
        { formationId: formation.id, year: CURRENT_YEAR - 3, nbVoeux: 100, nbPropositions: 40, nbAdmis: 10, tauxAcces: 10 },
      ],
    });
    const res = await request(app).get(`/api/formations/${formation.id}/stats`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0].year).toBe(CURRENT_YEAR - 3);
    expect(res.body[1].year).toBe(CURRENT_YEAR - 1);
  });

  it('retourne 404 pour une formation inconnue', async () => {
    const res = await request(app).get('/api/formations/00000000-0000-0000-0000-000000000000/stats');
    expect(res.status).toBe(404);
  });
});

describe('POST /api/formations/:id/stats', () => {
  it('calcule automatiquement le taux d\'accès à la création', async () => {
    const { token } = await createAdmin();
    const school = await createSchool();
    const formation = await createFormation(school);

    const res = await request(app)
      .post(`/api/formations/${formation.id}/stats`)
      .set('Authorization', `Bearer ${token}`)
      .send({ year: CURRENT_YEAR - 1, nbVoeux: 200, nbPropositions: 80, nbAdmis: 50 });

    expect(res.status).toBe(201);
    expect(res.body.tauxAcces).toBe(25);
  });

  it('gère le cas nbVoeux = 0 sans division par zéro', async () => {
    const { token } = await createAdmin();
    const school = await createSchool();
    const formation = await createFormation(school);

    const res = await request(app)
      .post(`/api/formations/${formation.id}/stats`)
      .set('Authorization', `Bearer ${token}`)
      .send({ year: CURRENT_YEAR - 1, nbVoeux: 0, nbPropositions: 0, nbAdmis: 0 });

    expect(res.status).toBe(201);
    expect(res.body.tauxAcces).toBe(0);
  });

  it('met à jour (upsert) une statistique existante pour la même année et recalcule le taux', async () => {
    const { token } = await createAdmin();
    const school = await createSchool();
    const formation = await createFormation(school);

    await request(app)
      .post(`/api/formations/${formation.id}/stats`)
      .set('Authorization', `Bearer ${token}`)
      .send({ year: CURRENT_YEAR - 1, nbVoeux: 100, nbPropositions: 40, nbAdmis: 20 });

    const res = await request(app)
      .post(`/api/formations/${formation.id}/stats`)
      .set('Authorization', `Bearer ${token}`)
      .send({ year: CURRENT_YEAR - 1, nbVoeux: 100, nbPropositions: 60, nbAdmis: 40 });

    expect(res.status).toBe(201);
    expect(res.body.tauxAcces).toBe(40);

    const all = await prisma.formationStat.findMany({ where: { formationId: formation.id } });
    expect(all).toHaveLength(1);
  });

  it('refuse un nombre d\'admis supérieur au nombre de vœux', async () => {
    const { token } = await createAdmin();
    const school = await createSchool();
    const formation = await createFormation(school);

    const res = await request(app)
      .post(`/api/formations/${formation.id}/stats`)
      .set('Authorization', `Bearer ${token}`)
      .send({ year: CURRENT_YEAR - 1, nbVoeux: 10, nbPropositions: 5, nbAdmis: 20 });

    expect(res.status).toBe(400);
    expect(res.body.errors[0].field).toBe('nbAdmis');
  });

  it('refuse pour un étudiant', async () => {
    const { token } = await createStudent();
    const school = await createSchool();
    const formation = await createFormation(school);

    const res = await request(app)
      .post(`/api/formations/${formation.id}/stats`)
      .set('Authorization', `Bearer ${token}`)
      .send({ year: CURRENT_YEAR - 1, nbVoeux: 10, nbPropositions: 5, nbAdmis: 2 });

    expect(res.status).toBe(403);
  });

  it('refuse sans authentification', async () => {
    const school = await createSchool();
    const formation = await createFormation(school);
    const res = await request(app)
      .post(`/api/formations/${formation.id}/stats`)
      .send({ year: CURRENT_YEAR - 1, nbVoeux: 10, nbPropositions: 5, nbAdmis: 2 });
    expect(res.status).toBe(401);
  });
});
