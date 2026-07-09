const { Router } = require('express');
const controller = require('./schools.controller');
const { createSchoolSchema, updateSchoolSchema, listSchoolsQuerySchema } = require('./schools.schema');
const { listFormationsQuerySchema } = require('../formations/formations.schema');
const validate = require('../../middlewares/validate.middleware');
const { requireAuth, requireRole } = require('../../middlewares/auth.middleware');

const router = Router();

/**
 * @openapi
 * /schools:
 *   get:
 *     tags: [Écoles]
 *     summary: Rechercher / filtrer les établissements
 *     security: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *         description: Recherche sur le nom de l'établissement
 *       - in: query
 *         name: type
 *         schema: { type: string }
 *       - in: query
 *         name: city
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: pageSize
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200: { description: Liste paginée des établissements }
 */
router.get('/', validate(listSchoolsQuerySchema, 'query'), controller.list);

/**
 * @openapi
 * /schools/{id}:
 *   get:
 *     tags: [Écoles]
 *     summary: Détail d'un établissement
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Établissement }
 *       404: { description: Introuvable }
 */
router.get('/:id', controller.getById);

/**
 * @openapi
 * /schools/{id}/formations:
 *   get:
 *     tags: [Écoles]
 *     summary: Formations proposées par un établissement
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Liste paginée des formations de l'établissement }
 */
router.get('/:id/formations', validate(listFormationsQuerySchema, 'query'), controller.listFormations);

/**
 * @openapi
 * /schools:
 *   post:
 *     tags: [Écoles]
 *     summary: Créer un établissement (administrateur)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, city, type]
 *             properties:
 *               name: { type: string }
 *               city: { type: string }
 *               type: { type: string }
 *               description: { type: string }
 *               website: { type: string }
 *     responses:
 *       201: { description: Établissement créé }
 *       403: { description: Réservé aux administrateurs }
 */
router.post('/', requireAuth, requireRole('ADMIN'), validate(createSchoolSchema), controller.create);

/**
 * @openapi
 * /schools/{id}:
 *   put:
 *     tags: [Écoles]
 *     summary: Modifier un établissement (administrateur)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Établissement modifié }
 *       403: { description: Réservé aux administrateurs }
 *       404: { description: Introuvable }
 */
router.put('/:id', requireAuth, requireRole('ADMIN'), validate(updateSchoolSchema), controller.update);

/**
 * @openapi
 * /schools/{id}:
 *   delete:
 *     tags: [Écoles]
 *     summary: Supprimer un établissement (administrateur)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204: { description: Établissement supprimé }
 *       403: { description: Réservé aux administrateurs }
 *       404: { description: Introuvable }
 */
router.delete('/:id', requireAuth, requireRole('ADMIN'), controller.remove);

module.exports = router;
