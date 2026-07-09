class AppError extends Error {
  constructor(statusCode, message, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isAppError = true;
  }

  static badRequest(message, errors = []) {
    return new AppError(400, message, errors);
  }

  static unauthorized(message = 'Authentification requise.') {
    return new AppError(401, message);
  }

  static forbidden(message = "Vous n'avez pas les droits nécessaires.") {
    return new AppError(403, message);
  }

  static notFound(message = 'Ressource introuvable.') {
    return new AppError(404, message);
  }

  static conflict(message, errors = []) {
    return new AppError(409, message, errors);
  }
}

module.exports = AppError;
