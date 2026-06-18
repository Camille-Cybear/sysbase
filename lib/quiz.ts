import type { QuizQuestion } from "@/lib/types";
import type { ModuleSlug } from "@/data/modules";
import reseauxQuiz from "@/data/quiz/reseaux.json";

/**
 * Banques de questions par module.
 *
 * Seuls les modules disposant d'un fichier JSON sont listés ; les autres
 * seront ajoutés au fur et à mesure.
 */
const QUIZ_BY_MODULE: Partial<Record<ModuleSlug, QuizQuestion[]>> = {
  reseaux: reseauxQuiz as QuizQuestion[],
};

/** Retourne les questions d'un module (tableau vide si aucun contenu). */
export function getQuiz(module: ModuleSlug): QuizQuestion[] {
  return QUIZ_BY_MODULE[module] ?? [];
}

/** Retourne toutes les questions de quiz, tous modules confondus. */
export function getAllQuizQuestions(): QuizQuestion[] {
  return Object.values(QUIZ_BY_MODULE).flat();
}
