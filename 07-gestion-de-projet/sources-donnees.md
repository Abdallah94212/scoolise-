# Sources de données publiques identifiées

Correspond à la compétence *"Consommer des données structurées à partir d'une source externe"* (01.03.B01) et à l'exigence de l'énoncé de "trouver des données publiques appropriées".

## Sources retenues pour la suite du projet (phase Data & Technology, semaine 4+)

| Source | Contenu | Usage prévu pour Scoolize |
|---|---|---|
| [data.gouv.fr — jeux de données Parcoursup](https://www.data.gouv.fr) (rechercher "Parcoursup") | Statistiques annuelles par formation : nombre de vœux, taux d'accès, répartition boursiers/non-boursiers, mentions au bac des admis | Alimenter le référentiel Prepare avec des données historiques de cadrage (ex. suggérer un niveau minimal cohérent avec les admis des années précédentes) |
| [gitlab.mim-libre.fr/parcoursup/algorithmes-de-parcoursup](https://gitlab.mim-libre.fr/parcoursup/algorithmes-de-parcoursup) | Code source des algorithmes nationaux (ordre d'appel, propositions) | Référence technique pour positionner précisément le périmètre de Scoolize sans dupliquer l'existant (cf. `01-recherche-ux/benchmark/algorithme-parcoursup-existant.md`) |
| Onisep (data et contenus pédagogiques sur les métiers/formations) | Fiches formations, débouchés | Enrichir les fiches formation côté Predict avec du contenu pédagogique au-delà du seul score |
| INSEE (données socio-économiques par zone géographique) | Indicateurs de zone (rural/urbain, quartiers prioritaires) | Alimenter, avec prudence méthodologique, l'affichage de profils similaires ayant réussi (persona Léa/Yanis) — jamais le calcul du score lui-même (cf. `05-conformite-juridique/mentions-legales-predict.md`) |

## Limites et points de vigilance identifiés

- Les données d'admission historiques (data.gouv.fr) reflètent les biais du système actuel : les utiliser pour calibrer un référentiel de compétences risquerait de **reproduire les biais existants** (ex. sous-représentation de certains profils dans les filières sélectives) plutôt que de les corriger. Ce risque doit être documenté et arbitré collectivement avant tout usage en phase de développement réel.
- Le dépôt GitLab des algorithmes est un dépôt de code, pas un jeu de données au sens strict : il a été utilisé comme **documentation technique de référence**, pas comme source de données à consommer par une API.
- Aucune donnée nominative réelle d'élève n'a été utilisée à ce stade : tous les profils et scores présentés dans le prototype (`04-maquettes/prototype-hifi/`) sont fictifs et construits à partir des personas.
