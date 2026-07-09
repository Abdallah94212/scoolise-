const AppError = require('../utils/AppError');

// Valide req.body (ou req.query) contre un schéma Zod et transforme les
// erreurs en un format homogène {field, message} exploitable directement
// par le frontend pour afficher des messages clairs par champ.
function validate(schema, source = 'body') {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join('.') || source,
        message: issue.message,
      }));
      return next(AppError.badRequest('Données invalides.', errors));
    }
    req[source] = result.data;
    next();
  };
}

module.exports = validate;
