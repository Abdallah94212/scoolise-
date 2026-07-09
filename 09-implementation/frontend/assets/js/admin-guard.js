// Protège les pages admin/*.html : redirige vers la connexion si l'utilisateur
// n'est pas authentifié, ou vers l'accueil s'il est authentifié mais non admin.
(function () {
  function debugLog(msg) {
    try {
      const time = new Date().toLocaleTimeString('fr-FR');
      const prev = sessionStorage.getItem('scoolize_debug_last') || '';
      sessionStorage.setItem('scoolize_debug_last', `${prev}\n[${time}] [admin-guard] ${msg}`);
    } catch (e) {}
  }

  if (!window.ScoolizeAPI) {
    debugLog("window.ScoolizeAPI est introuvable sur cette page (api.js n'a pas été chargé) — impossible de vérifier la session.");
    return;
  }

  const { auth } = window.ScoolizeAPI;
  const hasToken = auth.isAuthenticated();
  debugLog(`Vérification d'accès admin. Jeton présent en localStorage : ${hasToken ? 'oui' : 'NON'}.`);

  if (!hasToken) {
    debugLog('Redirection vers la page de connexion (aucun jeton trouvé).');
    window.location.href = '../auth/login.html';
    return;
  }

  const user = auth.getUser();
  debugLog(`Utilisateur local : ${user ? `${user.email} (rôle: ${user.role})` : 'introuvable/JSON invalide'}.`);

  if (!auth.isAdmin()) {
    debugLog("Redirection vers l'accueil (utilisateur connecté mais pas administrateur).");
    window.location.href = '../index.html';
    return;
  }

  debugLog('Accès admin confirmé, page autorisée à s\'afficher.');
})();
