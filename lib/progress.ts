/**
 * Suivi de la progression de révision, stocké en localStorage.
 *
 * Pas de backend pour le MVP : on persiste simplement les identifiants des
 * cartes « maîtrisées » et « à revoir » sous la clé `tssrev_progress`.
 */

const STORAGE_KEY = "tssrev_progress";

/** État de progression persisté. */
export interface ProgressState {
  /** IDs des cartes marquées « Maîtrisé ». */
  mastered: string[];
  /** IDs des cartes marquées « À revoir ». */
  toReview: string[];
}

const EMPTY_STATE: ProgressState = { mastered: [], toReview: [] };

/** Charge l'état de progression (renvoie un état vide côté serveur). */
export function loadProgress(): ProgressState {
  if (typeof window === "undefined") return { ...EMPTY_STATE };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...EMPTY_STATE };
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    return {
      mastered: parsed.mastered ?? [],
      toReview: parsed.toReview ?? [],
    };
  } catch {
    return { ...EMPTY_STATE };
  }
}

/** Persiste l'état de progression. */
export function saveProgress(state: ProgressState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* quota dépassé ou stockage indisponible : on ignore silencieusement */
  }
}

/** Déplace une carte dans une liste en la retirant de l'autre, puis persiste. */
function setCardStatus(cardId: string, status: "mastered" | "toReview"): ProgressState {
  const state = loadProgress();
  const next: ProgressState = {
    mastered: state.mastered.filter((id) => id !== cardId),
    toReview: state.toReview.filter((id) => id !== cardId),
  };
  next[status] = [...next[status], cardId];
  saveProgress(next);
  return next;
}

/** Marque une carte comme « Maîtrisé ». */
export function markMastered(cardId: string): ProgressState {
  return setCardStatus(cardId, "mastered");
}

/** Marque une carte comme « À revoir ». */
export function markToReview(cardId: string): ProgressState {
  return setCardStatus(cardId, "toReview");
}

/** Réinitialise toute la progression. */
export function resetProgress(): ProgressState {
  saveProgress({ ...EMPTY_STATE });
  return { ...EMPTY_STATE };
}

/**
 * Progression d'un module en pourcentage (cartes maîtrisées / total).
 * Renvoie 0 si le module n'a aucune carte.
 */
export function getModuleProgress(
  cardIds: string[],
  state: ProgressState = loadProgress(),
): number {
  if (cardIds.length === 0) return 0;
  const mastered = cardIds.filter((id) => state.mastered.includes(id)).length;
  return Math.round((mastered / cardIds.length) * 100);
}
