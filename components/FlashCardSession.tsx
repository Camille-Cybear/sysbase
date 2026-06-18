"use client";

import { useMemo, useState } from "react";
import { X, Eye, EyeOff, Check, RotateCcw, Trophy } from "lucide-react";
import type { Flashcard } from "@/lib/types";
import { markMastered, markToReview } from "@/lib/progress";
import { RichText } from "@/components/RichText";

export interface FlashCardSessionProps {
  /** Cartes à réviser dans la session. */
  cards: Flashcard[];
  /** Nom du module révisé (affiché en en-tête). */
  moduleName: string;
}

type Result = "mastered" | "toReview";

/**
 * Session de révision complète : navigation carte par carte, révélation de la
 * réponse, marquage Maîtrisé / À revoir (persisté en localStorage), score final
 * et possibilité de rejouer uniquement les cartes ratées.
 */
export function FlashCardSession({ cards, moduleName }: FlashCardSessionProps) {
  /** Deck courant (peut être réduit aux cartes ratées lors d'un rejeu). */
  const [deck, setDeck] = useState<Flashcard[]>(cards);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  /** Résultat enregistré par carte pour la session en cours. */
  const [results, setResults] = useState<Record<string, Result>>({});

  const finished = index >= deck.length;
  const current = deck[index];

  const masteredCount = useMemo(
    () => Object.values(results).filter((r) => r === "mastered").length,
    [results],
  );
  const toReviewIds = useMemo(
    () =>
      Object.entries(results)
        .filter(([, r]) => r === "toReview")
        .map(([id]) => id),
    [results],
  );

  function answer(result: Result) {
    if (!current) return;
    if (result === "mastered") markMastered(current.id);
    else markToReview(current.id);
    setResults((prev) => ({ ...prev, [current.id]: result }));
    setRevealed(false);
    setIndex((i) => i + 1);
  }

  function restart(nextCards: Flashcard[]) {
    setDeck(nextCards);
    setIndex(0);
    setRevealed(false);
    setResults({});
  }

  // --- État vide ---
  if (cards.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-10 text-center text-muted">
        Aucune flashcard disponible pour ce module pour l&apos;instant.
      </div>
    );
  }

  // --- Écran de fin ---
  if (finished) {
    const total = deck.length;
    const score = Math.round((masteredCount / total) * 100);
    const failed = cards.filter((c) => toReviewIds.includes(c.id));

    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
          <Trophy className="h-6 w-6" aria-hidden="true" />
        </span>
        <h2 className="text-lg font-medium">Session terminée</h2>
        <p className="mt-1 text-sm text-muted">
          {moduleName} — {masteredCount} / {total} cartes maîtrisées ({score}%)
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {failed.length > 0 && (
            <button
              type="button"
              onClick={() => restart(failed)}
              className="inline-flex items-center gap-1.5 rounded-md border border-primary-mid/50 bg-primary/15 px-4 py-2 text-sm text-primary transition hover:bg-primary/25"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Revoir les {failed.length} ratées
            </button>
          )}
          <button
            type="button"
            onClick={() => restart(cards)}
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-4 py-2 text-sm text-muted transition hover:text-text"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Recommencer
          </button>
        </div>
      </div>
    );
  }

  // --- Session en cours ---
  const progress = Math.round((index / deck.length) * 100);

  return (
    <div className="rounded-xl border border-border bg-card p-[18px]">
      {/* Barre de progression de session */}
      <div className="mb-4 h-1 overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mb-3.5 flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-wide text-muted">
          {current?.theme ?? (revealed ? "Réponse" : "Question")}
        </span>
        <span className="text-[11px] text-muted">
          {index + 1} / {deck.length}
        </span>
      </div>

      <div className="mb-3 flex min-h-28 items-center justify-center rounded-md border border-border bg-bg p-6 text-center">
        <p className="text-sm leading-relaxed text-text">
          <RichText>{(revealed ? current?.answer : current?.question) ?? ""}</RichText>
        </p>
      </div>

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
    </div>
  );
}
