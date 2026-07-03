# Outils, méthodes et versioning

Correspond directement aux compétences *"Utiliser un outil de versioning pour collaborer"* (02.04.B02) et *"Utiliser des outils de gestion de projet"* (02.04.B03).

## Outils retenus

| Besoin | Outil | Justification |
|---|---|---|
| Versioning & collaboration code/maquettes | **Git + GitHub/GitLab** (dépôt d'équipe) | Historique tracé, revue par pull request, cohérent avec les deux dépôts de référence étudiés en amont (GitHub pour du code applicatif, GitLab pour un dépôt institutionnel) |
| Gestion de projet | **GitHub Projects** (kanban lié aux issues) ou Trello | Léger, suffisant pour une équipe de 3 sur 3 semaines, évite la sur-ingénierie d'un outil de gestion de projet trop lourd (Jira) |
| Design / maquettes | **Figma** (import initial via plugin `html.to.design` depuis le prototype HTML, cf. `03-design-system/charte-graphique.md` §6) | Standard du marché, collaboration temps réel entre les 3 membres cross-villes |
| Communication d'équipe | Discord/Slack (canal dédié) | Équipe cross-villes, besoin de communication asynchrone fiable |
| Documentation | Markdown versionné dans le dépôt Git (ce dossier) | Une seule source de vérité, versionnée avec le reste du projet, pas de document Word dispersé |

## Convention de versioning Git

- **Branches :** `main` (toujours démontrable), `feature/<sujet>` pour chaque livrable en cours (ex. `feature/wireframes-predict`).
- **Commits :** préfixés par type (`docs:`, `feat:`, `fix:`, `design:`) suivi d'une description courte à l'impératif, ex. `design: ajoute le prototype haute-fidelite Predict`.
- **Revue :** toute fusion vers `main` passe par une pull request relue par au moins un autre membre (même en équipe de 3), pour garantir une trace de collaboration réelle exploitable en soutenance — contrairement à un historique mono-commit.
- **Historique propre :** cette exigence de traçabilité est une leçon tirée explicitement de l'analyse du projet d'un autre élève, dont le dépôt ne comportait qu'un seul commit ("after soutenance"), ne permettant pas de démontrer le travail collaboratif attendu.

## Structure du dépôt de rendu

```
scoolize-epigency/
├── 01-recherche-ux/           # Semaine 1
├── 02-vision-besoins/         # Semaine 2
├── 03-design-system/          # Charte graphique
├── 04-maquettes/
│   ├── wireframes-lowfi/      # Semaine 2
│   └── prototype-hifi/        # Semaine 3
├── 05-conformite-juridique/
├── 06-conduite-du-changement/
├── 07-gestion-de-projet/
└── 08-soutenance/
```
