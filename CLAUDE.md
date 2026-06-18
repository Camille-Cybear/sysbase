# TSSRev — Site de révision TSSR

## Vision du projet

Site public de révision pour la certification TSSR (Technicien Supérieur Systèmes et Réseaux).
Public cible : étudiants TSSR, autodidactes en sysadmin, reconversion IT.
Objectif : remplacer les sites vieillissants (admingo, tutotech) par une expérience moderne, rapide et mobile-friendly.

---

## Stack technique

- **Framework** : Next.js 14 (App Router)
- **Style** : Tailwind CSS v3
- **Contenu** : MDX via `next-mdx-remote` (fiches tuto) + JSON (flashcards, quiz)
- **Recherche** : Fuse.js (recherche full-text côté client)
- **Déploiement** : Vercel (gratuit, auto-deploy sur push main)
- **Typo** : Geist Sans (déjà inclus dans Next.js 14)
- **Icônes** : Lucide React

## Palette de couleurs

```
--primary:       #534AB7   (violet principal)
--primary-light: #EEEDFE   (fond violet clair)
--primary-mid:   #AFA9EC   (violet moyen, bordures actives)
--surface:       #FAFAFA   (fond général)
--card:          #FFFFFF   (fond cartes)
--text:          #1A1A1A   (texte principal)
--muted:         #6B7280   (texte secondaire)
--border:        #E5E7EB   (bordures)
```

Couleurs par module :
- Réseaux → violet `#534AB7`
- Active Directory → vert `#1D9E75`
- Linux → orange `#D85A30`
- Sécurité → ambre `#BA7517`
- Virtualisation → vert `#1D9E75`
- Scripting → violet `#534AB7`

---

## Structure des dossiers

```
tssrev/
├── app/
│   ├── layout.tsx              ← layout global + sidebar
│   ├── page.tsx                ← dashboard (modules + flashcard du jour)
│   ├── modules/
│   │   └── [slug]/page.tsx     ← liste des fiches d'un module
│   ├── fiches/
│   │   └── [module]/[slug]/page.tsx  ← fiche tuto individuelle (MDX)
│   ├── flashcards/
│   │   └── page.tsx            ← mode révision flashcards
│   ├── quiz/
│   │   └── [module]/page.tsx   ← quiz QCM par module
│   └── recherche/
│       └── page.tsx            ← résultats de recherche
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   └── TopBar.tsx
│   ├── FlashCard.tsx           ← carte flip recto/verso avec animation CSS
│   ├── FlashCardSession.tsx    ← session complète avec score + navigation
│   ├── QuizEngine.tsx          ← moteur QCM (question, options, feedback)
│   ├── ProgressBar.tsx         ← barre de progression par module
│   ├── SearchBar.tsx           ← recherche Fuse.js
│   ├── ModuleCard.tsx          ← carte module sur le dashboard
│   └── MDXComponents.tsx       ← composants custom pour le MDX
├── content/
│   ├── reseaux/                ← fichiers .mdx
│   ├── active-directory/
│   ├── linux/
│   ├── securite/
│   ├── virtualisation/
│   └── scripting/
├── data/
│   ├── flashcards/
│   │   ├── reseaux.json
│   │   ├── active-directory.json
│   │   ├── linux.json
│   │   ├── securite.json
│   │   ├── virtualisation.json
│   │   └── scripting.json
│   ├── quiz/
│   │   └── [module].json
│   └── modules.ts              ← metadata des modules (nom, couleur, icône, slug)
├── lib/
│   ├── mdx.ts                  ← helpers lecture MDX
│   ├── flashcards.ts           ← helpers flashcards + score
│   ├── progress.ts             ← localStorage : suivi progression user
│   └── search.ts               ← index Fuse.js
├── public/
└── CLAUDE.md
```

---

## Formats de données

### Flashcard (data/flashcards/[module].json)

