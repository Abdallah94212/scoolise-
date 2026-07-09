const { z } = require('zod');
const { paginationQuerySchema } = require('../../utils/pagination');

const createFormationSchema = z.object({
  name: z.string({ required_error: 'Le nom de la formation est obligatoire.' }).trim().min(1, 'Le nom de la formation est obligatoire.'),
  type: z.string({ required_error: 'Le type de formation est obligatoire.' }).trim().min(1, 'Le type de formation est obligatoire.'),
  domain: z.string({ required_error: 'Le domaine est obligatoire.' }).trim().min(1, 'Le domaine est obligatoire.'),
  description: z.string().trim().optional().nullable(),
  capacity: z.coerce.number().int().min(0, 'La capacité doit être positive ou nulle.').default(0),
  schoolId: z.string({ required_error: "L'établissement est obligatoire." }).uuid("Identifiant d'établissement invalide."),
});

const updateFormationSchema = createFormationSchema.partial();

const listFormationsQuerySchema = paginationQuerySchema.extend({
  q: z.string().trim().optional(),
  type: z.string().trim().optional(),
  domain: z.string().trim().optional(),
  schoolId: z.string().uuid().optional(),
});

module.exports = { createFormationSchema, updateFormationSchema, listFormationsQuerySchema };
