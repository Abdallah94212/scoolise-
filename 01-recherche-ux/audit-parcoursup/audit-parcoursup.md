# Audit UX — Parcoursup

**Semaine 1 — Recherche UX & découverte**
**Auteur :** EPI'Gency Digital · Projet Scoolize
**Méthode :** audit heuristique (Nielsen 10 heuristiques + WCAG) sur le parcours candidat de parcoursup.fr, complété par une revue documentaire (rapports Cour des comptes 2020/2023, Défenseur des droits, Comité éthique et scientifique de Parcoursup, retours d'expérience lycéens/familles publiés dans la presse spécialisée).

> Objectif : identifier précisément les frictions que **Prepare** (côté formations) et **Predict** (côté candidats) doivent résoudre, pour justifier chaque choix de conception fait en semaine 2 et 3.

---

## 1. Parcours candidat actuel (as-is)

| Étape | Action attendue | Ce qui se passe réellement |
|---|---|---|
| 1. Découverte | Explorer les formations | Moteur de recherche par mots-clés/filtres, mais les fiches formation mélangent contenu marketing et informations d'admission |
| 2. Compréhension des attendus | Lire les "attendus nationaux" + "attendus locaux" | Attendus nationaux génériques (identiques pour toutes les formations d'une filière) ; attendus locaux rédigés librement par chaque établissement, hétérogènes en forme et en précision |
| 3. Constitution du dossier | Notes, bulletins, lettre de motivation | Ressaisie manuelle de nombreuses informations déjà connues du lycée (livret scolaire) |
| 4. Formulation des vœux | Jusqu'à 10 vœux, sous-vœux illimités | Aucune indication de probabilité d'admission avant le dépôt ; le candidat formule "à l'aveugle" |
| 5. Attente des réponses | Suivi via un tableau de bord | Statuts peu explicites ("en attente", "proposition"), sans estimation de délai ni de rang précis pour beaucoup de formations |
| 6. Réponse à une proposition | Accepter/patienter/renoncer sous délai contraint | Délais courts, effet d'urgence anxiogène, risque de perdre un vœu par oubli |
| 7. Phase complémentaire | Si aucune proposition | Procédure peu comprise, perçue comme un "second choix dégradé" |

## 2. Constats classés par heuristique de Nielsen

1. **Visibilité de l'état du système** — Le classement algorithmique local (fait par chaque commission d'examen des vœux) n'est pas restitué au candidat de façon actionnable : il connaît son rang mais rarement ce qui le sépare des rangs au-dessus.
2. **Correspondance système ↔ monde réel** — Le vocabulaire administratif ("vœu", "sous-vœu", "attendu nationa/local", "cordée", "GDD") n'est pas celui des lycéens ; barrière cognitive forte pour les familles peu familières du supérieur.
3. **Contrôle et liberté** — Une fois un vœu formulé, le candidat ne peut pas simuler l'effet d'une modification de profil (ex : "si j'avais telle spécialité en plus") pour ajuster sa stratégie.
4. **Cohérence** — La qualité et la précision des "attendus locaux" varient fortement d'un établissement à l'autre : certains publient une grille précise et pondérée, d'autres une phrase générique.
5. **Prévention des erreurs** — Rien n'alerte un candidat qui postule sur des vœux totalement décorrélés de son profil (ni à l'inverse ne le rassure s'il sous-estime ses chances) : risque de auto-censure ou d'espoirs déçus.
6. **Reconnaissance plutôt que rappel** — Le candidat doit mémoriser/rechercher activement les critères de chaque formation, aucune vue consolidée "mes compétences vs. attendus des formations suivies".
7. **Flexibilité et efficacité** — Aucun profil réutilisable exportable (les mêmes informations sont ressaisies chaque année, à chaque changement de plateforme post-bac : Parcoursup, puis plateformes des grandes écoles, etc.).
8. **Design épuré** — Tableaux de bord denses, empilement d'informations administratives et pédagogiques au même niveau visuel.
9. **Gestion des erreurs** — Les refus/"en attente" ne sont pas accompagnés d'explications pédagogiques (quelles compétences ont manqué, quel écart de niveau).
10. **Aide et documentation** — L'aide existe (guides, webinaires Onisep) mais elle est disjointe du parcours : le candidat doit sortir de l'outil pour comprendre l'outil.

## 3. Constats structurels (au-delà de l'UI)

- **Opacité perçue de l'algorithme local.** Chaque établissement applique ses propres critères de classement (encadrés par la loi mais non standardisés dans leur présentation), ce qui alimente un sentiment de "boîte noire", documenté par plusieurs rapports publics et repris dans le débat public depuis 2018.
- **Obligation légale déjà existante mais sous-exploitée.** L'article L. 612-3 du Code de l'éducation impose la publication des critères et modalités d'examen des vœux : l'obligation de transparence existe déjà, c'est sa **mise en forme, sa lisibilité et son actionnabilité** qui font défaut. C'est exactement l'angle d'attaque de **Prepare**.
- **Fracture numérique et sociale.** Les lycéens de familles non diplômées du supérieur ou de zones rurales/prioritaires ont statistiquement moins accès à un accompagnement à l'orientation (psychologues de l'Éducation nationale en nombre insuffisant, méconnaissance des codes du supérieur) : ils s'auto-censurent davantage sur les filières sélectives faute de repères clairs.
- **Anxiété générée par l'attente.** La temporalité du "répondeur automatique" et des relances par SMS crée une pression ressentie comme disproportionnée par les familles, largement relayée par la presse chaque année en mai-juin.
- **Accessibilité numérique.** Les audits d'accessibilité successifs de Parcoursup ont pointé des manques (contrastes, navigation clavier, compatibilité lecteurs d'écran) alors que le service est obligatoire pour tous les lycéens, y compris en situation de handicap.

## 4. Ce que cela implique pour Scoolize

| Constat | Réponse produit |
|---|---|
| Attendus hétérogènes et peu lisibles | **Prepare** impose un référentiel de compétences structuré et commun à toutes les formations (mêmes catégories, même échelle de niveau), rempli via un formulaire guidé plutôt qu'un champ de texte libre |
| Aucune estimation de compatibilité avant de candidater | **Predict** calcule un score de correspondance explicable entre le profil du candidat et les attendus, *avant* le dépôt du vœu |
| Refus non pédagogiques | **Predict** affiche les écarts précis ("il vous manque tel niveau dans telle compétence") plutôt qu'un verdict binaire |
| Vocabulaire administratif opaque | Lexique en langage clair intégré aux deux outils, infobulles contextuelles |
| Fracture d'accès à l'accompagnement | Interface pensée mobile-first, contenus en langage clair (niveau FALC pour les points critiques), conforme RGAA |
| Absence de vue consolidée du profil | **Predict** centralise un profil de compétences réutilisable (import bulletin), consultable et modifiable à tout moment |

## 5. Limites de cet audit

- Audit réalisé sans accès à un compte candidat réel (procédure ouverte à date fixe) : basé sur les captures d'écran publiques, la documentation officielle et les retours utilisateurs publiés.
- Les pratiques internes des commissions d'examen des vœux (algorithmes locaux) ne sont pas publiques dans le détail ; seul le [dépôt public des algorithmes nationaux de Parcoursup](https://gitlab.mim-libre.fr/parcoursup/algorithmes-de-parcoursup) (calcul de l'ordre d'appel, propositions, répondeur automatique) a pu être consulté — voir synthèse dans `../benchmark/algorithme-parcoursup-existant.md`.
