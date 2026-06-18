# TSSRev — Site de révision TSSR

Application web de révision pour la certification **TSSR** (Technicien Supérieur Systèmes et Réseaux) : fiches tuto, flashcards et quiz QCM, dans une interface dark mode moderne et responsive.

🔗 **Démo** : _(à compléter après déploiement Vercel)_

## Fonctionnalités

- **Dashboard** — grille des 6 modules avec progression réelle par module
- **Flashcards** — sessions de révision recto/verso, score, rejeu des cartes ratées, suivi en `localStorage`
- **Fiches tuto** — contenu MDX avec coloration syntaxique (Shiki) et tableaux (GFM)
- **Quiz QCM** — feedback immédiat, explications, score final
- **Recherche** — full-text côté client (Fuse.js) sur les flashcards

## Stack

- [Next.js 14](https://nextjs.org/) (App Router) · React 18 · TypeScript strict
- [Tailwind CSS](https://tailwindcss.com/) v3
- [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote) + [Shiki](https://shiki.style/) pour les fiches
- [Fuse.js](https://fusejs.io/) pour la recherche · [Lucide](https://lucide.dev/) pour les icônes
- Police [Geist](https://vercel.com/font)

## Démarrage

```bash
npm install
npm run dev      # http://localhost:3000
```

## Scripts

```bash
npm run dev      # serveur de développement
npm run build    # build de production
npm run start    # serveur de production
npm run lint     # ESLint
```

## Structure

```
app/         routes (App Router) : dashboard, modules, fiches, flashcards, quiz, recherche
components/  composants UI (sidebar, topbar, cartes, moteurs flashcard/quiz)
content/     fiches tuto au format MDX, par module
data/        modules, flashcards (JSON) et quiz (JSON)
lib/         helpers (mdx, flashcards, quiz, recherche, progression)
```

## Ajouter du contenu

- **Flashcard** : ajouter une entrée dans `data/flashcards/<module>.json`
- **Quiz** : ajouter une question dans `data/quiz/<module>.json`
- **Fiche** : créer un `.mdx` dans `content/<module>/` avec son frontmatter

---

Projet développé dans le cadre d'une reconversion vers la cybersécurité.
