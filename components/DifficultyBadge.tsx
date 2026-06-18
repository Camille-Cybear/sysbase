import type { Difficulty } from "@/lib/types";

const LABELS: Record<Difficulty, string> = {
  easy: "Facile",
  medium: "Intermédiaire",
  hard: "Avancé",
};

const CLASSES: Record<Difficulty, string> = {
  easy: "bg-emerald-500/10 text-emerald-300",
  medium: "bg-amber-500/10 text-amber-300",
  hard: "bg-red-500/10 text-red-300",
};

export interface DifficultyBadgeProps {
  difficulty: Difficulty;
}

/** Pastille de difficulté (Facile / Intermédiaire / Avancé). */
export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  return (
    <span
      className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${CLASSES[difficulty]}`}
    >
      {LABELS[difficulty]}
    </span>
  );
}
