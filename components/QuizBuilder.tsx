"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, Play } from "lucide-react";
import { MODULES, type ModuleSlug } from "@/data/modules";
import { getQuiz } from "@/lib/quiz";
import type { QuizQuestion } from "@/lib/types";
import { QuizEngine } from "@/components/QuizEngine";

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

  const chosen = available.filter((m) => selected.has(m.slug));
  const poolSize = chosen.reduce((n, m) => n + getQuiz(m.slug).length, 0);

  // Options du menu déroulant : multiples de 10 jusqu'au total disponible.
  const tensOptions = useMemo(() => {
    const opts: number[] = [];
    for (let n = 10; n <= poolSize; n += 10) opts.push(n);
    return opts;
  }, [poolSize]);

  // Si le total dispo diminue sous la valeur choisie, on la ramène à un choix valide.
  useEffect(() => {
    if (count !== "all" && count > poolSize) {
      setCount(poolSize >= 10 ? Math.floor(poolSize / 10) * 10 : "all");
    }
  }, [poolSize, count]);

  function toggle(slug: ModuleSlug) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  const allSelected = selected.size === available.length;
  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(available.map((m) => m.slug)));
  }

  function start() {
    if (chosen.length === 0) return;
    const total = count === "all" ? poolSize : Math.min(count, poolSize);

    // Répartition équilibrée entre modules (round-robin), puis ordre aléatoire.
    const queues = chosen.map((m) => shuffle(getQuiz(m.slug)));
    const picked: QuizQuestion[] = [];
    let progress = true;
    while (picked.length < total && progress) {
      progress = false;
      for (const queue of queues) {
        if (picked.length >= total) break;
        const next = queue.shift();
        if (next) {
          picked.push(next);
          progress = true;
        }
      }
    }

    const label =
      chosen.length === available.length
        ? "Tous les modules"
        : chosen.length === 1
          ? (chosen[0]?.name ?? "Quiz")
          : `${chosen.length} modules`;
    setQuiz({ questions: shuffle(picked), label });
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

  const launchCount = count === "all" ? poolSize : Math.min(count, poolSize);
  const perModule =
    chosen.length > 0 ? Math.floor(launchCount / chosen.length) : 0;

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
      <div className="mb-2 flex flex-wrap items-center gap-3">
        <select
          value={count === "all" ? "all" : String(count)}
          onChange={(e) =>
            setCount(e.target.value === "all" ? "all" : Number(e.target.value))
          }
          disabled={poolSize === 0}
          className="rounded-md border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
        >
          {tensOptions.map((n) => (
            <option key={n} value={n}>
              {n} questions
            </option>
          ))}
          <option value="all">Tout ({poolSize})</option>
        </select>
        <span className="text-xs text-muted">
          {chosen.length > 0
            ? `${launchCount} question${launchCount > 1 ? "s" : ""} · ~${perModule} par module`
            : "Sélectionne au moins un module."}
        </span>
      </div>

      {/* Lancer */}
      <button
        type="button"
        onClick={start}
        disabled={launchCount === 0}
        className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Play className="h-4 w-4" aria-hidden="true" />
        Lancer le quiz{launchCount > 0 ? ` (${launchCount} questions)` : ""}
      </button>
    </div>
  );
}
