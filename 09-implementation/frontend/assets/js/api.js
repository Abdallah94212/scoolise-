// Client API Scoolize — wrapper fetch minimal (pas de framework, cohérent avec
// le reste du prototype). Gère le token JWT (stocké en localStorage) et
// normalise les erreurs pour un affichage simple côté formulaires.
//
// Enveloppé dans une IIFE + garde d'idempotence : si ce script venait à être
// évalué deux fois sur la même page (cache de navigateur/proxy incohérent,
// double injection), la deuxième exécution est simplement ignorée au lieu de
// provoquer un "Identifier has already been declared".
(function () {
  if (window.ScoolizeAPI) return;

  const API_BASE = 'http://localhost:4000/api';
  const TOKEN_KEY = 'scoolize_token';
  const USER_KEY = 'scoolize_user';

  const auth = {
    getToken: () => localStorage.getItem(TOKEN_KEY),
    getUser: () => JSON.parse(localStorage.getItem(USER_KEY) || 'null'),
    setSession: (token, user) => {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    },
    clearSession: () => {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    },
    isAuthenticated: () => !!localStorage.getItem(TOKEN_KEY),
    isAdmin: () => auth.getUser()?.role === 'ADMIN',
  };

  class ApiError extends Error {
    constructor(status, message, errors) {
      super(message);
      this.status = status;
      this.errors = errors || [];
    }
  }

  async function apiRequest(path, { method = 'GET', body, query } = {}) {
    let url = `${API_BASE}${path}`;
    if (query) {
      const params = new URLSearchParams(
        Object.entries(query).filter(([, v]) => v !== undefined && v !== null && v !== '')
      );
      const qs = params.toString();
      if (qs) url += `?${qs}`;
    }

    const headers = { 'Content-Type': 'application/json' };
    const token = auth.getToken();
    if (token) headers.Authorization = `Bearer ${token}`;

    let res;
    try {
      res = await fetch(url, {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });
    } catch (networkErr) {
      // fetch() rejette (sans réponse HTTP) en cas de serveur injoignable ou de
      // blocage CORS — cas le plus fréquent : page ouverte en double-clic
      // (file://) au lieu d'être servie sur http://localhost:8080.
      throw new ApiError(
        0,
        `Impossible de contacter le serveur (${API_BASE}). Vérifiez que l'API est démarrée et que cette page est bien ouverte via http://localhost:8080 (et non ouverte directement depuis un fichier).`
      );
    }

    if (res.status === 204) return null;

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      if (res.status === 401) {
        auth.clearSession();
      }
      throw new ApiError(res.status, data.message || 'Une erreur est survenue.', data.errors);
    }

    return data;
  }

  const api = {
    get: (path, query) => apiRequest(path, { method: 'GET', query }),
    post: (path, body) => apiRequest(path, { method: 'POST', body }),
    put: (path, body) => apiRequest(path, { method: 'PUT', body }),
    del: (path) => apiRequest(path, { method: 'DELETE' }),
  };

  window.ScoolizeAPI = { api, auth, ApiError };
})();
