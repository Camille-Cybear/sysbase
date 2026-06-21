"use client";

import { useEffect, useMemo, useState } from "react";
import { X, Eye, EyeOff, Check, RotateCcw, Trophy } from "lucide-react";
import type { Flashcard } from "@/lib/types";
import { loadProgress, markMastered, markToReview } from "@/lib/progress";
import { prioritizeFlashcards, filterToReview } from "@/lib/flashcards";
import { RichText } from "@/components/RichText";

export interface FlashCardSessionProps {
  /** Cartes candidates (un module, ou toutes les cartes en mode « à revoir »). */
  cards: Flashcard[];
  /** Nom affiché en en-tête / écran de fin. */
  moduleName: string;
  /**
   * « module » : toutes les cartes, priorité aux « à revoir ».
   * « review » : uniquement les cartes actuellement marquées « à revoir ».
   */
  mode?: "module" | "review";
}

type Result = "mastered" | "toReview";

/**
 * Session de révision : navigation carte par carte, révélation de la réponse,
 * marquage Maîtrisé / À revoir (persisté en localStorage), score final et rejeu.
 *
 * L'ordre des cartes est calculé au montage depuis le localStorage (révision
 * intelligente) ; un état `ready` évite tout décalage d'hydratation.
 */
export function FlashCardSession({
  cards,
  moduleName,
  mode = "module",
}: FlashCardSessionProps) {
  /** Deck de référence de la session (après priorisation / filtrage). */
  const [baseDeck, setBaseDeck] = useState<Flashcard[]>([]);
  /** Deck courant (peut être réduit aux cartes ratées lors d'un rejeu). */
  const [deck, setDeck] = useState<Flashcard[]>([]);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [results, setResults] = useState<Record<string, Result>>({});
  const [ready, setReady] = useState(false);

  // Calcule l'ordre/filtre depuis le localStorage, une fois monté côté client.
  useEffect(() => {
    const state = loadProgress();
    const ordered =
      mode === "review"
        ? filterToReview(cards, state)
        : prioritizeFlashcards(cards, state);
    setBaseDeck(ordered);
    setDeck(ordered);
    setReady(true);
  }, [cards, mode]);

  const finished = ready && index >= deck.length;
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

  // --- Préparation (avant lecture du localStorage) ---
  if (!ready) {
    return (
      <div className="rounded-xl border border-border bg-card p-10 text-center text-muted">
        Préparation de la session…
      </div>
    );
  }

  // --- État vide ---
  if (baseDeck.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-10 text-center text-muted">
        {mode === "review"
          ? "Aucune carte à revoir — tout est à jour. 🎉"
          : "Aucune flashcard disponible pour ce module pour l'instant."}
      </div>
    );
  }

  // --- Écran de fin ---
  if (finished) {
    const total = deck.length;
    const score = Math.round((masteredCount / total) * 100);
    const failed = baseDeck.filter((c) => toReviewIds.includes(c.id));

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
            onClick={() => restart(baseDeck)}
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
