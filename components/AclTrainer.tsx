"use client";

import { useEffect, useState } from "react";
import { RotateCcw, Check, X } from "lucide-react";
import {
  generateAclQuestion,
  type AclQuestion,
  type AclRule,
} from "@/lib/network-exercises";

function formatSource(source: AclRule["source"]): string {
  return source.any ? "any" : `${source.network}/${source.prefix}`;
}

function formatRule(rule: AclRule): string {
  const port = rule.port === "any" ? "" : ` eq ${rule.port}`;
  return `${rule.action} ${formatSource(rule.source)}${port}`;
}

/** Exercice : d'après l'ACL, le paquet est-il autorisé ou refusé ? */
export function AclTrainer() {
  const [question, setQuestion] = useState<AclQuestion | null>(null);
  const [answer, setAnswer] = useState<boolean | null>(null);
  const [stats, setStats] = useState({ total: 0, correct: 0, streak: 0 });

  function fresh() {
    setQuestion(generateAclQuestion());
    setAnswer(null);
  }

  useEffect(() => {
    fresh();
  }, []);

  function respond(value: boolean) {
    if (!question || answer !== null) return;
    const correct = value === question.allowed;
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
  const userCorrect = answer === question.allowed;

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex justify-end gap-2">
        <Stat label="Série" value={stats.streak} />
        <Stat label="Réussis" value={`${stats.correct}/${stats.total}`} />
      </div>

      {/* ACL */}
      <p className="mb-1.5 text-xs text-muted">Liste de contrôle d&apos;accès (évaluée de haut en bas) :</p>
      <div className="mb-4 overflow-hidden rounded-lg border border-border bg-bg font-mono text-sm">
        {question.rules.map((rule, i) => {
          const decisive = answered && i === question.matchedIndex;
          return (
            <div
              key={i}
              className={`flex gap-3 border-b border-border px-3 py-2 last:border-b-0 ${
                decisive ? "bg-primary/10" : ""
              }`}
            >
              <span className="text-muted">{i + 1}.</span>
              <span className="text-text">{formatRule(rule)}</span>
            </div>
          );
        })}
        <div className="flex gap-3 px-3 py-2 text-muted">
          <span>—</span>
          <span>deny any (implicite)</span>
        </div>
      </div>

      {/* Paquet */}
      <div className="mb-4 rounded-lg border border-border bg-bg p-3 font-mono text-sm">
        <span className="text-xs text-muted">Paquet : </span>
        <span className="text-text">
          source {question.packet.src}, port {question.packet.port}
        </span>
      </div>

      {/* Réponses */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => respond(true)}
          disabled={answered}
          className="flex-1 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-4 py-2.5 text-sm font-medium text-emerald-300 transition hover:bg-emerald-500/20 disabled:opacity-60"
        >
          Autorisé
        </button>
        <button
          type="button"
          onClick={() => respond(false)}
          disabled={answered}
          className="flex-1 rounded-md border border-red-500/40 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-300 transition hover:bg-red-500/20 disabled:opacity-60"
        >
          Refusé
        </button>
      </div>

      {answered && (
        <div className="mt-4" aria-live="polite">
          <div className="mb-2 flex items-center gap-2 text-sm">
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
          <p className="text-xs text-muted">
            {question.matchedIndex >= 0 ? (
              <>
                La <b className="text-text">règle {question.matchedIndex + 1}</b> est la
                première à correspondre → <b className="text-text">{question.allowed ? "autorisé" : "refusé"}</b>.
              </>
            ) : (
              <>
                Aucune règle ne correspond → <b className="text-text">deny implicite</b> (refusé).
              </>
            )}
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
