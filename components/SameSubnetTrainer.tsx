"use client";

import { useEffect, useState } from "react";
import { RotateCcw, Check, X } from "lucide-react";
import {
  generateSameSubnetQuestion,
  type SameSubnetQuestion,
} from "@/lib/network-exercises";

/** Exercice : deux IP et un masque sont-ils dans le même sous-réseau ? */
export function SameSubnetTrainer() {
  const [question, setQuestion] = useState<SameSubnetQuestion | null>(null);
  const [answer, setAnswer] = useState<boolean | null>(null);
  const [stats, setStats] = useState({ total: 0, correct: 0, streak: 0 });

  function fresh() {
    setQuestion(generateSameSubnetQuestion());
    setAnswer(null);
  }

  useEffect(() => {
    fresh();
  }, []);

  function respond(value: boolean) {
    if (!question || answer !== null) return;
    const correct = value === question.same;
    setStats((s) => ({
      total: s.total + 1,
      correct: s.correct + (correct ? 1 : 0),
      streak: correct ? s.streak + 1 : 0,
    }));
    setAnswer(value);
  }

  if (!question) {
    return (
      <div className="rounded-xl border border-border bg-card p-10 text-center text-muted">
        Préparation…
      </div>
    );
  }

  const answered = answer !== null;
  const userCorrect = answer === question.same;

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex justify-end gap-2">
        <Stat label="Série" value={stats.streak} />
        <Stat label="Réussis" value={`${stats.correct}/${stats.total}`} />
      </div>

      {/* Énoncé */}
      <div className="mb-4 rounded-lg border border-border bg-bg p-4">
        <p className="mb-3 text-xs text-muted">
          Ces deux adresses sont-elles dans le même sous-réseau ?
        </p>
        <div className="space-y-1 font-mono text-lg text-text">
          <div>
            IP 1 : {question.ip1}
            <span className="text-primary">/{question.cidr}</span>
          </div>
          <div>
            IP 2 : {question.ip2}
            <span className="text-primary">/{question.cidr}</span>
          </div>
        </div>
      </div>

      {/* Réponses */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => respond(true)}
          disabled={answered}
          className="flex-1 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-4 py-2.5 text-sm font-medium text-emerald-300 transition hover:bg-emerald-500/20 disabled:opacity-60"
        >
          Même réseau
        </button>
        <button
          type="button"
          onClick={() => respond(false)}
          disabled={answered}
          className="flex-1 rounded-md border border-red-500/40 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-300 transition hover:bg-red-500/20 disabled:opacity-60"
        >
          Réseaux différents
        </button>
      </div>

      {/* Résultat */}
      {answered && (
        <div className="mt-4" aria-live="polite">
          <div className="mb-3 flex items-center gap-2 text-sm">
            {userCorrect ? (
              <>
                <Check className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                <span className="text-emerald-300">Correct !</span>
              </>
            ) : (
              <>
                <X className="h-4 w-4 text-red-400" aria-hidden="true" />
                <span className="text-red-300">Raté</span>
              </>
            )}
          </div>
          <div className="rounded-md border border-border bg-bg p-3 font-mono text-xs text-muted">
            <div>Réseau de IP 1 : <span className="text-text">{question.net1}</span></div>
            <div>Réseau de IP 2 : <span className="text-text">{question.net2}</span></div>
            <div className="mt-1 not-italic text-text">
              → {question.same ? "même sous-réseau" : "sous-réseaux différents"}
            </div>
          </div>
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
