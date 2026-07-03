# Plan de conduite du changement — Scoolize

**Livrable explicitement demandé par l'énoncé** ("Assurer l'acceptation et la compréhension des outils développés"). Deux publics distincts à accompagner, avec des enjeux très différents : les équipes pédagogiques/administratives (Prepare) et les lycéens/familles (Predict).

## 1. Cadre méthodologique retenu

Nous structurons le plan autour de **4 principes classiques de conduite du changement** (modèle générique applicable indépendamment de l'outil support utilisé en cours — à recouper avec le contenu spécifique de l'enabler *"The 4 principles of Change Management"* du kick-off) :

1. **Comprendre** — diagnostiquer les résistances et les bénéfices perçus par chaque public.
2. **Impliquer** — associer les utilisateurs cibles à la conception, pas seulement au déploiement.
3. **Former** — outiller concrètement à l'usage du nouvel outil.
4. **Ancrer** — pérenniser l'usage au-delà du lancement (éviter le retour aux anciennes pratiques).

## 2. Public 1 — Équipes des formations (Prepare)

### Comprendre
- **Résistance attendue :** charge de travail supplémentaire perçue en pleine période de rédaction des attendus (janvier), scepticisme sur un énième outil administratif, crainte de perte de contrôle sur les critères de sélection.
- **Levier :** Prepare doit être perçu comme un **gain de temps net**, pas une contrainte de plus (cf. persona Camille, `01-recherche-ux/personas/persona-camille-prepare.md`).

### Impliquer
- Ateliers de co-conception avec un panel de responsables admissions dès la semaine 1 (recherche UX) — matérialisés ici par le persona Camille et le parcours utilisateur associé.
- Comité de pilotage incluant au moins un représentant de la Conférence des présidents d'université (CPU) ou équivalent, en phase réelle.

### Former
- Un tutoriel intégré à l'onboarding (première connexion à Prepare), pas un mode d'emploi PDF externe.
- Sessions de prise en main courtes (30 min) organisées par établissement pilote avant la campagne, en s'appuyant sur les correspondants numériques déjà en poste dans chaque établissement.
- Un mode "bac à sable" permettant de tester le référentiel sans impact sur la publication réelle (inspiré du bac à sable déjà proposé par le dépôt algorithmes-de-parcoursup pour les développeurs, transposé ici à un usage métier).

### Ancrer
- Duplication automatique du référentiel d'une campagne à l'autre (déjà prévu dans le produit, cf. user story F-04) pour que l'usage de Prepare devienne le chemin le plus rapide, pas une option de plus.
- Indicateur de valeur visible dès la première campagne (temps gagné, nombre de profils simulés) pour objectiver le bénéfice et sécuriser l'adoption l'année suivante.

## 3. Public 2 — Candidats et familles (Predict)

### Comprendre
- **Résistance attendue :** méfiance envers un nouvel outil numérique en plus de Parcoursup, crainte d'un usage de leurs données, fatigue générale vis-à-vis des démarches administratives post-bac.
- **Levier :** positionner Predict comme un **outil d'aide à la décision et de réassurance**, pas une couche administrative supplémentaire (cf. persona Léa).

### Impliquer
- Tests utilisateurs avec des lycéens de profils variés (dont persona Yanis, bac professionnel) avant diffusion large, pour éviter un outil pensé uniquement pour des profils déjà favorisés.
- Relais via les psychologues de l'Éducation nationale et les professeurs principaux, déjà identifiés comme interlocuteurs de confiance sur l'orientation.

### Former
- Aucune formation formelle attendue (public grand public) : l'enjeu est l'**auto-explicabilité** de l'interface (lexique en langage clair, infobulles, cf. `lexique.html`).
- Supports pédagogiques courts (vidéo de 2 min, capture d'écran commentée) diffusables en heure de vie de classe.

### Ancrer
- Intégration du lien vers Predict directement depuis les communications officielles de Parcoursup (bandeau, email), pour éviter un outil "à part" que l'utilisateur doit découvrir par lui-même.
- Suivi d'un indicateur d'usage réel post-lancement (cf. `02-vision-besoins/vision-produit.md` §6) pour ajuster le plan si l'adoption chez les publics prioritaires (persona Yanis) est plus faible que chez les publics déjà favorisés (persona Léa).

## 4. Facteurs de risque transverses

| Risque | Mitigation |
|---|---|
| Effet "double plateforme" (Parcoursup + Scoolize) perçu comme une complexité de plus | Positionnement clair : Scoolize s'intègre à Parcoursup, ne le remplace pas (cf. vision produit §1) |
| Sur-confiance dans le score (traité comme une garantie) | Mentions explicites "indicatif" partout dans l'UI (cf. `05-conformite-juridique/mentions-legales-predict.md` §3) |
| Adoption inégale selon les établissements (Prepare) | Sélection d'établissements pilotes volontaires en semaine 4+ avant généralisation, avec retours d'expérience valorisés en communication interne |

## 5. Calendrier d'accompagnement (aligné sur le planning global du kick-off)

| Semaine | Action de conduite du changement |
|---|---|
| 1-3 (ce jalon) | Recherche + maquettes validées avec les personas représentatifs des deux publics |
| 4 (Acceptance & Beta) | Tests utilisateurs réels, ajustement du plan de formation Prepare |
| 5-6 (Déploiement) | Déploiement pilote, kit de communication candidats, mesure des premiers indicateurs d'adoption |
