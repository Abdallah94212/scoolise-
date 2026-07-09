// Protège les pages admin/*.html : redirige vers la connexion si l'utilisateur
// n'est pas authentifié, ou vers l'accueil s'il est authentifié mais non admin.
(function () {
  const { auth } = window.ScoolizeAPI;
  if (!auth.isAuthenticated()) {
    window.location.href = '../auth/login.html';
  } else if (!auth.isAdmin()) {
    window.location.href = '../index.html';
  }
})();
