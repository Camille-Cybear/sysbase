"use client";

import { useEffect, useState, type KeyboardEvent } from "react";
import { RotateCcw, Check, X } from "lucide-react";
import {
  octalToSymbolic,
  randomOctalPermission,
  symbolicToOctal,
} from "@/lib/permissions";

type Direction = "octalToSym" | "symToOctal";

const GROUPS = ["Propriétaire", "Groupe", "Autres"];

/** Entraîneur de permissions Linux : octal ⇄ symbolique. */
export function ChmodTrainer() {
  const [direction, setDirection] = useState<Direction>("octalToSym");
  const [octal, setOctal] = useState("755");
  const [input, setInput] = useState("");
  const [outcome, setOutcome] = useState<{ correct: boolean; expected: string } | null>(null);
  const [stats, setStats] = useState({ total: 0, correct: 0, streak: 0 });

  function fresh(dir: Direction) {
    setOctal(randomOctalPermission());
    setInput("");
    setOutcome(null);
    setDirection(dir);
  }

  useEffect(() => {
    setOctal(randomOctalPermission());
    setInput("");
    setOutcome(null);
  }, [direction]);

  const symbolic = octalToSymbolic(octal);
  const question = direction === "octalToSym" ? octal : symbolic;
  const expected = direction === "octalToSym" ? symbolic : octal;

  function check() {
    const clean = input.trim().replace(/\s/g, "");
    const correct = clean === expected;
    setStats((s) => ({
      total: s.total + 1,
      correct: s.correct + (correct ? 1 : 0),
      streak: correct ? s.streak + 1 : 0,
    }));
    setOutcome({ correct, expected });
  }

  function onEnter(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") check();
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex justify-end gap-2">
        <Stat label="Série" value={stats.streak} />
        <Stat label="Réussis" value={`${stats.correct}/${stats.total}`} />
      </div>

      {/* Sens */}
      <div className="mb-4 flex flex-wrap gap-1.5" role="group" aria-label="Sens">
        {(
          [
            ["octalToSym", "Octal → Symbolique"],
            ["symToOctal", "Symbolique → Octal"],
          ] as const
        ).map(([value, label]) => {
          const active = direction === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => setDirection(value)}
              aria-pressed={active}
              className={`flex-1 rounded-lg border px-3 py-2 text-sm transition ${
                active
                  ? "border-primary-mid/50 bg-primary/15 font-medium text-primary"
                  : "border-border text-muted hover:border-primary-mid/50 hover:text-text"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Question */}
      <div className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-border bg-bg p-4">
        <span className="font-mono text-2xl tracking-wide text-text">{question}</span>
        <button
          type="button"
          onClick={() => fresh(direction)}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs text-muted transition hover:border-primary-mid/50 hover:text-text"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          Nouvelle
        </button>
      </div>

      {/* Saisie */}
      <label className="mb-4 block">
        <span className="mb-1 block text-xs text-muted">
          {direction === "octalToSym" ? "Symbolique (ex. rwxr-xr-x)" : "Octal (ex. 755)"}
        </span>
        <input
          type="text"
          autoComplete="off"
          placeholder={direction === "octalToSym" ? "rwxr-xr-x" : "755"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onEnter}
          className="w-full rounded-md border border-border bg-bg px-2.5 py-2 font-mono text-sm text-text placeholder:text-muted/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </label>

      <button
        type="button"
        onClick={check}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90"
      >
        Vérifier
      </button>

      {/* Résultat + décomposition */}
      {outcome && (
        <div className="mt-4" aria-live="polite">
          <div className="mb-3 flex items-center gap-2 text-sm">
            {outcome.correct ? (
              <>
                <Check className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                <span className="text-emerald-300">Correct !</span>
              </>
            ) : (
              <>
                <X className="h-4 w-4 text-red-400" aria-hidden="true" />
                <span className="text-red-300">
                  Réponse attendue : <span className="font-mono">{outcome.expected}</span>
                </span>
              </>
            )}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {GROUPS.map((g, i) => (
              <div key={g} className="rounded-md border border-border bg-bg p-2 text-center">
                <div className="text-[11px] text-muted">{g}</div>
                <div className="font-mono text-primary">{symbolic.slice(i * 3, i * 3 + 3)}</div>
                <div className="font-mono text-xs text-muted">{octal[i]}</div>
              </div>
            ))}
          </div>
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
