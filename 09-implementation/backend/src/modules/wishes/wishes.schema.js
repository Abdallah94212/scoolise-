const { z } = require('zod');

const createWishSchema = z.object({
  formationId: z.string({ required_error: 'La formation est obligatoire.' }).uuid('Identifiant de formation invalide.'),
});

const updateWishSchema = z.object({
  rank: z.coerce.number().int().min(1, 'Le rang doit être compris entre 1 et 10.').max(10, 'Le rang doit être compris entre 1 et 10.'),
});

module.exports = { createWishSchema, updateWishSchema };
