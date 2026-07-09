const { Router } = require('express');
const controller = require('./wishes.controller');
const { createWishSchema, updateWishSchema } = require('./wishes.schema');
const validate = require('../../middlewares/validate.middleware');
const { requireAuth, requireRole } = require('../../middlewares/auth.middleware');

const router = Router();

// Toutes les routes de ce module sont réservées à l'étudiant connecté, sur
// ses propres vœux (la vue tous-étudiants pour l'administrateur est exposée
// séparément sous /api/admin/wishes — voir admin.routes.js).
router.use(requireAuth, requireRole('STUDENT'));

/**
 * @openapi
 * /wishes/me:
 *   get:
 *     tags: [Vœux]
 *     summary: Lister mes vœux (étudiant connecté)
 *     responses:
 *       200: { description: Liste des vœux de l'étudiant, triée par rang }
 *       403: { description: Réservé aux étudiants }
 */
router.get('/me', controller.listMine);

/**
 * @openapi
 * /wishes:
 *   post:
 *     tags: [Vœux]
 *     summary: Faire un vœu pour une formation (10 maximum, pas de doublon)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [formationId]
 *             properties:
 *               formationId: { type: string }
 *     responses:
 *       201: { description: Vœu créé }
 *       409: { description: Vœu déjà existant pour cette formation }
 */
router.post('/', validate(createWishSchema), controller.create);

/**
 * @openapi
 * /wishes/{id}:
 *   put:
 *     tags: [Vœux]
 *     summary: Modifier le rang d'un de mes vœux
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
 *             required: [rank]
 *             properties:
 *               rank: { type: integer, minimum: 1, maximum: 10 }
 *     responses:
 *       200: { description: Vœu modifié }
 *       404: { description: Vœu introuvable }
 */
router.put('/:id', validate(updateWishSchema), controller.updateRank);

/**
 * @openapi
 * /wishes/{id}:
 *   delete:
 *     tags: [Vœux]
 *     summary: Retirer un de mes vœux
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204: { description: Vœu supprimé }
 *       404: { description: Vœu introuvable }
 */
router.delete('/:id', controller.remove);

module.exports = router;
