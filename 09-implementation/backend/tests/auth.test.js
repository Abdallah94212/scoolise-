const request = require('supertest');
const app = require('../src/app');
const { resetDb, disconnectDb } = require('./helpers/db');
const { createStudent, nextIne } = require('./helpers/auth');

beforeEach(async () => {
  await resetDb();
});

afterAll(async () => {
  await disconnectDb();
});

describe('POST /api/auth/register', () => {
  const validPayload = () => ({
    email: 'nouvel.etudiant@test.fr',
    password: 'MotDePasse1',
    firstName: 'Nouvel',
    lastName: 'Étudiant',
    ine: nextIne(),
  });

  it('crée un compte étudiant avec un INE valide et retourne un token', async () => {
    const res = await request(app).post('/api/auth/register').send(validPayload());
    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('nouvel.etudiant@test.fr');
    expect(res.body.user.role).toBe('STUDENT');
    expect(res.body.user.passwordHash).toBeUndefined();
  });

  it('refuse un email déjà utilisé', async () => {
    await createStudent({ email: 'existant@test.fr' });
    const res = await request(app).post('/api/auth/register').send({ ...validPayload(), email: 'existant@test.fr' });
    expect(res.status).toBe(409);
    expect(res.body.errors[0].field).toBe('email');
  });

  it('refuse un numéro INE déjà associé à un autre compte', async () => {
    const { user } = await createStudent();
    const res = await request(app).post('/api/auth/register').send({ ...validPayload(), ine: user.ine });
    expect(res.status).toBe(409);
    expect(res.body.errors[0].field).toBe('ine');
  });

  it('refuse un numéro INE au mauvais format', async () => {
    const res = await request(app).post('/api/auth/register').send({ ...validPayload(), ine: 'PAS-UN-INE' });
    expect(res.status).toBe(400);
    expect(res.body.errors.some((e) => e.field === 'ine')).toBe(true);
  });

  it('refuse un mot de passe trop faible', async () => {
    const res = await request(app).post('/api/auth/register').send({ ...validPayload(), password: 'abc' });
    expect(res.status).toBe(400);
    expect(res.body.errors.some((e) => e.field === 'password')).toBe(true);
  });

  it('refuse une inscription sans champs obligatoires', async () => {
    const res = await request(app).post('/api/auth/register').send({ email: 'incomplet@test.fr' });
    expect(res.status).toBe(400);
    const fields = res.body.errors.map((e) => e.field);
    expect(fields).toEqual(expect.arrayContaining(['password', 'firstName', 'lastName', 'ine']));
  });
});

describe('POST /api/auth/login', () => {
  it('connecte un utilisateur avec les bons identifiants', async () => {
    const { user, password } = await createStudent({ email: 'lea@test.fr', password: 'MotDePasse1' });
    const res = await request(app).post('/api/auth/login').send({ email: user.email, password });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('refuse un mauvais mot de passe', async () => {
    const { user } = await createStudent({ email: 'lea2@test.fr', password: 'MotDePasse1' });
    const res = await request(app).post('/api/auth/login').send({ email: user.email, password: 'Mauvais1234' });
    expect(res.status).toBe(401);
  });

  it('refuse un email inconnu', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'inconnu@test.fr', password: 'MotDePasse1' });
    expect(res.status).toBe(401);
  });
});

describe('GET /api/auth/me', () => {
  it('refuse une requête sans token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('retourne le profil pour un token valide', async () => {
    const { user, token } = await createStudent({ email: 'me@test.fr' });
    const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(user.email);
  });
});
