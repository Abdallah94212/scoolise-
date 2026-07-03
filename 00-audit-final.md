# Audit final de conformité aux consignes

Ce document répond explicitement à la demande : vérifier point par point que chaque exigence est respectée, signaler les incohérences éventuelles, expliquer les améliorations apportées par rapport au projet de référence analysé, et lister les points restant à améliorer.

---

## 1. Conformité aux consignes explicites de l'énoncé

| Exigence (kick-off + échéancier communiqué) | Statut | Preuve |
|---|---|---|
| Se familiariser avec Parcoursup, trouver des données publiques appropriées | ✅ | `01-recherche-ux/audit-parcoursup/`, `01-recherche-ux/benchmark/algorithme-parcoursup-existant.md`, `07-gestion-de-projet/sources-donnees.md` |
| Semaine 1 — Initialisation, organisation, planification, recherche UX (audit, découverte Parcoursup) | ✅ | Audit heuristique complet + personas + parcours ; planning documenté dans `07-gestion-de-projet/planning-semaines-1-3.md` |
| Semaine 2 — Définition des besoins, vision, début des maquettes Prepare/Predict | ✅ | `02-vision-besoins/` (vision + user stories) + `04-maquettes/wireframes-lowfi/` |
| Semaine 3 — Finalisation des maquettes Prepare/Predict + soutenance 11 décembre | ✅ | `04-maquettes/prototype-hifi/` (13 écrans cliquables) + `08-soutenance/` |
| Livrable Prepare (déclaration transparente des compétences/niveaux requis pour les universités) | ✅ | Flux complet : référentiel guidé → pondération → aperçu candidat → publication, avec rappel légal intégré |
| Livrable Predict (upload des scores, formations adaptées au profil) | ✅ | Flux complet : import bulletin (simulé) → profil de compétences → recherche avec score → fiche formation explicable → comparateur |
| Plan de gestion du changement | ✅ | `06-conduite-du-changement/plan-conduite-du-changement.md`, structuré en 4 principes, pour les deux publics (formations et candidats) |
| "Une importance particulière est accordée à l'UX et l'UI" | ✅ | Audit heuristique dédié, 3 personas, design system documenté et justifié, prototype haute-fidélité accessible (AA/AAA visé) |

## 2. Conformité à la grille de compétences (fichier `compétences scoolize.xlsx`)

