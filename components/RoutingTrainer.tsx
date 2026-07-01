"use client";

import { useEffect, useState } from "react";
import { RotateCcw, Check, X } from "lucide-react";
import { generateRoutingQuestion, type RoutingQuestion } from "@/lib/network-exercises";

/** Exercice : par quelle route part le paquet (longest prefix match) ? */
export function RoutingTrainer() {
  const [question, setQuestion] = useState<RoutingQuestion | null>(null);
  const [choice, setChoice] = useState<number | null>(null);
  const [stats, setStats] = useState({ total: 0, correct: 0, streak: 0 });

  function fresh() {
    setQuestion(generateRoutingQuestion());
    setChoice(null);
  }

  useEffect(() => {
    fresh();
  }, []);

  function respond(i: number) {
    if (!question || choice !== null) return;
    const correct = i === question.correctIndex;
    setStats((s) => ({
      total: s.total + 1,
      correct: s.correct + (correct ? 1 : 0),
      streak: correct ? s.streak + 1 : 0,
    }));
    setChoice(i);
  }

  if (!question) {
    return (
      <div className="rounded-xl border border-border bg-card p-10 text-center text-muted">
        Préparation…
      </div>
    );
  }

  const answered = choice !== null;

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex justify-end gap-2">
        <Stat label="Série" value={stats.streak} />
        <Stat label="Réussis" value={`${stats.correct}/${stats.total}`} />
      </div>

      {/* Destination */}
      <div className="mb-4 rounded-lg border border-border bg-bg p-4">
        <p className="text-xs text-muted">Paquet à destination de</p>
        <p className="font-mono text-2xl text-text">{question.dest}</p>
        <p className="mt-1 text-xs text-muted">
          Quelle entrée de la table est utilisée ?
        </p>
      </div>

      {/* Table de routage cliquable */}
      <div className="space-y-2">
        {question.routes.map((route, i) => {
          const isCorrect = i === question.correctIndex;
          const isChosen = i === choice;
          let cls = "border-border bg-bg hover:border-primary-mid/50";
          if (answered) {
            if (isCorrect) cls = "border-emerald-500/50 bg-emerald-500/10";
            else if (isChosen) cls = "border-red-500/50 bg-red-500/10";
            else cls = "border-border bg-bg opacity-60";
          }
          return (
            <button
              key={i}
              type="button"
              onClick={() => respond(i)}
              disabled={answered}
              className={`flex w-full items-center gap-3 rounded-md border px-3 py-2.5 text-left font-mono text-sm transition disabled:cursor-default ${cls}`}
            >
              <span className="flex-1 text-text">
                {route.network}
                <span className="text-primary">/{route.prefix}</span>
                {route.prefix === 0 && (
                  <span className="ml-1 font-sans text-[11px] text-muted">(défaut)</span>
                )}
              </span>
              <span className="text-muted">→ {route.via}</span>
              {answered && isCorrect && (
                <Check className="h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
              )}
              {answered && isChosen && !isCorrect && (
                <X className="h-4 w-4 shrink-0 text-red-400" aria-hidden="true" />
              )}
            </button>
          );
        })}
      </div>

      {answered && (
        <div className="mt-4" aria-live="polite">
          <p className="text-xs text-muted">
            Le routeur choisit la route au <b className="text-text">masque le plus long</b>{" "}
            qui contient la destination (longest prefix match) ; la route par défaut
            <span className="font-mono"> /0</span> n&apos;est utilisée qu&apos;en dernier recours.
          </p>
          <button
            type="button"
            onClick={fresh}
            className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-primary-mid/50 bg-primary/15 px-4 py-2 text-sm text-primary transition hover:bg-primary/25"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Suivante
          </button>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="min-w-[64px] rounded-lg border border-border bg-bg px-3 py-1.5 text-center">
      <b className="block text-lg font-semibold tabular-nums text-text">{value}</b>
      <span className="text-[10px] uppercase tracking-wide text-muted">{label}</span>
    </div>
  );
}
