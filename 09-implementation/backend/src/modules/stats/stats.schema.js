const { z } = require('zod');

const currentYear = new Date().getFullYear();

const upsertStatSchema = z.object({
  year: z.coerce
    .number()
    .int()
    .min(currentYear - 10, "L'année est trop ancienne.")
    .max(currentYear, "L'année ne peut pas être dans le futur."),
  nbVoeux: z.coerce.number().int().min(0, 'Le nombre de vœux doit être positif ou nul.'),
  nbPropositions: z.coerce.number().int().min(0, 'Le nombre de propositions doit être positif ou nul.'),
  nbAdmis: z.coerce.number().int().min(0, "Le nombre d'admis doit être positif ou nul."),
});

module.exports = { upsertStatSchema };