```json
[
  {
    "id": "net-001",
    "module": "reseaux",
    "theme": "VLAN",
    "question": "Quelle est la différence entre un trunk port et un access port ?",
    "answer": "Un **access port** appartient à un seul VLAN et transmet les trames sans tag. Un **trunk port** transporte plusieurs VLANs simultanément en taguant les trames avec 802.1Q.",
    "tags": ["VLAN", "switching", "802.1Q"],
    "difficulty": "medium"
  }
]
```

### Quiz QCM (data/quiz/[module].json)

```json
[
  {
    "id": "q-net-001",
    "module": "reseaux",
    "question": "Sur quel modèle repose le protocole TCP/IP ?",
    "options": ["Modèle OSI à 7 couches", "Modèle DoD à 4 couches", "Modèle IEEE à 5 couches", "Modèle RFC à 3 couches"],
    "correct": 1,
    "explanation": "TCP/IP repose sur le modèle DoD (Department of Defense) à 4 couches : Accès réseau, Internet, Transport, Application.",
    "tags": ["TCP/IP", "modèles"]
  }
]
```

### Fiche MDX (content/[module]/[slug].mdx)

```mdx
---
title: "Les VLANs — concepts et configuration"
module: "reseaux"
theme: "VLAN"
difficulty: "medium"
tags: ["VLAN", "switching", "802.1Q", "trunk"]
updatedAt: "2025-06-01"
---

# Les VLANs

Contenu de la fiche...
```

---

## Fonctionnalités à implémenter (par ordre de priorité)

### MVP (Phase 1)
- [ ] Layout global : sidebar + topbar + responsive mobile
- [ ] Dashboard : grille des 6 modules avec progression
- [ ] Flashcards : session recto/verso, boutons À revoir / Maîtrisé, score final
- [ ] Fiches tuto : rendu MDX avec syntaxe highlighting (Shiki)
- [ ] Barre de recherche : Fuse.js sur titre + tags + contenu

### Phase 2
- [ ] Quiz QCM : questions, feedback immédiat, score final par module
- [ ] Progression : localStorage pour tracker les flashcards maîtrisées
- [ ] Mode révision intelligent : priorité aux cartes "À revoir"

### Phase 3 (optionnel / après TSSR)
- [ ] Authentification légère (GitHub OAuth via NextAuth) pour sync progression
- [ ] Contributions communautaires (PR GitHub pour ajouter des fiches)
- [ ] Page "Examens blancs" (QCM complet toutes matières)

---

## Règles de développement

- **Langue** : interface en français, code en anglais (variables, fonctions, commentaires)
- **Composants** : fonctionnels uniquement, hooks React, pas de classes
- **Typage** : TypeScript strict, pas de `any`
- **Responsive** : mobile-first, breakpoints Tailwind standard (sm/md/lg)
- **Accessibilité** : aria-labels sur les boutons icônes, focus visible, contraste AA minimum
- **Performance** : images avec `next/image`, pas de librairies lourdes côté client
- **Progression** : stockée en localStorage (clé `tssrev_progress`), pas de backend pour le MVP

---

## Commandes utiles

```bash
npm run dev          # dev local sur http://localhost:3000
npm run build        # build de production
npm run lint         # ESLint
npx tsc --noEmit    # vérification TypeScript
```

---

## Conventions de nommage

- **Fichiers composants** : PascalCase (`FlashCard.tsx`)
- **Fichiers utilitaires** : camelCase (`flashcards.ts`)
- **Slugs de modules** : kebab-case (`active-directory`)
- **IDs flashcards** : `[module-prefix]-[numéro]` (`net-001`, `ad-012`)
- **Classes Tailwind** : directement dans le JSX, pas de CSS modules

---

## Notes contextuelles

Ce projet est développé par un étudiant TSSR en reconversion (ex-conseiller bancaire).
Il sert à la fois d'outil de révision personnel ET de projet portfolio pour une recherche d'alternance en cybersécurité (région PACA / AuRA).
Le contenu des fiches et flashcards est rédigé en parallèle du cours, directement depuis des notes Obsidian exportées en Markdown.
