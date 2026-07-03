# Charte graphique — Scoolize (Prepare & Predict)

Système de design unique, décliné en deux thèmes légers pour marquer la différence de posture entre les deux produits tout en gardant une cohérence de marque forte (crédibilité institutionnelle).

## 1. Principes directeurs

- **Sobre et institutionnel** avant d'être "startup" : le commanditaire est un ministère, la confiance prime sur l'effet de mode.
- **Accessible par défaut** : contraste AA minimum partout, cible AAA sur le texte courant, tailles de police ≥ 16px, cibles tactiles ≥ 44×44px, navigation clavier complète.
- **Deux tons, un seul système** : Prepare (formations) est plus formel/institutionnel ; Predict (candidats) est plus chaleureux/encourageant. Même grille, mêmes composants, seule la couleur d'accent et le ton rédactionnel changent.

## 2. Couleurs

### Fondation commune (neutres)
| Rôle | Token | Hex | Usage |
|---|---|---|---|
| Texte principal | `--ink-900` | `#0F172A` | Titres, texte fort |
| Texte secondaire | `--ink-700` | `#334155` | Paragraphes |
| Texte tertiaire | `--ink-500` | `#64748B` | Légendes, aide |
| Fond page | `--surface-0` | `#F8FAFC` | Arrière-plan général |
| Fond carte | `--surface-1` | `#FFFFFF` | Cartes, panneaux |
| Bordure | `--border-1` | `#E2E8F0` | Séparateurs, contours |

### Sémantique (partagée)
| Rôle | Token | Hex |
|---|---|---|
| Succès / éligible | `--success` | `#16A34A` |
| Attention / à renforcer | `--warning` | `#D97706` |
| Erreur / non éligible | `--danger` | `#DC2626` |
| Information | `--info` | `#0369A1` |

### Accent Prepare (institutions) — registre "confiance officielle"
| Rôle | Token | Hex |
|---|---|---|
| Accent principal | `--prepare-600` | `#0F3D91` |
| Accent hover | `--prepare-700` | `#0B2E6E` |
| Accent clair (fonds) | `--prepare-100` | `#DCE6F7` |

### Accent Predict (candidats) — registre "confiance encourageante"
| Rôle | Token | Hex |
|---|---|---|
| Accent principal | `--predict-600` | `#0D9488` |
| Accent hover | `--predict-700` | `#0B7A70` |
| Accent clair (fonds) | `--predict-100` | `#D8F2EE` |
| Accent chaleur (progression) | `--predict-amber` | `#F59E0B` |

**Justification :** le bleu institutionnel (`Prepare`) évoque la fiabilité administrative (proche des chartes de l'État) ; le teal (`Predict`) est associé à la croissance et à l'accompagnement sans tomber dans un registre enfantin, tout en restant AA sur fond blanc (ratio ≥ 4.6:1 pour le texte sur `--predict-600`).

## 3. Typographie

- **Titres :** [Lexend](https://fonts.google.com/specimen/Lexend) — police conçue pour améliorer la fluidité de lecture, particulièrement pertinente pour un public scolaire incluant des troubles dys-, argument fort en soutenance sur l'accessibilité.
- **Texte courant :** [Source Sans 3](https://fonts.google.com/specimen/Source+Sans+3) — excellente lisibilité à petite taille, économe visuellement à côté d'un titre expressif.
- **Échelle :** 14 / 16 / 18 / 24 / 32 / 40 px, ratio ~1.25, line-height 1.5 (texte) à 1.2 (titres).

## 4. Composants clés (communs, déclinés par accent)

- Boutons (primaire, secondaire, tertiaire/texte), champs de formulaire, cases à cocher personnalisées, badges de statut (éligible / à renforcer / non éligible), barres de progression de compétence, cartes formation, jauge de score de correspondance, navigation par onglets, fil d'Ariane (breadcrumb).
- Rayon de bordure : 8px (cartes), 6px (champs/boutons) — angles doux mais pas arrondis à l'excès (garde le sérieux institutionnel).
- Ombres légères uniquement (`0 1px 2px rgba(15,23,42,.06)`), pas d'effets de glassmorphism ni de dégradés flashy (cohérent avec le style "Accessible & Ethical" retenu pour un produit gouvernemental).

## 5. Implémentation

Les tokens ci-dessus sont codés dans [`assets/css/tokens.css`](../04-maquettes/prototype-hifi/assets/css/tokens.css) et consommés par [`assets/css/base.css`](../04-maquettes/prototype-hifi/assets/css/base.css). Le thème s'active via une classe sur `<body>` : `theme-prepare` ou `theme-predict`.

## 6. De l'HTML vers Figma

Le prototype haute-fidélité (`04-maquettes/prototype-hifi/`) est volontairement construit en HTML/CSS structuré et sémantique (sections, composants nommés, classes explicites) pour permettre un import propre dans Figma via le plugin **[html.to.design](https://www.figma.com/community/plugin/1159123024924461424)** :

1. Ouvrir chaque page HTML du prototype dans Chrome.
2. Dans Figma, lancer le plugin `html.to.design` → "Import from active browser tab" (ou coller l'URL locale).
3. Les calques, couleurs et texte sont importés en éléments Figma éditables, organisés par la structure HTML (header, nav, card, etc.).
4. Appliquer les styles de couleur/texte du fichier `tokens.css` comme **Styles Figma** pour que l'équipe puisse ensuite itérer nativement dans Figma.

Cette méthode garantit un fichier Figma réel, éditable par toute l'équipe, sans dépendre d'un accès Figma pour la phase de conception initiale.
