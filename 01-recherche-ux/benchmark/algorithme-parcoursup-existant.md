# Synthèse technique — algorithmes existants de Parcoursup

**Source :** dépôt public du MESRI, [algorithmes-de-parcoursup](https://gitlab.mim-libre.fr/parcoursup/algorithmes-de-parcoursup) (Java, licence libre)
**Objectif :** comprendre précisément ce que l'algorithme national fait — et surtout ce qu'il **ne fait pas** — pour ne pas refaire un travail déjà existant et pour positionner correctement Prepare/Predict.

## Ce que couvre le dépôt officiel

Le code publié traite **deux algorithmes nationaux**, appliqués une fois les candidatures classées :

1. **Calcul de l'ordre d'appel** (`fr.parcoursup.algos.ordreappel`) : à partir d'un classement déjà établi par la commission d'examen des vœux de chaque formation, détermine l'ordre dans lequel les candidats en liste d'attente seront appelés.
2. **Calcul et envoi des propositions** (`fr.parcoursup.algos.propositions`), incluant :
   - la gestion des places disponibles et du surbooking par formation,
   - la gestion spécifique des places d'internat (calcul itératif d'une "barre d'admission" par internat, sous contrainte de capacité),
   - le répondeur automatique (choix de la meilleure proposition parmi les vœux en attente pour les candidats l'ayant activé),
   - les démissions automatiques des vœux archivés en phase de gestion des démissions (GDD).

## Ce que le dépôt ne couvre pas (et c'est le cœur du problème UX identifié)

Le **classement des candidats au sein d'une formation** — c'est-à-dire l'attribution d'un rang à chaque candidature selon les notes, les compétences attendues, le profil, la pondération des critères — **n'est pas fait par cet algorithme national**. Il est réalisé **localement, par la commission d'examen des vœux de chaque établissement**, selon des critères que l'établissement définit et publie (attendus locaux), sans format ni référentiel commun.

**Conséquence directe pour Scoolize :**
- L'algorithme national est en réalité relativement neutre et documenté (ordre d'appel, gestion des places) : ce n'est pas là que se loge le sentiment d'opacité.
- L'opacité perçue vient de l'hétérogénéité et du manque de structuration des **critères locaux de classement**, propres à chacune des ~24 000 formations.
- **Prepare** ne cherche donc pas à remplacer l'algorithme national (hors périmètre, et déjà correctement outillé), mais à **structurer et rendre lisible l'amont** : la déclaration, par chaque formation, de ses attendus sous forme d'un référentiel de compétences commun et pondéré.
- **Predict** ne cherche pas à prédire le résultat de l'algorithme d'appel (aléas de campagne, comportement des autres candidats), mais à donner un **score de correspondance profil ↔ attendus déclarés**, en amont du dépôt de vœu — un signal d'aide à la décision, pas une garantie d'admission. Ce point doit être explicité à l'utilisateur pour éviter tout effet "promesse" trompeur (cf. `05-conformite-juridique/`).

## Benchmark des solutions d'orientation existantes

| Solution | Public | Ce qu'elle fait bien | Limite par rapport à Scoolize |
|---|---|---|---|
| **Parcoursup** | Étudiants + établissements (France) | Plateforme nationale unique, obligation légale de publication des critères | Attendus locaux non structurés, pas de score de correspondance, UX administrative |
| **Onisep / Terminales2023-2024 (Folios)** | Lycéens | Contenu pédagogique riche sur les métiers/filières | Pas de mise en correspondance individuelle avec un profil de notes |
| **UCAS (Royaume-Uni)** | Étudiants (UK) | Candidature centralisée + prédicteur de notes ("Grade calculator") indicatif | Pas de granularité par compétence, logique tout-notes |
| **Common App (États-Unis)** | Étudiants (US) | Dossier unique réutilisable pour plusieurs universités | Pas de correspondance automatisée, très dépendant de l'avis humain (holistic review) |
| **Plateformes privées d'orientation (l'Etudiant, Diplomeo, etc.)** | Lycéens | Comparateurs de formations, avis d'anciens élèves | Modèle économique publicitaire (formations partenaires mises en avant), pas neutres |

**Enseignement clé pour le positionnement produit :** aucun acteur ne combine à la fois (1) l'obligation légale de transparence des critères, (2) un référentiel de compétences structuré et commun, et (3) un score de correspondance explicable calculé côté candidat. C'est l'espace que Scoolize occupe.
