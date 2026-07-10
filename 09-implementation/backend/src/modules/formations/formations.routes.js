const { Router } = require('express');
const controller = require('./formations.controller');
const { createFormationSchema, updateFormationSchema, listFormationsQuerySchema } = require('./formations.schema');
const statsController = require('../stats/stats.controller');
const { upsertStatSchema } = require('../stats/stats.schema');
const validate = require('../../middlewares/validate.middleware');
const { requireAuth, requireRole } = require('../../middlewares/auth.middleware');

const router = Router();

/**
 * @openapi
 * /formations:
 *   get:
 *     tags: [Formations]
 *     summary: Rechercher / filtrer les formations
 *     security: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *       - in: query
 *         name: type
 *         schema: { type: string }
 *       - in: query
 *         name: domain
 *         schema: { type: string }
 *       - in: query
 *         name: schoolId
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: pageSize
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200: { description: Liste paginée des formations }
 */
router.get('/', validate(listFormationsQuerySchema, 'query'), controller.list);

/**
 * @openapi
 * /formations/{id}:
 *   get:
 *     tags: [Formations]
 *     summary: Détail d'une formation
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Formation }
 *       404: { description: Introuvable }
 */
router.get('/:id', controller.getById);

/**
 * @openapi
 * /formations/{id}/stats:
 *   get:
 *     tags: [Statistiques]
 *     summary: Taux d'accès des 5 dernières années pour une formation
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Liste des statistiques annuelles (triées par année) }
 *       404: { description: Formation introuvable }
 */
router.get('/:id/stats', statsController.listByFormation);

/**
 * @openapi
 * /formations/{id}/stats:
 *   post:
 *     tags: [Statistiques]
 *     summary: Créer ou mettre à jour les statistiques d'une année (administrateur ou personnel de l'établissement) — le taux d'accès est calculé automatiquement
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [year, nbVoeux, nbPropositions, nbAdmis]
 *             properties:
 *               year: { type: integer }
 *               nbVoeux: { type: integer }
 *               nbPropositions: { type: integer }
 *               nbAdmis: { type: integer }
 *     responses:
 *       201: { description: Statistique créée ou mise à jour, taux d'accès recalculé }
 *       403: { description: Réservé aux administrateurs }
 *       404: { description: Formation introuvable }
 */
router.post('/:id/stats', requireAuth, requireRole('ADMIN', 'SCHOOL_STAFF'), validate(upsertStatSchema), statsController.upsert);

/**
 * @openapi
 * /formations:
 *   post:
 *     tags: [Formations]
 *     summary: Créer une formation (administrateur ou personnel de l'établissement)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, type, domain, schoolId]
 *             properties:
 *               name: { type: string }
 *               type: { type: string }
 *               domain: { type: string }
 *               description: { type: string }
 *               capacity: { type: integer }
 *               schoolId: { type: string }
 *     responses:
 *       201: { description: Formation créée }
 *       403: { description: Réservé aux administrateurs }
 */
router.post('/', requireAuth, requireRole('ADMIN', 'SCHOOL_STAFF'), validate(createFormationSchema), controller.create);

/**
 * @openapi
 * /formations/{id}:
 *   put:
 *     tags: [Formations]
 *     summary: Modifier une formation (administrateur ou personnel de l'établissement)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Formation modifiée }
 *       403: { description: Réservé aux administrateurs }
 *       404: { description: Introuvable }
 */
router.put('/:id', requireAuth, requireRole('ADMIN', 'SCHOOL_STAFF'), validate(updateFormationSchema), controller.update);

/**
 * @openapi
 * /formations/{id}:
 *   delete:
 *     tags: [Formations]
 *     summary: Supprimer une formation (administrateur ou personnel de l'établissement)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204: { description: Formation supprimée }
 *       403: { description: Réservé aux administrateurs }
 *       404: { description: Introuvable }
 */
router.delete('/:id', requireAuth, requireRole('ADMIN', 'SCHOOL_STAFF'), controller.remove);

module.exports = router;
