const { Prisma } = require('@prisma/client');
const AppError = require('../utils/AppError');

// Traduit une violation de contrainte unique Prisma (P2002) en message
// compréhensible côté frontend, selon le(s) champ(s) en conflit.
function mapPrismaUniqueError(err) {
  const target = Array.isArray(err.meta?.target) ? err.meta.target : [err.meta?.target].filter(Boolean);
  const fieldMessages = {
    email: 'Cette adresse email est déjà utilisée par un compte existant.',
    ine: 'Ce numéro INE est déjà associé à un autre compte.',
  };
  const errors = target.map((field) => ({
    field,
    message: fieldMessages[field] || `La valeur du champ "${field}" est déjà utilisée.`,
  }));
  const message = errors[0]?.message || 'Cette ressource existe déjà.';
  return AppError.conflict(message, errors);
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  let appError = err;

  if (!err.isAppError) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      appError = mapPrismaUniqueError(err);
    } else if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      appError = AppError.notFound('Ressource introuvable.');
    } else {
      console.error(err);
      appError = new AppError(500, 'Erreur interne du serveur.');
    }
  }

  res.status(appError.statusCode || 500).json({
    status: appError.statusCode || 500,
    message: appError.message,
    errors: appError.errors || [],
  });
}

function notFoundHandler(req, res) {
  res.status(404).json({ status: 404, message: `Route ${req.method} ${req.originalUrl} introuvable.`, errors: [] });
}

module.exports = { errorHandler, notFoundHandler };
