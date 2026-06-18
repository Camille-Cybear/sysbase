import type { ModuleSlug } from "@/data/modules";

/** Niveau de difficulté d'une carte ou d'une fiche. */
export type Difficulty = "easy" | "medium" | "hard";

/** Une flashcard de révision (recto = question, verso = réponse). */
export interface Flashcard {
  /** Identifiant unique, format `[prefix]-[numéro]` (ex. `net-001`). */
  id: string;
  /** Module auquel la carte appartient. */
  module: ModuleSlug;
  /** Thème de la carte (ex. "VLAN"). */
  theme: string;
  /** Question affichée au recto. */
  question: string;
  /** Réponse affichée au verso (peut contenir du Markdown). */
  answer: string;
  /** Tags de recherche et de filtrage. */
  tags: string[];
  /** Difficulté de la carte. */
  difficulty: Difficulty;
}

/** Une question de quiz QCM. */
export interface QuizQuestion {
  /** Identifiant unique (ex. `q-net-001`). */
  id: string;
  /** Module auquel la question appartient. */
  module: ModuleSlug;
  /** Énoncé de la question. */
  question: string;
  /** Options de réponse proposées. */
  options: string[];
  /** Index de l'option correcte dans `options`. */
  correct: number;
  /** Explication affichée après réponse. */
  explanation: string;
  /** Tags de recherche et de filtrage. */
  tags: string[];
}
