# Scoolize — Prepare & Predict

Réponse d'**EPI'Gency Digital** à l'appel d'offres du Ministère de l'Éducation (projet pédagogique). Ce dépôt couvre le jalon **semaines 1 à 3** : recherche UX, définition des besoins et vision, maquettes basse et haute fidélité pour **Prepare** (formations) et **Predict** (candidats), en vue de la soutenance du **11 décembre**.

## Démarrer rapidement

- **Voir le prototype cliquable :** ouvrir [`04-maquettes/prototype-hifi/index.html`](04-maquettes/prototype-hifi/index.html) dans un navigateur (aucune installation nécessaire, HTML/CSS/JS statique).
- **Voir les wireframes basse fidélité :** [`04-maquettes/wireframes-lowfi/predict/00-flow.html`](04-maquettes/wireframes-lowfi/predict/00-flow.html) et [`.../prepare/00-flow.html`](04-maquettes/wireframes-lowfi/prepare/00-flow.html).
- **Support de soutenance :** [`08-soutenance/soutenance-scoolize.pptx`](08-soutenance/soutenance-scoolize.pptx) + [notes de présentation](08-soutenance/notes-soutenance.md).
- **Audit de conformité aux consignes :** [`00-audit-final.md`](00-audit-final.md) — vérification point par point de chaque exigence de l'énoncé et de la grille de compétences.

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

## Positionnement en une phrase

Scoolize ne remplace pas Parcoursup : il **structure et rend lisible** ce qui reste aujourd'hui flou — les critères d'admission (Prepare) et l'adéquation d'un profil à ces critères (Predict) — en s'appuyant sur un référentiel de compétences commun aux deux produits.

## Ce que ce jalon livre — et ne livre pas

**Livré :** recherche UX complète, vision produit argumentée, wireframes puis prototype haute-fidélité cliquable et responsive pour l'intégralité des parcours prioritaires, conformité légale/RGPD documentée, plan de conduite du changement, méthode de gestion de projet.

**Volontairement hors périmètre à ce stade** (prévu semaine 4+ selon le planning du kick-off) : backend réel, base de données de production, authentification, calcul en direct — cf. `02-vision-besoins/vision-produit.md` §5.

## Méthode

Dépôt Git versionné avec historique de commits par jalon (voir `git log`). Voir [`07-gestion-de-projet/outils-methodes.md`](07-gestion-de-projet/outils-methodes.md) pour la convention de commits et l'organisation d'équipe.
