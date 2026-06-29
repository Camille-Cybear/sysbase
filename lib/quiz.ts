import type { QuizQuestion } from "@/lib/types";
import type { ModuleSlug } from "@/data/modules";
import reseauxQuiz from "@/data/quiz/reseaux.json";
import securiteQuiz from "@/data/quiz/securite.json";
import adQuiz from "@/data/quiz/active-directory.json";
import linuxQuiz from "@/data/quiz/linux.json";

/**
 * Banques de questions par module.
 *
 * Seuls les modules disposant d'un fichier JSON sont listés ; les autres
 * seront ajoutés au fur et à mesure.
 */
const QUIZ_BY_MODULE: Partial<Record<ModuleSlug, QuizQuestion[]>> = {
  reseaux: reseauxQuiz as QuizQuestion[],
  securite: securiteQuiz as QuizQuestion[],
  "active-directory": adQuiz as QuizQuestion[],
  linux: linuxQuiz as QuizQuestion[],
};

/** Retourne les questions d'un module (tableau vide si aucun contenu). */
export function getQuiz(module: ModuleSlug): QuizQuestion[] {
  return QUIZ_BY_MODULE[module] ?? [];
}

/** Retourne toutes les questions de quiz, tous modules confondus. */
export function getAllQuizQuestions(): QuizQuestion[] {
  return Object.values(QUIZ_BY_MODULE).flat();
}
