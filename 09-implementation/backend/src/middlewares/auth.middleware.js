const AppError = require('../utils/AppError');
const { verifyToken } = require('../utils/jwt');
const prisma = require('../utils/prisma');

async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');
    if (scheme !== 'Bearer' || !token) {
      throw AppError.unauthorized('Jeton d\'authentification manquant.');
    }

    let payload;
    try {
      payload = verifyToken(token);
    } catch {
      throw AppError.unauthorized('Jeton d\'authentification invalide ou expiré.');
    }

    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) {
      throw AppError.unauthorized('Utilisateur introuvable.');
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(AppError.unauthorized());
    }
    if (!roles.includes(req.user.role)) {
      return next(AppError.forbidden('Cette action est réservée à : ' + roles.join(', ')));
    }
    next();
  };
}

module.exports = { requireAuth, requireRole };
