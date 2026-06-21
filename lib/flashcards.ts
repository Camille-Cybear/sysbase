import type { Flashcard } from "@/lib/types";
import type { ModuleSlug } from "@/data/modules";
import reseauxCards from "@/data/flashcards/reseaux.json";
import securiteCards from "@/data/flashcards/securite.json";

/**
 * Jeux de flashcards par module.
 *
 * Seuls les modules disposant d'un fichier JSON sont listés ici ; les autres
 * seront ajoutés au fur et à mesure de la rédaction du contenu.
 */
const FLASHCARDS_BY_MODULE: Partial<Record<ModuleSlug, Flashcard[]>> = {
  reseaux: reseauxCards as Flashcard[],
  securite: securiteCards as Flashcard[],
};

/** Retourne les flashcards d'un module (tableau vide si aucun contenu). */
export function getFlashcards(module: ModuleSlug): Flashcard[] {
  return FLASHCARDS_BY_MODULE[module] ?? [];
}

/** Retourne toutes les flashcards, tous modules confondus. */
export function getAllFlashcards(): Flashcard[] {
  return Object.values(FLASHCARDS_BY_MODULE).flat();
}
