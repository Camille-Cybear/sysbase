"use client";

import { useState } from "react";
import { X, Eye, EyeOff, Check } from "lucide-react";
import type { Flashcard } from "@/lib/types";
import { markMastered, markToReview } from "@/lib/progress";
import { RichText } from "@/components/RichText";

export interface DailyFlashcardProps {
  /** Carte à réviser. */
  card: Flashcard;
  /** Position de la carte dans la session (ex. 12). */
  index?: number;
  /** Nombre total de cartes de la session (ex. 34). */
  total?: number;
}

/**
 * Carte « Flashcard du jour » avec révélation de la réponse et les 3 actions
 * (À revoir / Voir réponse / Maîtrisé). Le résultat est persisté en localStorage.
 */
export function DailyFlashcard({ card, index = 1, total = 1 }: DailyFlashcardProps) {
  const [revealed, setRevealed] = useState(false);
  const [answered, setAnswered] = useState<"mastered" | "toReview" | null>(null);

  function answer(result: "mastered" | "toReview") {
    if (result === "mastered") markMastered(card.id);
    else markToReview(card.id);
    setAnswered(result);
  }

  return (
    <div className="rounded-xl border border-border bg-card p-[18px]">
      <div className="mb-3.5 flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-wide text-muted">
          {revealed ? "Réponse" : "Question"}
        </span>
        <span className="text-[11px] text-muted">
          {index} / {total}
        </span>
      </div>

      <div className="mb-3 flex min-h-20 items-center justify-center rounded-md border border-border bg-bg p-5 text-center">
        <p className="text-sm leading-relaxed text-text">
          <RichText>{revealed ? card.answer : card.question}</RichText>
        </p>
      </div>

      {answered ? (
        <p
          className={`text-center text-xs ${
            answered === "mastered" ? "text-emerald-300" : "text-red-300"
          }`}
          role="status"
        >
          {answered === "mastered"
            ? "✓ Marquée comme maîtrisée"
            : "À revoir — ajoutée à ta pile de révision"}
        </p>
      ) : (
        <div className="flex justify-center gap-2">
          <button
            type="button"
            onClick={() => answer("toReview")}
            className="inline-flex items-center gap-1.5 rounded-md border border-red-500/40 bg-red-500/10 px-4 py-1.5 text-xs text-red-300 transition hover:bg-red-500/20"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />À revoir
          </button>
          <button
            type="button"
            onClick={() => setRevealed((v) => !v)}
            aria-pressed={revealed}
            className="inline-flex items-center gap-1.5 rounded-md border border-primary-mid/50 bg-primary/15 px-4 py-1.5 text-xs text-primary transition hover:bg-primary/25"
          >
            {revealed ? (
              <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <Eye className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            {revealed ? "Masquer" : "Voir réponse"}
          </button>
          <button
            type="button"
            onClick={() => answer("mastered")}
            className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-4 py-1.5 text-xs text-emerald-300 transition hover:bg-emerald-500/20"
          >
            <Check className="h-3.5 w-3.5" aria-hidden="true" />
            Maîtrisé
          </button>
        </div>
      )}
    </div>
  );
}