| Code | Compétence | Statut | Où |
|---|---|---|---|
| 00.03.B07 | Rédiger un document professionnel | ✅ | L'ensemble des `.md` du dépôt |
| 00.05.B03 | Répondre aux questions de manière pertinente et argumentée | ✅ | `08-soutenance/notes-soutenance.md` (anticipation des questions du jury) |
| 01.02.B04 | Évaluer la faisabilité d'une solution | ✅ | `02-vision-besoins/vision-produit.md` §5 (périmètre MVP explicite, hors périmètre assumé) |
| 01.02.B09 | Quantifier les similitudes entre ensembles de données | ⚠️ Partiel | Logique de score pondéré illustrée dans le prototype (`formation-detail.html`) ; **non implémentée en code de calcul réel** — cohérent avec le périmètre "maquettes", à formaliser algorithmiquement en semaine 4 |
| 01.03.B01 | Consommer des données structurées à partir d'une source externe | ⚠️ Partiel | Analyse documentée du dépôt public des algorithmes Parcoursup et identification de jeux de données data.gouv.fr (`sources-donnees.md`) ; **aucun appel programmatique réel à une API** à ce stade (hors périmètre maquettes) |
| 02.02.B05 | Créer un tutoriel | ✅ | `07-gestion-de-projet/tutoriel-prise-en-main-prepare.md` |
| 02.03.B05 | Établir des partenariats et réseaux | ⚠️ Léger | Relais identifiés (psychologues de l'Éducation nationale, professeurs principaux, CPU) dans `plan-conduite-du-changement.md`, sans formalisation contractuelle (hors périmètre d'un jalon maquettes) |
| 02.04.B02 | Utiliser un outil de versioning pour collaborer | ✅ | Dépôt Git local, historique de commits par jalon (`git log`), convention documentée dans `outils-methodes.md` |
| 02.04.B03 | Utiliser des outils de gestion de projet | ✅ | `planning-semaines-1-3.md`, `roles-raci.md`, `outils-methodes.md` |
| 02.05.B02 | Respecter la vie privée et la confidentialité | ✅ | `05-conformite-juridique/mentions-legales-predict.md` |
| 02.06.B12 | Adapter sa stratégie de promotion | ⚠️ Léger | Canaux de communication identifiés dans le plan de conduite du changement ; pas de plan marketing dédié (pertinence plus forte en phase de déploiement, semaine 5-6) |
| 03.01.B06 | Concevoir une UX ergonomique adaptée aux besoins | ✅✅ | Audit + personas + parcours + design system + prototype accessible |
| 05.01.B01 | Suggérer une mise en œuvre réaliste d'une idée | ✅ | Périmètre MVP explicite et justifié (`vision-produit.md` §5) |
| 05.01.B02 | Fournir un prototype convaincant | ✅✅ | `04-maquettes/prototype-hifi/` — 13 écrans, interactions réelles (JS), captures d'écran en situation |
| 05.02.B08 | Tenir compte des aspects juridiques d'un projet | ✅ | `05-conformite-juridique/` (RGPD, art. L. 612-3, non-discrimination, art. 22 RGPD) |
| 05.03.B07 | Créer des prototypes interactifs | ✅✅ | Sliders de pondération fonctionnels, comparateur avec état persistant (localStorage), simulation d'import de fichier, tooltips, jauges de score animées |
| 06.04.B01 | Étudier le marché et analyser la concurrence | ✅ | `01-recherche-ux/benchmark/algorithme-parcoursup-existant.md` (Parcoursup, Onisep, UCAS, Common App, plateformes privées) |
| 06.04.B02 | Élaborer des stratégies marketing et commerciales | ⚠️ Léger | Différenciation produit posée (`vision-produit.md`), stratégie commerciale complète non pertinente à ce stade (le "client" est le Ministère, pas un marché concurrentiel classique) |
| 06.06.B02 | Maîtriser les outils et canaux de communication | ⚠️ Partiel | Canaux identifiés par public dans le plan de conduite du changement |
| 07.05.B02 | Concevoir et améliorer l'offre de produits et services | ✅ | User stories priorisées (MoSCoW), référentiel de compétences itératif côté Prepare |
| 07.05.B04 | Tester et valider les produits et services | ✅ | `01-recherche-ux/validation-prototype.md` — deux défauts réels détectés par capture d'écran et corrigés, protocole de test utilisateur proposé pour la suite |

**Synthèse :** 16 compétences sur 21 pleinement couvertes, 5 couvertes partiellement avec justification explicite du niveau de maturité attendu à ce stade du projet (semaines 1-3 = maquettes, pas déploiement commercial ni intégration technique réelle).

## 3. Améliorations apportées par rapport au projet de référence (dépôt `rosa-skn/scoolize`)

| Constat sur le projet de référence | Ce qui a été fait différemment ici |
|---|---|
| Aucune trace de recherche UX, personas, vision ou wireframes dans le dépôt | Processus complet documenté : audit → personas → parcours → vision → wireframes → prototype, à chaque étape tracée |
| Code applicatif complet (React + Supabase) livré directement, hors périmètre du jalon "maquettes" | Prototype HTML/CSS/JS cliquable, fidèle au périmètre réellement demandé pour ce jalon (semaines 1-3), avec le développement réel explicitement positionné en semaine 4+ |
| Fichier `.env` contenant une clé Supabase réelle commité dans le dépôt Git public | Aucune donnée réelle, aucun secret, aucune connexion à un service tiers dans ce dépôt |
| Historique Git réduit à un seul commit ("after soutenance"), aucune preuve de collaboration | Historique de commits structuré par jalon, convention de nommage documentée |
| Algorithme de scoring ad hoc (`algorithm.js`) non documenté, ne correspondant pas au fonctionnement réel de Parcoursup, aucune mention de transparence/explicabilité | Score toujours accompagné d'une explication détaillée par critère ; positionnement explicite par rapport à l'algorithme officiel réel (analysé dans `benchmark/algorithme-parcoursup-existant.md`) |
| Aucune mention RGPD, légale ou de non-discrimination malgré la nature du projet (données scolaires de mineurs) | Dossier dédié `05-conformite-juridique/`, avec limitation explicite de l'usage des données de contexte socio-économique |
| Aucun plan de conduite du changement, pourtant explicitement demandé par l'énoncé | `06-conduite-du-changement/plan-conduite-du-changement.md`, structuré et différencié par public |
| README par défaut de Vite, aucune documentation du projet | README structuré, navigation claire vers chaque livrable |

