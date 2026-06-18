"use client";

import type { Flashcard } from "@/lib/types";

export interface FlashCardProps {
  /** Données de la carte à afficher. */
  card: Flashcard;
  /** Indique si le verso (réponse) est visible. */
  flipped?: boolean;
  /** Callback appelé quand l'utilisateur retourne la carte. */
  onFlip?: () => void;
}

/**
 * Carte de révision recto/verso avec animation de flip.
 *
 * TODO (MVP) : implémenter l'animation CSS 3D (recto = question,
 * verso = réponse rendue en Markdown).
 */
export function FlashCard({ card, flipped = false, onFlip }: FlashCardProps) {
  return (
    <article
      className="rounded-xl border border-border bg-card p-6 shadow-sm"
      aria-label={`Flashcard : ${card.theme}`}
    >
      {/* TODO: face recto/verso + animation flip */}
      <p className="text-sm text-muted">{card.theme}</p>
      <p className="mt-2 text-lg font-medium">
        {flipped ? card.answer : card.question}
      </p>
      <button
        type="button"
        onClick={onFlip}
        className="mt-4 text-sm font-medium text-primary"
      >
        Retourner
      </button>
    </article>
  );
}
