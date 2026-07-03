# Vision produit — Scoolize (Prepare & Predict)

**Semaine 2 — Définition des besoins et vision**
**Réponse à l'appel d'offres du Ministère de l'Éducation — EPI'Gency Digital**

## 1. Énoncé de vision

> Scoolize rend l'orientation post-bac **transparente et actionnable** en remplaçant les critères d'admission flous par un **référentiel de compétences commun**, partagé entre formations et candidats, permettant à chacun de comprendre — et d'agir sur — son adéquation à une formation, avant même de candidater.

Scoolize n'est pas une refonte de Parcoursup : c'est une **couche de transparence et d'aide à la décision** qui s'articule avec l'existant (cf. `01-recherche-ux/benchmark/algorithme-parcoursup-existant.md`), composée de deux produits :

| Produit | Pour qui | Promesse |
|---|---|---|
| **Prepare** | Formations / établissements | Déclarer ses attendus de façon structurée, pondérée et conforme, en moins de temps qu'aujourd'hui |
| **Predict** | Candidats | Importer son profil et voir, formation par formation, un score de correspondance explicable |

## 2. Problème adressé (rappel synthétique de l'audit)

Voir `01-recherche-ux/audit-parcoursup/audit-parcoursup.md` pour le détail. En résumé : l'obligation légale de transparence des critères d'admission existe déjà (art. L. 612-3 du Code de l'éducation) mais elle est mal outillée — attendus hétérogènes, non structurés, non actionnables pour le candidat, chronophages à rédiger pour les formations.

## 3. Proposition de valeur

### Pour les formations (Prepare)
- Gagner du temps de rédaction grâce à un référentiel de compétences prêt à l'emploi, personnalisable.
- Objectiver les débats en commission d'examen des vœux grâce à une pondération explicite et tracée.
- Se conformer plus facilement à l'obligation légale de publication des critères.

### Pour les candidats (Predict)
- Savoir *pourquoi* une formation correspond ou non à son profil, pas seulement *si*.
- Réduire l'autocensure liée à un manque de repères (spécifiquement documenté chez les élèves primo-accédants au supérieur, persona Léa).
- Valoriser des compétences non académiques (bac professionnel, projets, cf. persona Yanis) trop souvent invisibles dans un système fondé sur la seule moyenne générale.

## 4. Primauté de la donnée : périmètre du référentiel de compétences

Un référentiel commun est la pièce centrale qui relie Prepare et Predict. Catégories retenues (issues du travail de recherche + cohérence avec les données publiques disponibles sur les formations, cf. `07-gestion-de-projet/sources-donnees.md`) :

1. **Résultats académiques** — moyennes par matière, spécialités, mention au bac (import bulletin).
2. **Compétences transversales** — méthode, autonomie, communication écrite/orale (auto-déclaratif + appréciations du bulletin).
3. **Compétences pratiques / techniques** — projets réalisés, stages, certifications (déclaratif avec justificatif, en particulier pour les filières technologiques et professionnelles).
4. **Contexte du candidat** — boursier, secteur géographique, type de bac (utilisé uniquement pour l'affichage d'exemples de profils similaires ayant réussi, jamais pour pénaliser le score — cf. non-discrimination, `05-conformite-juridique/`).

## 5. Portée du MVP (ce jalon : maquettes semaines 1 à 3)

**Dans le périmètre (maquettes + prototype cliquable) :**
- Predict : import de bulletin (simulation), profil de compétences, recherche de formations, fiche formation avec score explicable, comparateur (jusqu'à 3 formations).
- Prepare : onboarding formation, constructeur de référentiel de compétences guidé, pondération, prévisualisation candidat, tableau de bord simple.

**Hors périmètre à ce stade (indiqué pour transparence, traité en semaines 4+ selon planning du kick-off) :**
- Développement backend réel / base de données de production.
- Authentification réelle et connexion à un SI académique existant.
- Calcul en direct de l'algorithme national d'ordre d'appel (hors sujet, déjà couvert par l'existant, cf. benchmark).

## 6. Indicateurs de succès (à horizon beta, semaine 4+)

| Indicateur | Cible indicative |
|---|---|
| Temps moyen de déclaration des attendus (Prepare) | -50 % vs. rédaction libre actuelle |
| Taux de candidats consultant le détail du score avant de candidater (Predict) | > 70 % |
| Taux de candidats primo-accédants qui déclarent avoir "découvert une formation à laquelle ils n'auraient pas pensé" | Mesuré par enquête post-lancement |
| Accessibilité | Conformité RGAA niveau AA |
