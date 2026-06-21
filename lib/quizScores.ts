/**
 * Mémorisation des meilleurs scores de quiz, en localStorage.
 *
 * Pas de backend (MVP) : on garde le meilleur résultat par module sous la clé
 * `sysbase_quiz_scores`.
 */

const STORAGE_KEY = "sysbase_quiz_scores";

/** Meilleur score enregistré pour un module. */
export interface QuizScore {
  /** Nombre de bonnes réponses du meilleur essai. */
  bestCorrect: number;
  /** Nombre total de questions de ce meilleur essai. */
  total: number;
  /** Nombre d'essais réalisés. */
  attempts: number;
}

type Scores = Record<string, QuizScore>;

/** Charge tous les scores (objet vide côté serveur). */
export function loadQuizScores(): Scores {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Scores) : {};
  } catch {
    return {};
  }
}

function saveAll(scores: Scores): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
  } catch {
    /* stockage indisponible : on ignore */
  }
}

/** Meilleur score d'un module, ou `undefined` si jamais joué. */
export function getBestScore(module: string): QuizScore | undefined {
  return loadQuizScores()[module];
}

/** Pourcentage de réussite d'un score. */
export function scorePercent(score: QuizScore): number {
  return score.total > 0 ? Math.round((score.bestCorrect / score.total) * 100) : 0;
}

/**
 * Enregistre un résultat de quiz et met à jour le meilleur score.
 * Retourne le meilleur score résultant et si c'est un nouveau record.
 */
export function recordQuizScore(
  module: string,
  correct: number,
  total: number,
): { best: QuizScore; isRecord: boolean } {
  const scores = loadQuizScores();
  const prev = scores[module];
  const prevPct = prev && prev.total > 0 ? prev.bestCorrect / prev.total : -1;
  const newPct = total > 0 ? correct / total : 0;
  const isRecord = newPct > prevPct;

  const best: QuizScore = {
    bestCorrect: isRecord ? correct : prev?.bestCorrect ?? correct,
    total: isRecord ? total : prev?.total ?? total,
    attempts: (prev?.attempts ?? 0) + 1,
  };

  scores[module] = best;
  saveAll(scores);
  return { best, isRecord };
}
