# Validation du prototype — tests réalisés et protocole à venir

## 1. Test réalisé à ce stade : parcours à froid (cognitive walkthrough) + capture d'écran réelle

Avant de considérer le prototype haute-fidélité comme finalisé, chaque écran a été **rendu réellement dans un navigateur** (Chrome, en mode headless, résolution desktop 1440px) et inspecté visuellement, plutôt que simplement relu dans le code — démarche volontaire pour détecter les défauts qu'une simple relecture de code ne révèle pas.

### Défauts détectés et corrigés

| # | Défaut constaté | Écrans concernés | Cause | Correction appliquée |
|---|---|---|---|---|
| 1 | Le titre de la formation et le contenu principal s'affichaient écrasés dans une colonne étroite de 280px, tandis que la barre latérale (score) occupait l'espace large | `predict/formation-detail.html`, `prepare/apercu.html` | Les deux blocs (contenu principal / aside) étaient inversés dans le DOM par rapport à l'ordre attendu par la classe CSS `.grid-sidebar` (280px puis 1fr) | Création d'une classe dédiée `.grid-sidebar-end` (1fr puis 300px) pour les mises en page où le contenu principal est à gauche |
| 2 | Le texte "Comment ce score est calculé ?" placé dans un composant `badge` (pensé pour des libellés courts) se repliait sur lui-même en un bloc quasi circulaire illisible | `predict/formation-detail.html` | Réutilisation d'un composant visuel inadapté à un texte long | Remplacement par un simple texte souligné en pointillés (cohérent avec le style d'infobulle `[data-term]` déjà défini) |

Ces deux corrections ont été appliquées directement dans le code source, puis vérifiées par une nouvelle capture d'écran confirmant la résolution du problème (voir `08-soutenance/screenshots/predict-fiche.png`, version corrigée).

**Enseignement méthodologique :** ce test, bien que léger, illustre pourquoi la compétence *"Tester et valider les produits et services"* ne peut pas se limiter à une relecture du code — un rendu réel révèle des défauts invisibles autrement (ici, un ordre de grille CSS inversé). C'est un des reproches qu'on peut faire à l'approche "tout-code" de l'exemple étudié en amont, où aucune preuve de test n'était disponible dans le dépôt.

## 2. Vérifications complémentaires effectuées

- **Liens internes** : script de vérification automatique de tous les `href` du prototype haute-fidélité (13 pages), aucun lien cassé résiduel en dehors des renvois volontaires vers les wireframes et les documents de conformité (livrés dans une passe ultérieure du projet).
- **Cohérence de nommage** : mêmes noms de personas, de formation de démonstration ("BUT Techniques de Commercialisation — IUT de Bordeaux") et de valeurs de score across toutes les pages Predict et Prepare, pour que la démonstration en soutenance reste cohérente d'un écran à l'autre.
- **Accessibilité de base** : présence systématique d'un lien d'évitement (`skip-link`), de labels de formulaire, de `aria-expanded`/`aria-label` sur les éléments interactifs non textuels (menu mobile, tooltips lexique).

## 3. Protocole prévu pour la suite (semaine 4 — Acceptance & Beta)

Ce prototype n'a pas encore été testé avec de vrais utilisateurs (lycéens, responsables admissions) — cela sort du périmètre temporel de ce jalon (maquettes) mais doit être anticipé :

| Étape | Méthode | Participants cibles |
|---|---|---|
| Test modéré individuel (45 min) | Scénario de tâches guidées ("trouvez une formation qui vous correspond et comprenez pourquoi") + verbalisation à voix haute | 5 lycéens de profils variés, dont au moins un profil bac professionnel (cf. persona Yanis) |
| Test modéré individuel (30 min) | Scénario "déclarez les attendus de votre formation en moins de 15 minutes" | 3 responsables admissions/enseignants de formations différentes |
| Questionnaire post-test (SUS ou UMUX-Lite) | Auto-administré | Tous les participants ci-dessus |

**Critère de succès proposé :** un score de correspondance doit pouvoir être expliqué par l'utilisateur testé, dans ses propres mots, immédiatement après consultation de la fiche formation — sinon l'objectif d'explicabilité (cœur de la proposition de valeur) n'est pas atteint.