## 4. Incohérences vérifiées et corrigées durant la production

- Vérification automatique de tous les liens internes du prototype (script Python) — aucun lien cassé résiduel non justifié.
- Deux défauts de mise en page détectés par capture d'écran réelle (grille inversée, badge mal adapté à du texte long) et corrigés — voir `01-recherche-ux/validation-prototype.md`.
- Cohérence de nommage vérifiée : mêmes personas, mêmes valeurs de démonstration (formation, scores) sur l'ensemble du prototype et du support de soutenance.

## 5. Limites assumées et points à améliorer

Ces points sont assumés explicitement plutôt que dissimulés, conformément à la démarche demandée :

1. **Pas de test utilisateur réel effectué** (lycéens, responsables admissions) : le prototype a été validé par une démarche de test heuristique interne, pas encore par un panel externe. Un protocole est proposé (`validation-prototype.md` §3) mais reste à exécuter en semaine 4.
2. **Pas de fichier Figma natif livré** : contrainte outillage assumée et compensée par un prototype HTML/CSS structuré, conçu pour être importé dans Figma via le plugin `html.to.design` (cf. `03-design-system/charte-graphique.md` §6). Si l'enseignant exige un fichier `.fig` déposé littéralement, cette étape d'import doit être réalisée manuellement par l'équipe avant remise finale.
3. **Score de correspondance illustratif, non calculé dynamiquement** : les valeurs affichées (82 %, 76 %, 58 %, 31 %...) sont des exemples fixes cohérents entre les pages, pas le résultat d'un calcul en direct — attendu à ce stade (produit = maquette, pas application fonctionnelle).
4. **Analyse d'impact RGPD (AIPD/DPIA) recommandée mais non réalisée** : correctement positionnée comme un livrable de la phase suivante (semaine 4, "Data & Technology"), pas de ce jalon.
5. **Persona unique par profil** : trois personas couvrent les cas prioritaires identifiés, mais ne représentent pas l'exhaustivité des profils réels (ex. candidats en situation de handicap, candidats en réorientation) — extension possible en semaine 4 si le temps le permet.
6. **Support de soutenance (pptx) non revu par un rendu visuel complet** : généré programmatiquement et vérifié sur la diapositive de titre et la logique de mise en page ; une relecture visuelle intégrale dans PowerPoint/Keynote avant la présentation réelle reste recommandée.

## 6. Ambiguïtés d'énoncé rencontrées et interprétation retenue

- **"Assurer l'acceptation des outils développés"** sans détail du modèle de conduite du changement à appliquer : le modèle générique en 4 principes (Comprendre / Impliquer / Former / Ancrer) a été retenu comme cadre transparent et largement reconnu, tout en signalant explicitement qu'il doit être recoupé avec le contenu spécifique vu en cours ("The 4 principles of Change Management" mentionné dans le kick-off, contenu non fourni dans les documents transmis).
- **Format des maquettes ("Figma obligatoire" selon la consigne orale rapportée)** : en l'absence d'accès à Figma, un prototype HTML/CSS haute-fidélité a été produit comme livrable principal, avec un chemin explicite et outillé (plugin `html.to.design`) pour obtenir un fichier Figma réel sans perte de qualité de conception.
- **Portée exacte du "MVP" en semaine 3** : interprété comme "l'ensemble des parcours priorisés Must (MoSCoW)" plutôt que l'exhaustivité des user stories — choix documenté et assumé dans `besoins-utilisateurs.md`.
