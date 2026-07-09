const { z } = require('zod');
const { paginationQuerySchema } = require('../../utils/pagination');

const createSchoolSchema = z.object({
  name: z.string({ required_error: 'Le nom de l\'établissement est obligatoire.' }).trim().min(1, 'Le nom de l\'établissement est obligatoire.'),
  city: z.string({ required_error: 'La ville est obligatoire.' }).trim().min(1, 'La ville est obligatoire.'),
  type: z.string({ required_error: 'Le type d\'établissement est obligatoire.' }).trim().min(1, "Le type d'établissement est obligatoire."),
  description: z.string().trim().optional().nullable(),
  website: z.string().trim().url("L'URL du site web est invalide.").optional().nullable().or(z.literal('')),
});

const updateSchoolSchema = createSchoolSchema.partial();

const listSchoolsQuerySchema = paginationQuerySchema.extend({
  q: z.string().trim().optional(),
  type: z.string().trim().optional(),
  city: z.string().trim().optional(),
});

module.exports = { createSchoolSchema, updateSchoolSchema, listSchoolsQuerySchema };
