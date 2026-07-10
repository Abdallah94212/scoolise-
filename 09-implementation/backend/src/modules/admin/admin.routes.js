const { Router } = require('express');
const controller = require('./admin.controller');
const wishesController = require('../wishes/wishes.controller');
const { listUsersQuerySchema, updateUserSchema, listWishesQuerySchema } = require('./admin.schema');
const validate = require('../../middlewares/validate.middleware');
const { requireAuth, requireRole } = require('../../middlewares/auth.middleware');

const router = Router();

// Tout ce module est réservé aux administrateurs.
router.use(requireAuth, requireRole('ADMIN'));

/**
 * @openapi
 * /admin/dashboard:
 *   get:
 *     tags: [Administration]
 *     summary: Statistiques agrégées pour le tableau de bord administrateur
 *     responses:
 *       200: { description: Compteurs globaux (étudiants, admins, écoles, formations, vœux) }
 *       403: { description: Réservé aux administrateurs }
 */
router.get('/dashboard', controller.dashboard);

/**
 * @openapi
 * /admin/users:
 *   get:
 *     tags: [Administration]
 *     summary: Lister / rechercher les utilisateurs
 *     parameters:
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *       - in: query
 *         name: role
 *         schema: { type: string, enum: [STUDENT, ADMIN, SCHOOL_STAFF] }
 *     responses:
 *       200: { description: Liste paginée des utilisateurs }
 */
router.get('/users', validate(listUsersQuerySchema, 'query'), controller.listUsers);

/**
 * @openapi
 * /admin/users/{id}:
 *   put:
 *     tags: [Administration]
 *     summary: Modifier un utilisateur (rôle, nom, email)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Utilisateur modifié }
 *       404: { description: Introuvable }
 */
router.put('/users/:id', validate(updateUserSchema), controller.updateUser);

/**
 * @openapi
 * /admin/users/{id}:
 *   delete:
 *     tags: [Administration]
 *     summary: Supprimer un utilisateur
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204: { description: Utilisateur supprimé }
 *       400: { description: Suppression de son propre compte refusée }
 *       404: { description: Introuvable }
 */
router.delete('/users/:id', controller.deleteUser);

/**
 * @openapi
 * /admin/wishes:
 *   get:
 *     tags: [Administration]
 *     summary: Consulter toutes les candidatures (vœux) tous étudiants confondus
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [EN_ATTENTE, ACCEPTE, REFUSE, LISTE_ATTENTE] }
 *       - in: query
 *         name: formationId
 *         schema: { type: string }
 *     responses:
 *       200: { description: Liste paginée des candidatures }
 */
router.get('/wishes', validate(listWishesQuerySchema, 'query'), wishesController.listAllForAdmin);

module.exports = router;
