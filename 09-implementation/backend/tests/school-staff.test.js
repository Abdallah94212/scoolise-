// Couvre le rôle SCHOOL_STAFF (personnel d'établissement, ex. "Camille Dupas"
// pour Prepare) : peut gérer les formations/statistiques/infos de son PROPRE
// établissement uniquement, jamais celles d'un autre établissement.
const request = require('supertest');
const app = require('../src/app');
const { resetDb, disconnectDb } = require('./helpers/db');
const { createAdmin, createSchoolStaff, createStudent } = require('./helpers/auth');
const { createSchool, createFormation } = require('./helpers/fixtures');

const CURRENT_YEAR = new Date().getFullYear();

beforeEach(async () => {
  await resetDb();
});

afterAll(async () => {
  await disconnectDb();
});

describe('Formations — SCHOOL_STAFF scopé à son établissement', () => {
  it('peut créer une formation pour son propre établissement', async () => {
    const school = await createSchool({ name: 'IUT de Bordeaux' });
    const { token } = await createSchoolStaff(school.id);

    const res = await request(app)
      .post('/api/formations')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'BUT Informatique', type: 'BUT', domain: 'Sciences', schoolId: school.id, capacity: 30 });

    expect(res.status).toBe(201);
    expect(res.body.school.id).toBe(school.id);
  });

  it("refuse de créer une formation pour un autre établissement", async () => {
    const ownSchool = await createSchool({ name: 'IUT de Bordeaux' });
    const otherSchool = await createSchool({ name: 'Université Lyon 2' });
    const { token } = await createSchoolStaff(ownSchool.id);

    const res = await request(app)
      .post('/api/formations')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Licence Psychologie', type: 'Licence', domain: 'Sciences humaines', schoolId: otherSchool.id });

    expect(res.status).toBe(403);
  });

  it('peut modifier une formation de son établissement', async () => {
    const school = await createSchool();
    const { token } = await createSchoolStaff(school.id);
    const formation = await createFormation(school, { name: 'Ancien nom' });

    const res = await request(app)
      .put(`/api/formations/${formation.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Nouveau nom' });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Nouveau nom');
  });

  it("refuse de modifier une formation d'un autre établissement", async () => {
    const ownSchool = await createSchool({ name: 'IUT de Bordeaux' });
    const otherSchool = await createSchool({ name: 'Université Lyon 2' });
    const { token } = await createSchoolStaff(ownSchool.id);
    const formation = await createFormation(otherSchool, { name: 'Licence Psychologie' });

    const res = await request(app)
      .put(`/api/formations/${formation.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Tentative de modification' });

    expect(res.status).toBe(403);
  });

  it("refuse de supprimer une formation d'un autre établissement", async () => {
    const ownSchool = await createSchool({ name: 'IUT de Bordeaux' });
    const otherSchool = await createSchool({ name: 'Université Lyon 2' });
    const { token } = await createSchoolStaff(ownSchool.id);
    const formation = await createFormation(otherSchool);

    const res = await request(app).delete(`/api/formations/${formation.id}`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(403);
  });

  it('peut supprimer une formation de son propre établissement', async () => {
    const school = await createSchool();
    const { token } = await createSchoolStaff(school.id);
    const formation = await createFormation(school);

    const res = await request(app).delete(`/api/formations/${formation.id}`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(204);
  });
});

describe('Écoles — SCHOOL_STAFF scopé à son établissement', () => {
  it('peut modifier son propre établissement', async () => {
    const school = await createSchool({ name: 'IUT de Bordeaux' });
    const { token } = await createSchoolStaff(school.id);

    const res = await request(app)
      .put(`/api/schools/${school.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ description: 'Nouvelle description' });

    expect(res.status).toBe(200);
    expect(res.body.description).toBe('Nouvelle description');
  });

  it("refuse de modifier un autre établissement", async () => {
    const ownSchool = await createSchool({ name: 'IUT de Bordeaux' });
    const otherSchool = await createSchool({ name: 'Université Lyon 2' });
    const { token } = await createSchoolStaff(ownSchool.id);

    const res = await request(app)
      .put(`/api/schools/${otherSchool.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ description: 'Tentative' });

    expect(res.status).toBe(403);
  });

  it('refuse de créer un nouvel établissement (réservé admin)', async () => {
    const school = await createSchool();
    const { token } = await createSchoolStaff(school.id);

    const res = await request(app)
      .post('/api/schools')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Nouvelle école', city: 'Paris', type: 'IUT' });

    expect(res.status).toBe(403);
  });

  it('refuse de supprimer un établissement (réservé admin)', async () => {
    const school = await createSchool();
    const { token } = await createSchoolStaff(school.id);

    const res = await request(app).delete(`/api/schools/${school.id}`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(403);
  });
});

describe('Statistiques — SCHOOL_STAFF scopé à son établissement', () => {
  it('peut saisir les statistiques de sa propre formation', async () => {
    const school = await createSchool();
    const { token } = await createSchoolStaff(school.id);
    const formation = await createFormation(school);

    const res = await request(app)
      .post(`/api/formations/${formation.id}/stats`)
      .set('Authorization', `Bearer ${token}`)
      .send({ year: CURRENT_YEAR - 1, nbVoeux: 100, nbPropositions: 40, nbAdmis: 20 });

    expect(res.status).toBe(201);
    expect(res.body.tauxAcces).toBe(20);
  });

  it("refuse de saisir les statistiques d'une formation d'un autre établissement", async () => {
    const ownSchool = await createSchool({ name: 'IUT de Bordeaux' });
    const otherSchool = await createSchool({ name: 'Université Lyon 2' });
    const { token } = await createSchoolStaff(ownSchool.id);
    const formation = await createFormation(otherSchool);

    const res = await request(app)
      .post(`/api/formations/${formation.id}/stats`)
      .set('Authorization', `Bearer ${token}`)
      .send({ year: CURRENT_YEAR - 1, nbVoeux: 100, nbPropositions: 40, nbAdmis: 20 });

    expect(res.status).toBe(403);
  });
});

describe('Administration — assignation du rôle SCHOOL_STAFF', () => {
  it('permet à un admin de nommer un utilisateur personnel d\'un établissement', async () => {
    const { token: adminToken } = await createAdmin();
    const school = await createSchool({ name: 'IUT de Bordeaux' });
    const { user } = await createStudent();

    const res = await request(app)
      .put(`/api/admin/users/${user.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ role: 'SCHOOL_STAFF', schoolId: school.id });

    expect(res.status).toBe(200);
    expect(res.body.role).toBe('SCHOOL_STAFF');
    expect(res.body.school.id).toBe(school.id);
  });

  it("refuse d'assigner SCHOOL_STAFF sans établissement", async () => {
    const { token: adminToken } = await createAdmin();
    const { user } = await createStudent();

    const res = await request(app)
      .put(`/api/admin/users/${user.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ role: 'SCHOOL_STAFF' });

    expect(res.status).toBe(400);
    expect(res.body.errors[0].field).toBe('schoolId');
  });

  it('refuse un établissement inexistant', async () => {
    const { token: adminToken } = await createAdmin();
    const { user } = await createStudent();

    const res = await request(app)
      .put(`/api/admin/users/${user.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ role: 'SCHOOL_STAFF', schoolId: '00000000-0000-0000-0000-000000000000' });

    expect(res.status).toBe(400);
  });

  it('retire le rattachement établissement en repassant en STUDENT', async () => {
    const { token: adminToken } = await createAdmin();
    const school = await createSchool();
    const { user } = await createSchoolStaff(school.id);

    const res = await request(app)
      .put(`/api/admin/users/${user.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ role: 'STUDENT' });

    expect(res.status).toBe(200);
    expect(res.body.role).toBe('STUDENT');
    expect(res.body.schoolId).toBeNull();
  });
});
