const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

// Politique de mot de passe volontairement simple mais réellement appliquée :
// au moins 8 caractères, au moins une lettre et un chiffre.
const PASSWORD_POLICY_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

function isPasswordValid(password) {
  return typeof password === 'string' && PASSWORD_POLICY_REGEX.test(password);
}

function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

module.exports = { isPasswordValid, hashPassword, comparePassword, PASSWORD_POLICY_REGEX };
