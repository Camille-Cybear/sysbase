import Fuse from "fuse.js";
import { getAllFlashcards } from "@/lib/flashcards";
import { getModule, type ModuleSlug } from "@/data/modules";

/** Élément indexable et affichable dans les résultats de recherche. */
export interface SearchItem {
  /** Identifiant de la source (ex. id de flashcard). */
  id: string;
  /** Type de contenu (extensible aux fiches/quiz plus tard). */
  type: "flashcard";
  /** Module d'appartenance. */
  module: ModuleSlug;
  /** Nom affiché du module. */
  moduleName: string;
  /** Couleur d'accent du module. */
  moduleColor: string;
  /** Thème de l'élément. */
  theme: string;
  /** Titre principal (la question, pour une flashcard). */
  title: string;
  /** Extrait (la réponse, pour une flashcard). */
  excerpt: string;
  /** Tags associés. */
  tags: string[];
  /** Lien de destination. */
  href: string;
}

/** Construit la liste des éléments indexables à partir du contenu disponible. */
function buildItems(): SearchItem[] {
  return getAllFlashcards().map((card) => {
    const mod = getModule(card.module);
    return {
      id: card.id,
      type: "flashcard",
      module: card.module,
      moduleName: mod?.name ?? card.module,
      moduleColor: mod?.color ?? "#7B6FD4",
      theme: card.theme,
      title: card.question,
      excerpt: card.answer,
      tags: card.tags,
      href: `/modules/${card.module}`,
    };
  });
}

const items = buildItems();

const fuse = new Fuse(items, {
  keys: [
    { name: "title", weight: 0.5 },
    { name: "theme", weight: 0.2 },
    { name: "tags", weight: 0.2 },
    { name: "excerpt", weight: 0.1 },
  ],
  threshold: 0.4,
  ignoreLocation: true,
  minMatchCharLength: 2,
});

/** Recherche full-text ; renvoie [] pour une requête trop courte. */
export function search(query: string): SearchItem[] {
  const q = query.trim();
  if (q.length < 2) return [];
  return fuse.search(q).map((result) => result.item);
}
