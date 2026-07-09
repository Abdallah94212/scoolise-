const { z } = require('zod');
const { PASSWORD_POLICY_REGEX } = require('../../utils/password');
const { INE_REGEX } = require('../../utils/ine');

const registerSchema = z.object({
  email: z.string({ required_error: "L'email est obligatoire." }).email("Le format de l'email est invalide."),
  password: z
    .string({ required_error: 'Le mot de passe est obligatoire.' })
    .regex(
      PASSWORD_POLICY_REGEX,
      'Le mot de passe doit contenir au moins 8 caractères, dont une lettre et un chiffre.'
    ),
  firstName: z.string({ required_error: 'Le prénom est obligatoire.' }).trim().min(1, 'Le prénom est obligatoire.'),
  lastName: z.string({ required_error: 'Le nom est obligatoire.' }).trim().min(1, 'Le nom est obligatoire.'),
  ine: z
    .string({ required_error: 'Le numéro INE est obligatoire.' })
    .trim()
    .toUpperCase()
    .regex(INE_REGEX, "Le numéro INE doit contenir 11 caractères (9 chiffres, puis un caractère alphanumérique, puis une lettre)."),
});

const loginSchema = z.object({
  email: z.string({ required_error: "L'email est obligatoire." }).email("Le format de l'email est invalide."),
  password: z.string({ required_error: 'Le mot de passe est obligatoire.' }).min(1, 'Le mot de passe est obligatoire.'),
});

module.exports = { registerSchema, loginSchema };
