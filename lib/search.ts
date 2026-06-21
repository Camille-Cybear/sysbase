import Fuse from "fuse.js";
import { getAllFlashcards } from "@/lib/flashcards";
import { getModule, type ModuleSlug } from "@/data/modules";

/** Élément indexable et affichable dans les résultats de recherche. */
export interface SearchItem {
  /** Identifiant unique de la source. */
  id: string;
  /** Type de contenu. */
  type: "flashcard" | "fiche";
  /** Module d'appartenance. */
  module: ModuleSlug;
  /** Nom affiché du module. */
  moduleName: string;
  /** Couleur d'accent du module. */
  moduleColor: string;
  /** Thème de l'élément. */
  theme: string;
  /** Titre principal (question d'une flashcard, ou titre de la fiche). */
  title: string;
  /** Extrait affiché (réponse d'une flashcard, ou début de la fiche). */
  excerpt: string;
  /** Texte complet indexé (réponse, ou corps entier de la fiche). */
  content: string;
  /** Tags associés. */
  tags: string[];
  /** Lien de destination. */
  href: string;
}

/**
 * Éléments de recherche issus des flashcards.
 *
 * Client-safe (les flashcards sont des imports JSON). Les fiches, qui
 * nécessitent un accès disque, sont construites côté serveur dans `lib/mdx`.
 */
export function getFlashcardSearchItems(): SearchItem[] {
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
      content: card.answer,
      tags: card.tags,
      href: `/modules/${card.module}`,
    };
  });
}

/** Construit un index Fuse à partir d'une liste d'éléments de recherche. */
export function createSearchIndex(items: SearchItem[]): Fuse<SearchItem> {
  return new Fuse(items, {
    keys: [
      { name: "title", weight: 0.5 },
      { name: "theme", weight: 0.2 },
      { name: "tags", weight: 0.2 },
      { name: "content", weight: 0.1 },
    ],
    threshold: 0.4,
    ignoreLocation: true,
    minMatchCharLength: 2,
  });
}
