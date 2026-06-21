"use client";

import { useState } from "react";
import { Check, X, ArrowRight, RotateCcw, Trophy, Award } from "lucide-react";
import type { QuizQuestion } from "@/lib/types";
import { recordQuizScore, scorePercent, type QuizScore } from "@/lib/quizScores";
import { RichText } from "@/components/RichText";

export interface QuizEngineProps {
  /** Questions du quiz. */
  questions: QuizQuestion[];
  /** Slug du module (clé de sauvegarde du score). */
  moduleSlug: string;
  /** Nom du module (affiché à la fin). */
  moduleName: string;
}

/**
 * Moteur de QCM : une question à la fois, feedback immédiat (bonne/mauvaise
 * réponse + explication), puis score final (mémorisé) avec rejeu.
 */
export function QuizEngine({ questions, moduleSlug, moduleName }: QuizEngineProps) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  /** Meilleur score résultant + record, calculé à la fin de l'essai. */
  const [outcome, setOutcome] = useState<{ best: QuizScore; isRecord: boolean } | null>(null);

  const current = questions[index];
  const answered = selected !== null;

  function choose(option: number) {
    if (answered || !current) return;
    setSelected(option);
    if (option === current.correct) setScore((s) => s + 1);
  }

  function next() {
    if (index + 1 >= questions.length) {
      // `score` est à jour (la dernière réponse a été comptée au clic précédent).
      setOutcome(recordQuizScore(moduleSlug, score, questions.length));
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
  }

  function restart() {
    setIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setOutcome(null);
  }

  // --- État vide ---
  if (questions.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-10 text-center text-muted">
        Aucun quiz disponible pour ce module pour l&apos;instant.
      </div>
    );
  }

  // --- Écran de fin ---
  if (finished) {
    const percent = Math.round((score / questions.length) * 100);
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
          <Trophy className="h-6 w-6" aria-hidden="true" />
        </span>
        <h2 className="text-lg font-medium">Quiz terminé</h2>
        <p className="mt-1 text-sm text-muted">
          {moduleName} — {score} / {questions.length} bonnes réponses ({percent}%)
        </p>

        {outcome &&
          (outcome.isRecord ? (
            <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
              <Award className="h-3.5 w-3.5" aria-hidden="true" />
              Nouveau record !
            </p>
          ) : (
            <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted">
              <Award className="h-3.5 w-3.5" aria-hidden="true" />
              Meilleur score : {scorePercent(outcome.best)}%
            </p>
          ))}

        <button
          type="button"
          onClick={restart}
          className="mt-6 inline-flex items-center gap-1.5 rounded-md border border-primary-mid/50 bg-primary/15 px-4 py-2 text-sm text-primary transition hover:bg-primary/25"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Recommencer
        </button>
      </div>
    );
  }

  if (!current) return null;
  const progress = Math.round((index / questions.length) * 100);

  return (
    <div className="rounded-xl border border-border bg-card p-[18px]">
      {/* Progression */}
      <div className="mb-4 h-1 overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mb-3 flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-wide text-muted">
          Question {index + 1} / {questions.length}
        </span>
        <span className="text-[11px] text-muted">Score : {score}</span>
      </div>

      <p className="mb-4 text-sm font-medium leading-relaxed text-text">
        {current.question}
      </p>

      {/* Options */}
      <ul className="space-y-2">
        {current.options.map((option, i) => {
          const isCorrect = i === current.correct;
          const isChosen = i === selected;

          // Couleur selon l'état (après réponse uniquement).
          let stateClass =
            "border-border bg-bg hover:border-primary-mid/50 text-text";
          if (answered) {
            if (isCorrect) {
              stateClass = "border-emerald-500/50 bg-emerald-500/10 text-emerald-200";
            } else if (isChosen) {
              stateClass = "border-red-500/50 bg-red-500/10 text-red-200";
            } else {
              stateClass = "border-border bg-bg text-muted";
            }
          }

          return (
            <li key={i}>
              <button
                type="button"
                onClick={() => choose(i)}
                disabled={answered}
                aria-pressed={isChosen}
                className={`flex w-full items-center gap-2.5 rounded-md border px-3.5 py-2.5 text-left text-sm transition disabled:cursor-default ${stateClass}`}
              >
                <span className="flex-1">{option}</span>
                {answered && isCorrect && (
                  <Check className="h-4 w-4 shrink-0 text-emerald-300" aria-hidden="true" />
                )}
                {answered && isChosen && !isCorrect && (
                  <X className="h-4 w-4 shrink-0 text-red-300" aria-hidden="true" />
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {/* Feedback + suite */}
      {answered && (
        <div className="mt-4">
          <div className="rounded-md border border-border bg-bg p-3.5">
            <p className="text-xs leading-relaxed text-muted">
              <RichText>{current.explanation}</RichText>
            </p>
          </div>
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={next}
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90"
            >
              {index + 1 >= questions.length ? "Voir le score" : "Question suivante"}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
