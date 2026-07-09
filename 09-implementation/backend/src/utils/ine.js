// Validation du format du numéro INE (Identifiant National Élève/Étudiant),
// utilisé notamment lors de l'inscription sur Parcoursup.
//
// Format documenté : 11 caractères — 9 chiffres, suivis d'un caractère
// alphanumérique, suivis d'une lettre majuscule (clé de contrôle).
// Limite assumée : il s'agit d'une validation de FORMAT uniquement.
// Il n'existe pas de registre INE public consultable par API : ce backend
// ne peut donc pas vérifier qu'un INE correspond réellement à un élève
// existant, seulement qu'il respecte la structure attendue et qu'il n'est
// pas déjà utilisé par un autre compte de cette application.
const INE_REGEX = /^[0-9]{9}[0-9A-Z][A-Z]$/;

function isIneFormatValid(ine) {
  return typeof ine === 'string' && INE_REGEX.test(ine.toUpperCase());
}

function normalizeIne(ine) {
  return typeof ine === 'string' ? ine.toUpperCase().trim() : ine;
}

module.exports = { isIneFormatValid, normalizeIne, INE_REGEX };
