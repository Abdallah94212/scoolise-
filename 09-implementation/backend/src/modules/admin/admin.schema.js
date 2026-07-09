const { z } = require('zod');
const { paginationQuerySchema } = require('../../utils/pagination');

const listUsersQuerySchema = paginationQuerySchema.extend({
  q: z.string().trim().optional(),
  role: z.enum(['STUDENT', 'ADMIN']).optional(),
});

const updateUserSchema = z.object({
  firstName: z.string().trim().min(1).optional(),
  lastName: z.string().trim().min(1).optional(),
  email: z.string().email("Le format de l'email est invalide.").optional(),
  role: z.enum(['STUDENT', 'ADMIN']).optional(),
});

const listWishesQuerySchema = paginationQuerySchema.extend({
  status: z.enum(['EN_ATTENTE', 'ACCEPTE', 'REFUSE', 'LISTE_ATTENTE']).optional(),
  formationId: z.string().uuid().optional(),
  studentId: z.string().uuid().optional(),
});

module.exports = { listUsersQuerySchema, updateUserSchema, listWishesQuerySchema };
