// Ce fichier couvre spécifiquement l'exigence jury "Gestion des erreurs lors de
// la création d'un compte" : champs obligatoires, email déjà utilisé, mot de
// passe invalide, numéro INE invalide — chaque cas testé individuellement,
// avec vérification du message renvoyé (pas seulement du code HTTP).
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

const basePayload = () => ({
  email: 'candidat@test.fr',
  password: 'MotDePasse1',
  firstName: 'Camille',
  lastName: 'Durand',
  ine: nextIne(),
});

describe('Champs obligatoires à la création de compte', () => {
  const requiredFields = ['email', 'password', 'firstName', 'lastName', 'ine'];

  it.each(requiredFields)('refuse la création si le champ "%s" est manquant', async (field) => {
    const payload = basePayload();
    delete payload[field];
    const res = await request(app).post('/api/auth/register').send(payload);
    expect(res.status).toBe(400);
    expect(res.body.errors.some((e) => e.field === field)).toBe(true);
  });

  it.each(requiredFields)('refuse la création si le champ "%s" est une chaîne vide', async (field) => {
    const payload = { ...basePayload(), [field]: '' };
    const res = await request(app).post('/api/auth/register').send(payload);
    expect(res.status).toBe(400);
    expect(res.body.errors.some((e) => e.field === field)).toBe(true);
  });
});

describe('Vérification de l\'email déjà utilisé', () => {
  it('refuse un email déjà utilisé, avec un message explicite', async () => {
    await createStudent({ email: 'deja.pris@test.fr' });
    const res = await request(app).post('/api/auth/register').send({ ...basePayload(), email: 'deja.pris@test.fr' });
    expect(res.status).toBe(409);
    expect(res.body.errors[0]).toEqual({
      field: 'email',
      message: 'Cette adresse email est déjà utilisée par un compte existant.',
    });
  });

  it('détecte un doublon d\'email insensible à la casse', async () => {
    await createStudent({ email: 'candidat@test.fr' });
    const res = await request(app).post('/api/auth/register').send({ ...basePayload(), email: 'CANDIDAT@TEST.FR' });
    expect(res.status).toBe(409);
    expect(res.body.errors[0].field).toBe('email');
  });

  it('refuse un format d\'email invalide', async () => {
    const res = await request(app).post('/api/auth/register').send({ ...basePayload(), email: 'pas-un-email' });
    expect(res.status).toBe(400);
    expect(res.body.errors.some((e) => e.field === 'email')).toBe(true);
  });
});

describe('Vérification du mot de passe', () => {
  it('refuse un mot de passe trop court', async () => {
    const res = await request(app).post('/api/auth/register').send({ ...basePayload(), password: 'Ab1' });
    expect(res.status).toBe(400);
    expect(res.body.errors.some((e) => e.field === 'password')).toBe(true);
  });

  it('refuse un mot de passe sans chiffre', async () => {
    const res = await request(app).post('/api/auth/register').send({ ...basePayload(), password: 'MotDePasseSansChiffre' });
    expect(res.status).toBe(400);
    expect(res.body.errors.some((e) => e.field === 'password')).toBe(true);
  });

  it('refuse un mot de passe sans lettre', async () => {
    const res = await request(app).post('/api/auth/register').send({ ...basePayload(), password: '12345678' });
    expect(res.status).toBe(400);
    expect(res.body.errors.some((e) => e.field === 'password')).toBe(true);
  });

  it('accepte un mot de passe conforme (8+ caractères, lettre + chiffre)', async () => {
    const res = await request(app).post('/api/auth/register').send({ ...basePayload(), password: 'MotDePasse1' });
    expect(res.status).toBe(201);
  });
});

describe('Vérification du numéro INE', () => {
  it('refuse un INE manquant', async () => {
    const payload = basePayload();
    delete payload.ine;
    const res = await request(app).post('/api/auth/register').send(payload);
    expect(res.status).toBe(400);
    expect(res.body.errors.some((e) => e.field === 'ine')).toBe(true);
  });

  it('refuse un INE au mauvais format avec un message explicite', async () => {
    const res = await request(app).post('/api/auth/register').send({ ...basePayload(), ine: '12345' });
    expect(res.status).toBe(400);
    const ineError = res.body.errors.find((e) => e.field === 'ine');
    expect(ineError).toBeDefined();
    expect(ineError.message).toMatch(/11 caractères/);
  });

  it('refuse un INE déjà associé à un autre compte étudiant', async () => {
    const { user } = await createStudent();
    const res = await request(app).post('/api/auth/register').send({ ...basePayload(), ine: user.ine });
    expect(res.status).toBe(409);
    expect(res.body.errors[0]).toEqual({
      field: 'ine',
      message: 'Ce numéro INE est déjà associé à un autre compte.',
    });
  });
});

describe('Création réussie : pas de fuite de données sensibles', () => {
  it('ne retourne jamais le hash du mot de passe', async () => {
    const res = await request(app).post('/api/auth/register').send(basePayload());
    expect(res.status).toBe(201);
    expect(res.body.user.passwordHash).toBeUndefined();
    expect(Object.keys(res.body.user)).not.toContain('passwordHash');
  });
});
