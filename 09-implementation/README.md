# Scoolize — Implémentation Full-Stack

Ce dossier contient l'implémentation technique réelle du projet Scoolize (backend + API
+ base de données + frontend connecté), développée en réponse aux remarques du jury sur
le jalon précédent (`00-audit-final.md` à la racine du dépôt ne couvrait que les maquettes
`04-maquettes/prototype-hifi/`, sans backend).

**Périmètre de cette implémentation** : les 6 fonctionnalités explicitement exigées par le
jury — CRUD écoles/formations, numéro INE Parcoursup, gestion des erreurs de compte, taux
d'accès sur 5 ans, écran administrateur, vœux côté frontend. Le référentiel de compétences
pondéré de Prepare (`04-maquettes/prototype-hifi/prepare/`) reste un mockup statique à ce
stade : il n'était pas dans la liste des 6 points, et l'équipe a choisi de prioriser le
socle demandé plutôt que d'élargir le périmètre (voir plan d'implémentation dans l'historique
de commits).

## Stack technique

- **Backend** : Node.js + Express, Prisma ORM, PostgreSQL, JWT, Zod, Swagger.
- **Frontend** : HTML/CSS/JS statique (même design system que le prototype maquettes),
  connecté à l'API via `fetch`.
- **Tests** : Jest + Supertest, exécutés contre une vraie base PostgreSQL (pas de mocks).

## Les 6 exigences du jury — statut

| # | Exigence | Statut | Où |
|---|---|---|---|
| 1 | API écoles supérieures (CRUD, recherche, filtrage, formations) | ✅ | `backend/src/modules/schools/`, `backend/src/modules/formations/` · frontend : `recherche.html`, `formation-detail.html`, `admin/ecoles.html`, `admin/formations.html` |
| 2 | Numéro INE Parcoursup (format, unicité, association étudiant) | ✅ | `backend/src/utils/ine.js`, `backend/src/modules/auth/` · frontend : `auth/register.html` |
| 3 | Gestion des erreurs de création de compte | ✅ | `backend/src/modules/auth/auth.schema.js`, `backend/src/middlewares/error.middleware.js`, `backend/tests/account-errors.test.js` · frontend : `auth/register.html` |
| 4 | Taux d'accès sur 5 ans (calcul auto, API, affichage) | ✅ | `backend/src/modules/stats/` · frontend : `formation-detail.html`, `admin/statistiques.html` |
| 5 | Écran administrateur (utilisateurs, écoles, formations, stats, candidatures) | ✅ | `backend/src/modules/admin/` · frontend : `admin/*.html` |
| 6 | Vœux côté frontend (routes, affichage, modification) | ✅ | `backend/src/modules/wishes/` · frontend : `predict/mes-voeux.html` |

**113 tests automatisés** (Jest + Supertest), exécutés contre une vraie base PostgreSQL de
test (voir `backend/tests/`). Aucune fonctionnalité listée ci-dessus n'est simulée : chaque
route est branchée à une vraie table, avec de vraies contraintes (unicité, clés étrangères).

## Rôles applicatifs

Trois rôles réels, chacun avec sa propre page de connexion :

| Rôle | Connexion | Peut faire |
|---|---|---|
| `STUDENT` | `frontend/auth/login.html` | Rechercher des formations, gérer son profil et ses vœux (les siens uniquement). |
| `SCHOOL_STAFF` | `frontend/auth/prepare-login.html` | Gérer les formations, statistiques et infos de **son propre établissement uniquement** (rattachement via `User.schoolId`) — ex. Camille Dupas ne peut pas modifier une formation d'une autre école (403 si elle essaie). Pas d'auto-inscription : le compte est créé/rattaché par un administrateur via `admin/utilisateurs.html`. |
| `ADMIN` | `frontend/auth/login.html` | Tout gérer, sur tous les établissements (utilisateurs, écoles, formations, statistiques, candidatures). |

Cette séparation est testée (`backend/tests/school-staff.test.js`) : création/modification/suppression
refusée avec un code 403 dès qu'un `SCHOOL_STAFF` cible un établissement qui n'est pas le sien.

## Lancer le projet avec Docker (recommandé pour une démo)

Prérequis : Docker + Docker Compose.

```bash
cd 09-implementation
docker compose up --build
```

- API : http://localhost:4000 (documentation Swagger : http://localhost:4000/api/docs)
- Frontend : http://localhost:8080
- PostgreSQL : exposé sur `localhost:5433` (utilisateur/mot de passe/base : `scoolize`)

Au démarrage, le conteneur `backend` applique automatiquement les migrations Prisma puis
alimente la base avec des données de démonstration réalistes (écoles, formations, 5 années
de statistiques, un compte admin et un compte étudiant).

**Comptes de démonstration** :
| Rôle | Email | Mot de passe |
|---|---|---|
| Administrateur | `admin@scoolize.fr` | `Admin1234!` |
| Étudiant (Léa Martin, INE `123456789AB`) | `lea.martin@lycee-demo.fr` | `Etudiant1234!` |
| Personnel d'établissement — Prepare (Camille Dupas, IUT de Bordeaux) | `camille.dupas@iut-bordeaux.fr` | `Formation1234!` |

## Lancer le backend en local sans Docker

Prérequis : Node.js 20+, PostgreSQL 16 accessible en local.

```bash
cd 09-implementation/backend
cp .env.example .env        # ajuster DATABASE_URL si besoin
npm install
npx prisma migrate deploy
npm run seed
npm run dev                  # démarre sur http://localhost:4000
```

Puis, dans un second terminal, servir le frontend statique (n'importe quel serveur de
fichiers statiques convient) :

```bash
cd 09-implementation/frontend
python3 -m http.server 8080   # ou npx serve -l 8080
```

Ouvrir http://localhost:8080/index.html. Le frontend appelle l'API sur
`http://localhost:4000/api` (URL en dur dans `frontend/assets/js/api.js` — cohérent avec les
ports par défaut ci-dessus et avec `docker-compose.yml`, à adapter si ces ports changent).

## Lancer les tests (réels, contre une vraie base Postgres de test)

```bash
cd 09-implementation/backend
cp .env.test.example .env.test   # ajuster DATABASE_URL si besoin (base dédiée aux tests)
npm run test:migrate
npm test
```

## Limites assumées (transparence, même démarche que `00-audit-final.md`)

- **Validation du numéro INE = format uniquement.** Il n'existe pas de registre INE public
  consultable par API : le backend vérifie que le format respecte la structure documentée
  (11 caractères : 9 chiffres + 1 alphanumérique + 1 lettre) et qu'il n'est pas déjà utilisé
  par un autre compte, mais ne peut pas vérifier qu'un INE correspond à un élève réel.
- **JWT stocké en `localStorage` côté frontend**, pas en cookie httpOnly : choix assumé pour
  rester sur un frontend statique sans framework ni serveur applicatif ; une alternative
  cookie httpOnly + CSRF serait plus robuste en production.
- **Prepare (référentiel de compétences pondéré) non re-branché** sur l'API dans cette passe
  (hors des 6 exigences listées par le jury) — reste un mockup, cf. plus haut.

## Structure

```
09-implementation/
├── docker-compose.yml
├── backend/     # API REST (voir backend/README implicite : ce fichier)
└── frontend/    # Pages HTML connectées à l'API
```
