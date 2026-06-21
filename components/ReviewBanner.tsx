"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RotateCcw, ArrowRight } from "lucide-react";
import { loadProgress } from "@/lib/progress";

export interface ReviewBannerProps {
  /** IDs de toutes les flashcards existantes (pour ne compter que les valides). */
  allCardIds: string[];
}

/**
 * Invite à réviser les cartes marquées « à revoir » (révision intelligente).
 * N'affiche rien tant qu'il n'y a aucune carte à revoir.
 */
export function ReviewBanner({ allCardIds }: ReviewBannerProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const ids = new Set(allCardIds);
    const { toReview } = loadProgress();
    setCount(toReview.filter((id) => ids.has(id)).length);
  }, [allCardIds]);

  if (count === 0) return null;

  return (
    <Link
      href="/flashcards?mode=review"
      className="mb-6 flex items-center gap-3 rounded-xl border border-primary-mid/40 bg-primary/10 p-4 transition hover:bg-primary/15"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary">
        <RotateCcw className="h-[18px] w-[18px]" aria-hidden="true" />
      </span>
      <span className="flex-1">
        <span className="block text-sm font-medium text-text">
          {count} carte{count > 1 ? "s" : ""} à revoir
        </span>
        <span className="block text-xs text-muted">
          Reprends là où ça coince, tous modules confondus.
        </span>
      </span>
      <span className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary">
        Réviser
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </span>
    </Link>
  );
}
