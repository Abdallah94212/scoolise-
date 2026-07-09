// Navigation globale : affiche l'état connecté/déconnecté, le lien vers
// l'administration si le rôle le permet, et le compteur de vœux.
// Nécessite que assets/js/api.js soit chargé avant ce script, et que la
// page définisse window.SCOOLIZE_BASE (préfixe relatif vers la racine du
// frontend : '' pour index.html, '../' pour les pages dans un sous-dossier).
(function () {
  const base = window.SCOOLIZE_BASE || '';
  const { auth, api } = window.ScoolizeAPI;

  const slot = document.querySelector('[data-auth-slot]');
  if (slot) {
    if (auth.isAuthenticated()) {
      const user = auth.getUser();
      const adminLink = auth.isAdmin()
        ? `<a href="${base}admin/dashboard.html" class="btn btn-ghost btn-sm">Administration</a>`
        : `<a href="${base}predict/mes-voeux.html" class="btn btn-ghost btn-sm">Mes vœux</a>`;
      slot.innerHTML = `${adminLink}<span class="text-sm text-muted">${user.firstName} ${user.lastName}</span><button class="btn btn-secondary btn-sm" id="nav-logout-btn">Déconnexion</button>`;
      document.getElementById('nav-logout-btn').addEventListener('click', () => {
        auth.clearSession();
        window.location.href = `${base}index.html`;
      });
    } else {
      slot.innerHTML = `<a href="${base}auth/login.html" class="btn btn-ghost btn-sm">Se connecter</a><a href="${base}auth/register.html" class="btn btn-primary btn-sm">Créer un compte</a>`;
    }
  }

  const wishLinks = document.querySelectorAll('[data-wishes-count]');
  if (wishLinks.length && auth.isAuthenticated() && !auth.isAdmin()) {
    api
      .get('/wishes/me')
      .then((wishes) => {
        wishLinks.forEach((el) => {
          el.textContent = wishes.length;
          el.style.display = wishes.length ? 'inline-flex' : 'none';
        });
      })
      .catch(() => {});
  }
})();
