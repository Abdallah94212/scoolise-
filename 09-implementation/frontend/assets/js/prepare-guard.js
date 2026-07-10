// Protège les pages prepare/*.html : redirige vers la connexion Prepare si
// l'utilisateur n'est pas authentifié, ou vers l'accueil s'il est
// authentifié mais n'est pas un compte "personnel d'établissement".
(function () {
  if (!window.ScoolizeAPI) return;

  const { auth } = window.ScoolizeAPI;

  if (!auth.isAuthenticated()) {
    window.location.href = '../auth/prepare-login.html';
    return;
  }

  if (!auth.isSchoolStaff()) {
    window.location.href = '../index.html';
  }
})();
