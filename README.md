# Scoolize — Prepare & Predict

Réponse d'**EPI'Gency Digital** à l'appel d'offres du Ministère de l'Éducation (projet pédagogique). Ce dépôt couvre le jalon **semaines 1 à 3** : recherche UX, définition des besoins et vision, maquettes basse et haute fidélité pour **Prepare** (formations) et **Predict** (candidats), en vue de la soutenance du **11 décembre**.

## Démarrer rapidement

- **Lancer l'application full-stack (backend + API + BDD + frontend connecté) :** voir [`09-implementation/README.md`](09-implementation/README.md) — réponse aux remarques du jury sur l'absence de backend.
- **Voir le prototype cliquable (maquettes S1-S3) :** ouvrir [`04-maquettes/prototype-hifi/index.html`](04-maquettes/prototype-hifi/index.html) dans un navigateur (aucune installation nécessaire, HTML/CSS/JS statique).
- **Voir les wireframes basse fidélité :** [`04-maquettes/wireframes-lowfi/predict/00-flow.html`](04-maquettes/wireframes-lowfi/predict/00-flow.html) et [`.../prepare/00-flow.html`](04-maquettes/wireframes-lowfi/prepare/00-flow.html).
- **Support de soutenance :** [`08-soutenance/soutenance-scoolize.pptx`](08-soutenance/soutenance-scoolize.pptx) + [notes de présentation](08-soutenance/notes-soutenance.md).
- **Audit de conformité aux consignes :** [`00-audit-final.md`](00-audit-final.md) — vérification point par point de chaque exigence de l'énoncé et de la grille de compétences (jalon maquettes S1-S3, antérieur à l'implémentation full-stack).

## Structure du dépôt

| Dossier | Contenu | Semaine |
|---|---|---|
| [`01-recherche-ux/`](01-recherche-ux/) | Audit heuristique de Parcoursup, benchmark concurrentiel, personas, parcours utilisateurs | 1 |
| [`02-vision-besoins/`](02-vision-besoins/) | Vision produit, périmètre, user stories priorisées | 2 |
| [`03-design-system/`](03-design-system/) | Charte graphique, tokens couleur/typo, méthode d'import vers Figma | 2 |
| [`04-maquettes/`](04-maquettes/) | Wireframes basse fidélité puis prototype haute fidélité cliquable | 2-3 |
| [`05-conformite-juridique/`](05-conformite-juridique/) | RGPD, non-discrimination, obligations légales (art. L. 612-3) | 3 |
| [`06-conduite-du-changement/`](06-conduite-du-changement/) | Plan d'accompagnement des deux publics (formations / candidats) | 3 |
| [`07-gestion-de-projet/`](07-gestion-de-projet/) | Planning, rôles (RACI), outils, versioning, sources de données | Transverse |
| [`08-soutenance/`](08-soutenance/) | Support de présentation et script | 3 |
| [`09-implementation/`](09-implementation/) | **Backend Node/Express + PostgreSQL, API REST documentée (Swagger), authentification JWT (3 rôles), 113 tests automatisés, frontend connecté** | 4 (post-jury) |

## Technologies réellement utilisées (`09-implementation/`)

**Backend**
- **Node.js + Express** — serveur API REST (port 4000).
- **PostgreSQL** — base de données relationnelle (5 tables : users, schools, formations, formation_stats, wishes).
- **Prisma ORM** — schéma déclaratif, migrations versionnées, client généré et typé.
- **JWT (jsonwebtoken) + bcrypt** — authentification par jeton signé et hachage des mots de passe.
- **Zod** — validation des données entrantes avec messages d'erreur par champ.
- **Swagger (swagger-jsdoc + swagger-ui-express)** — documentation interactive de l'API (`/api/docs`).
- **Jest + Supertest** — 113 tests automatisés exécutés contre une vraie base PostgreSQL de test.

**Frontend**
- **HTML / CSS / JS natif**, sans framework — même design system que le prototype maquettes (`tokens.css`, `base.css`).
- **fetch API** (`assets/js/api.js`) — client HTTP maison gérant le jeton JWT et les erreurs.

**Infrastructure**
- **Docker + Docker Compose** — 3 conteneurs (base de données, API, frontend) pour lancer tout le projet en une commande.
- **Git / GitHub** — versioning, historique de commits par jalon.

## Installation et lancement

### Avec Docker (recommandé pour une démo)

```bash
cd 09-implementation
docker compose up --build
```

- Frontend : http://localhost:8080
- API : http://localhost:4000 (documentation Swagger : http://localhost:4000/api/docs)
- Comptes de démonstration et détail complet : voir [`09-implementation/README.md`](09-implementation/README.md).

### Sans Docker (développement local)

```bash
# 1. Backend — nécessite Node.js 20+ et PostgreSQL 16 accessibles en local
cd 09-implementation/backend
cp .env.example .env        # ajuster DATABASE_URL si besoin
npm install
npx prisma migrate deploy
npm run seed
npm run dev                  # démarre sur http://localhost:4000

# 2. Frontend — dans un second terminal, n'importe quel serveur de fichiers statiques convient
cd 09-implementation/frontend
python3 -m http.server 8080
```

Ouvrir http://localhost:8080/index.html. Voir [`09-implementation/README.md`](09-implementation/README.md) pour le
détail complet : comptes de démonstration, lancement des tests (`npm test`), et limites assumées.

## Positionnement en une phrase

Scoolize ne remplace pas Parcoursup : il **structure et rend lisible** ce qui reste aujourd'hui flou — les critères d'admission (Prepare) et l'adéquation d'un profil à ces critères (Predict) — en s'appuyant sur un référentiel de compétences commun aux deux produits.

## Ce que ce jalon livre — et ne livre pas

**Livré (semaines 1-3, maquettes) :** recherche UX complète, vision produit argumentée, wireframes puis prototype haute-fidélité cliquable et responsive pour l'intégralité des parcours prioritaires, conformité légale/RGPD documentée, plan de conduite du changement, méthode de gestion de projet.

**Livré depuis (implémentation full-stack, dossier `09-implementation/`)** en réponse aux remarques du jury sur l'absence de backend : API REST Node/Express documentée (Swagger), base de données PostgreSQL réelle (Prisma, migrations), authentification JWT avec 3 rôles (Étudiant, Personnel d'établissement, Administrateur), CRUD écoles/formations, validation du numéro INE, calcul automatique des taux d'accès sur 5 ans, écran administrateur complet, gestion des vœux — 113 tests automatisés contre une vraie base de test. Voir [`09-implementation/README.md`](09-implementation/README.md) pour le détail et les limites assumées.

**Volontairement hors périmètre à ce stade :** le référentiel de compétences pondéré de Prepare (constructeur, pondération, aperçu candidat) reste un mockup statique — non demandé par le jury, priorité donnée au socle Parcoursup exigé.

## Méthode

Dépôt Git versionné avec historique de commits par jalon (voir `git log`). Voir [`07-gestion-de-projet/outils-methodes.md`](07-gestion-de-projet/outils-methodes.md) pour la convention de commits et l'organisation d'équipe.
