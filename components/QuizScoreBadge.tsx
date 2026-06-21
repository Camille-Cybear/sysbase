"use client";

import { useEffect, useState } from "react";
import { Award } from "lucide-react";
import { getBestScore, scorePercent } from "@/lib/quizScores";

export interface QuizScoreBadgeProps {
  /** Slug du module dont on affiche le meilleur score. */
  moduleSlug: string;
  /** Variante d'affichage : badge (par défaut) ou texte discret. */
  variant?: "badge" | "inline";
}

/**
 * Affiche le meilleur score de quiz d'un module (localStorage).
 * N'affiche rien tant qu'aucun essai n'a été enregistré.
 */
export function QuizScoreBadge({ moduleSlug, variant = "badge" }: QuizScoreBadgeProps) {
  const [percent, setPercent] = useState<number | null>(null);

  useEffect(() => {
    const best = getBestScore(moduleSlug);
    setPercent(best ? scorePercent(best) : null);
  }, [moduleSlug]);

  if (percent === null) return null;

  if (variant === "inline") {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-muted">
        <Award className="h-3.5 w-3.5" aria-hidden="true" />
        Meilleur : {percent}%
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
      <Award className="h-3.5 w-3.5" aria-hidden="true" />
      Meilleur : {percent}%
    </span>
  );
}
