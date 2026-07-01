"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, Check, Play } from "lucide-react";
import { MODULES, type ModuleSlug } from "@/data/modules";
import { getQuiz } from "@/lib/quiz";
import type { QuizQuestion } from "@/lib/types";
import { QuizEngine } from "@/components/QuizEngine";

const COUNT_OPTIONS = [5, 10, 20] as const;

function shuffle<T>(arr: T[]): T[] {
  const c = [...arr];
  for (let i = c.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = c[i] as T;
    c[i] = c[j] as T;
    c[j] = tmp;
  }
  return c;
}

/** Configurateur de quiz : choix des modules + nombre de questions. */
export function QuizBuilder() {
  // Modules disposant d'au moins une question.
  const available = useMemo(
    () => MODULES.filter((m) => getQuiz(m.slug).length > 0),
    [],
  );

  const [selected, setSelected] = useState<Set<ModuleSlug>>(
    () => new Set(available.map((m) => m.slug)),
  );
  const [count, setCount] = useState<number | "all">(10);
  const [quiz, setQuiz] = useState<{ questions: QuizQuestion[]; label: string } | null>(null);

  const pool = available
    .filter((m) => selected.has(m.slug))
    .flatMap((m) => getQuiz(m.slug));
  const allSelected = selected.size === available.length;

  function toggle(slug: ModuleSlug) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(available.map((m) => m.slug)));
  }

  function start() {
    if (pool.length === 0) return;
    const n = count === "all" ? pool.length : Math.min(count, pool.length);
    const chosen = available.filter((m) => selected.has(m.slug));
    const label =
      chosen.length === available.length
        ? "Tous les modules"
        : chosen.length === 1
          ? (chosen[0]?.name ?? "Quiz")
          : `${chosen.length} modules`;
    setQuiz({ questions: shuffle(pool).slice(0, n), label });
  }

  // --- Quiz lancé ---
  if (quiz) {
    return (
      <div>
        <button
          type="button"
          onClick={() => setQuiz(null)}
          className="mb-4 inline-flex items-center gap-1.5 text-xs text-muted transition hover:text-text"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Modifier le quiz
        </button>
        <QuizEngine questions={quiz.questions} moduleSlug="mixte" moduleName={quiz.label} />
      </div>
    );
  }

  const launchCount = count === "all" ? pool.length : Math.min(count, pool.length);

  // --- Configuration ---
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      {/* Modules */}
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-medium text-text">Modules</h2>
        <button
          type="button"
          onClick={toggleAll}
          className="text-xs text-primary transition hover:underline"
        >
          {allSelected ? "Tout désélectionner" : "Tout sélectionner"}
        </button>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {available.map((m) => {
          const on = selected.has(m.slug);
          return (
            <button
              key={m.slug}
              type="button"
              onClick={() => toggle(m.slug)}
              aria-pressed={on}
              className={`flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left text-sm transition ${
                on
                  ? "border-primary-mid/50 bg-primary/10"
                  : "border-border hover:border-primary-mid/50"
              }`}
            >
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                  on ? "border-primary bg-primary text-white" : "border-border"
                }`}
              >
                {on && <Check className="h-3 w-3" aria-hidden="true" />}
              </span>
              <span className="flex-1 text-text">{m.name}</span>
              <span className="text-xs text-muted">{getQuiz(m.slug).length}</span>
            </button>
          );
        })}
      </div>

      {/* Nombre de questions */}
      <h2 className="mb-2 text-sm font-medium text-text">Nombre de questions</h2>
      <div className="mb-5 flex flex-wrap gap-1.5">
        {COUNT_OPTIONS.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setCount(n)}
            aria-pressed={count === n}
            className={`rounded-lg border px-4 py-2 text-sm transition ${
              count === n
                ? "border-primary-mid/50 bg-primary/15 font-medium text-primary"
                : "border-border text-muted hover:border-primary-mid/50 hover:text-text"
            }`}
          >
            {n}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setCount("all")}
          aria-pressed={count === "all"}
          className={`rounded-lg border px-4 py-2 text-sm transition ${
            count === "all"
              ? "border-primary-mid/50 bg-primary/15 font-medium text-primary"
              : "border-border text-muted hover:border-primary-mid/50 hover:text-text"
          }`}
        >
          Tout
        </button>
        <span className="self-center text-xs text-muted">
          ({pool.length} question{pool.length > 1 ? "s" : ""} disponible{pool.length > 1 ? "s" : ""})
        </span>
      </div>

      {/* Lancer */}
      <button
        type="button"
        onClick={start}
        disabled={launchCount === 0}
        className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Play className="h-4 w-4" aria-hidden="true" />
        Lancer le quiz{launchCount > 0 ? ` (${launchCount} questions)` : ""}
      </button>
      {launchCount === 0 && (
        <p className="mt-2 text-xs text-muted">Sélectionne au moins un module.</p>
      )}
    </div>
  );
}
