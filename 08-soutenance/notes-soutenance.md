# Notes de soutenance — script indicatif

Support associé : `soutenance-scoolize.pptx` (15 slides). Durée cible à caler sur le format annoncé par l'enseignant (à défaut, prévoir 12-15 minutes + questions). Répartition des prises de parole alignée sur `../07-gestion-de-projet/roles-raci.md`.

## Ouverture (Membre A — 2 min)
- Se présenter en tant qu'agence EPI'Gency Digital répondant à l'appel d'offres du Ministère.
- Rappeler l'enjeu en une phrase : Parcoursup a démocratisé l'accès mais reste perçu comme opaque — Scoolize rend les critères transparents et actionnables, pour les formations comme pour les candidats.

## Recherche & vision (Membre A — 3 min)
- Montrer 2-3 constats forts de l'audit (pas tous : sélectionner ceux qui frappent le plus, ex. l'écart entre l'algorithme national documenté et l'opacité réelle des critères locaux).
- Présenter les personas en les incarnant brièvement ("Léa n'a personne dans son entourage qui est passé par une CPGE...").
- Conclure sur le positionnement : Scoolize ne remplace pas Parcoursup, il le complète.

## Démonstration du prototype (Membre B — 6 min)
**Important : naviguer dans le prototype réel (navigateur), pas seulement montrer les slides.** Ouvrir `04-maquettes/prototype-hifi/index.html`.

Parcours suggéré :
1. Portail → entrer dans Predict.
2. Écran d'accueil Predict → cliquer "Importer mon bulletin" → montrer la simulation d'import (`import-bulletin.html`, bouton démo).
3. Profil de compétences (`profil.html`) → insister sur la distinction notes / compétences transversales / compétences pratiques.
4. Résultats de recherche (`recherche.html`) → cliquer sur une formation.
5. **Fiche formation (`formation-detail.html`) — l'écran clé** : montrer le détail du score, l'explication par critère, les recommandations de progression.
6. Basculer côté Prepare : dashboard → référentiel → pondération (**faire bouger un curseur en direct** pour montrer l'interactivité) → aperçu candidat (montrer que c'est le même composant que vu côté Predict) → publication.

## Conformité & conduite du changement (Membre A puis Membre C — 3 min)
- RGPD : un seul message clé à faire passer — "le score n'est jamais la décision, la décision reste humaine".
- Conduite du changement : présenter les 4 principes appliqués aux deux publics très différents (formations vs candidats), avec un risque assumé (double plateforme perçue) et sa mitigation.

## Organisation & clôture (Membre C — 2 min)
- Méthode de travail, versioning Git, planning respecté.
- Prochaines étapes explicites (semaine 4+) pour montrer que l'équipe sait ce qui reste à faire, sans le confondre avec ce qui est livré aujourd'hui.
- Merci + ouverture aux questions.

## Anticiper les questions probables du jury

| Question probable | Élément de réponse |
|---|---|
| "Le score Predict peut-il être trompeur / créer une fausse promesse ?" | Toujours qualifié d'« indicatif », jamais de garantie ; renvoi vers `05-conformite-juridique/mentions-legales-predict.md` §3 (art. 22 RGPD) |
| "Comment évitez-vous de reproduire les biais actuels du système ?" | Contexte socio-économique jamais utilisé dans le score (cf. vision produit §4) ; vigilance documentée sur les données historiques (`07-gestion-de-projet/sources-donnees.md`) |
| "Pourquoi ne pas avoir codé une vraie application ?" | Périmètre du jalon = maquettes (semaines 1-3) ; développement réel prévu semaine 4+ selon planning du kick-off — un prototype cliquable non connecté à une base de données évite de sur-livrer hors périmètre et de sacrifier la qualité UX |
| "Qu'avez-vous appris de l'analyse de l'algorithme officiel de Parcoursup ?" | Qu'il gère l'ordre d'appel et les propositions, pas le classement local — ce qui a précisément orienté le positionnement de Prepare (cf. slide 4) |
