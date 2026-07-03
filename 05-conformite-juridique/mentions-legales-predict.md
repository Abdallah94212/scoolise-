# Mentions légales & RGPD — Predict

**Objectif de ce document :** poser les bases de conformité à respecter dès la conception (privacy by design), en cohérence avec la compétence attendue *"Respecter la vie privée et la confidentialité des informations personnelles"* et *"Tenir compte des aspects juridiques d'un projet"*.

## 1. Nature des données traitées

| Catégorie | Exemple | Sensibilité |
|---|---|---|
| Identité | Nom, prénom, email, date de naissance | Donnée personnelle standard |
| Scolarité | Notes, moyennes, spécialités, appréciations | Donnée personnelle standard, mais **concernant potentiellement un mineur** (la majorité des candidats Parcoursup ont entre 17 et 18 ans) |
| Compétences déclarées | Stages, projets, certifications | Donnée personnelle standard, fournie volontairement |
| Contexte socio-économique | Boursier, zone géographique | Peut relever d'un traitement à encadrer strictement (proxy possible de l'origine sociale) |

Aucune donnée de santé, d'origine ethnique, d'opinion politique ou religieuse n'est collectée (catégories dites "sensibles" au sens de l'article 9 du RGPD) : le périmètre fonctionnel de Predict n'en nécessite aucune, et Prepare interdit techniquement leur usage comme critère (cf. `conformite-prepare.md` §2).

## 2. Base légale et minorité

- **Base légale retenue :** exécution d'une mission d'intérêt public (le service public de l'orientation et de l'affectation dans l'enseignement supérieur), au sens de l'article 6.1.e du RGPD — cohérent avec le fondement déjà mobilisé par Parcoursup.
- **Mineurs :** une large majorité des utilisateurs de Predict sont mineurs au moment de l'usage. Le traitement s'inscrit dans le cadre d'une mission de service public liée à la scolarité, ce qui ne requiert pas le consentement des titulaires de l'autorité parentale au sens strict de l'article 8 du RGPD (qui vise les services de la société de l'information proposés directement à l'enfant sur base du consentement) — mais une **information adaptée à un public mineur** (langage clair, cf. `lexique.html`) reste une exigence de bonne pratique et un point de vigilance à confirmer avec un juriste avant mise en production réelle.

## 3. Ce que Predict ne fait pas (limite volontaire du traitement automatisé)

Conformément à l'**article 22 du RGPD** (droit de ne pas faire l'objet d'une décision individuelle automatisée produisant des effets juridiques), **le score de correspondance affiché par Predict n'est jamais la décision d'admission** : il s'agit d'un indicateur d'aide à la décision côté candidat, affiché *avant* le dépôt du vœu. La décision d'admission reste de la responsabilité humaine de la commission d'examen des vœux (côté Prepare). Cette distinction doit être :
- explicite dans l'interface (cf. mention "score indicatif, ne garantit pas l'admission" sur `formation-detail.html`),
- rappelée dans les CGU du service.

## 4. Minimisation et durée de conservation

- Le bulletin scolaire importé n'est utilisé que pour alimenter le profil de compétences ; il n'est pas nécessaire de le conserver au-delà de la campagne d'orientation en cours (proposition : suppression automatique 12 mois après la fin de la procédure, sauf action explicite de l'utilisateur).
- Le candidat peut supprimer son bulletin et ses données à tout moment (cf. bandeau d'information sur `import-bulletin.html`), conformément au droit à l'effacement (art. 17 RGPD).

## 5. Droits des personnes

Droit d'accès, de rectification, d'effacement, de limitation, d'opposition et de portabilité, exerçables directement depuis l'espace "Mon profil". Un délégué à la protection des données (DPO) du Ministère est identifié comme point de contact (à désigner formellement en phase de production).

## 6. Hébergement

Compte tenu du caractère public/gouvernemental du service et du volume de données scolaires traitées, un hébergement chez un prestataire établi en France ou dans l'Union européenne, qualifié SecNumCloud ou équivalent, est recommandé — cohérent avec les pratiques déjà en vigueur pour Parcoursup.

## 7. Recommandation méthodologique

Une **analyse d'impact relative à la protection des données (AIPD/DPIA)** est recommandée avant le passage en phase de développement réel (semaine 4+, hors périmètre de ce jalon maquettes), compte tenu du volume de mineurs concernés et de la nature potentiellement discriminante d'un mauvais usage des données de contexte socio-économique. Ce point est un **livrable explicite à prévoir en semaine 4 ("Data & Technology")** selon le planning du kick-off.
