const { Router } = require('express');
const controller = require('./auth.controller');
const { registerSchema, loginSchema } = require('./auth.schema');
const validate = require('../../middlewares/validate.middleware');
const { requireAuth } = require('../../middlewares/auth.middleware');

const router = Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Inscription d'un étudiant (email, mot de passe, numéro INE)
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, firstName, lastName, ine]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string }
 *               firstName: { type: string }
 *               lastName: { type: string }
 *               ine: { type: string, example: "123456789AB" }
 *     responses:
 *       201: { description: Compte créé, token JWT retourné }
 *       400: { description: Données invalides }
 *       409: { description: Email ou INE déjà utilisé }
 */
router.post('/register', validate(registerSchema), controller.register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Connexion (email + mot de passe)
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string }
 *     responses:
 *       200: { description: Connexion réussie, token JWT retourné }
 *       401: { description: Email ou mot de passe incorrect }
 */
router.post('/login', validate(loginSchema), controller.login);

/**
 * @openapi
 * /auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Profil de l'utilisateur connecté
 *     responses:
 *       200: { description: Profil utilisateur }
 *       401: { description: Non authentifié }
 */
router.get('/me', requireAuth, controller.me);

module.exports = router;
