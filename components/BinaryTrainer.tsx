"use client";

import { useEffect, useState, type KeyboardEvent } from "react";
import { RotateCcw, Check, X, Lightbulb } from "lucide-react";
import {
  BIT_WEIGHTS,
  checkBinaryAnswer,
  expectedAnswer,
  generateBinaryQuestion,
  questionDisplay,
  toBinaryOctet,
  type BinaryQuestion,
  type Direction,
  type Format,
} from "@/lib/binary";

const DIRECTIONS: { value: Direction; label: string }[] = [
  { value: "decToBin", label: "Décimal → Binaire" },
  { value: "binToDec", label: "Binaire → Décimal" },
];

const FORMATS: { value: Format; label: string }[] = [
  { value: "octet", label: "1 octet" },
  { value: "ip", label: "IP complète" },
];

interface Outcome {
  correct: boolean;
  expected: string;
  octets: number[];
}

/** Entraîneur de conversion binaire ⇄ décimal, avec décomposition des poids. */
export function BinaryTrainer() {
  const [direction, setDirection] = useState<Direction>("decToBin");
  const [format, setFormat] = useState<Format>("octet");
  const [question, setQuestion] = useState<BinaryQuestion | null>(null);
  const [input, setInput] = useState("");
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [hint, setHint] = useState(false);
  const [stats, setStats] = useState({ total: 0, correct: 0, streak: 0 });

  // (Re)génère une question au montage et à chaque changement de sens/format.
  useEffect(() => {
    setQuestion(generateBinaryQuestion(direction, format));
    setInput("");
    setOutcome(null);
    setHint(false);
  }, [direction, format]);

  function newQuestion() {
    setQuestion(generateBinaryQuestion(direction, format));
    setInput("");
    setOutcome(null);
    setHint(false);
  }

  function check() {
    if (!question || input.trim() === "") return;
    const correct = checkBinaryAnswer(question, input);
    setStats((s) => ({
      total: s.total + 1,
      correct: s.correct + (correct ? 1 : 0),
      streak: correct ? s.streak + 1 : 0,
    }));
    setHint(false);
    setOutcome({ correct, expected: expectedAnswer(question), octets: question.octets });
  }

  function onEnter(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") check();
  }

  const placeholder =
    question?.direction === "decToBin"
      ? question.format === "ip"
        ? "11000000.10101000.00000001.00000001"
        : "11000000"
      : question?.format === "ip"
        ? "192.168.1.1"
        : "192";

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      {/* Stats */}
      <div className="mb-4 flex justify-end gap-2">
        <Stat label="Série" value={stats.streak} />
        <Stat label="Réussis" value={`${stats.correct}/${stats.total}`} />
      </div>

      {/* Sens */}
      <Toggle
        ariaLabel="Sens de conversion"
        options={DIRECTIONS}
        value={direction}
        onChange={setDirection}
      />
      {/* Format */}
      <div className="mt-2">
        <Toggle
          ariaLabel="Format"
          options={FORMATS}
          value={format}
          onChange={setFormat}
        />
      </div>

      {/* Question */}
      <div className="mb-4 mt-4 flex items-center justify-between gap-3 rounded-lg border border-border bg-bg p-4">
        <span className="break-all font-mono text-xl tracking-wide text-text sm:text-2xl">
          {question ? questionDisplay(question) : "—"}
        </span>
        <button
          type="button"
          onClick={newQuestion}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs text-muted transition hover:border-primary-mid/50 hover:text-text"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          Nouvelle
        </button>
      </div>

      {/* Saisie */}
      <label className="mb-4 block">
        <span className="mb-1 block text-xs text-muted">
          {direction === "decToBin" ? "Binaire" : "Décimal"}
        </span>
        <input
          type="text"
          inputMode={direction === "decToBin" ? "numeric" : "decimal"}
          autoComplete="off"
          placeholder={placeholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onEnter}
          className="w-full rounded-md border border-border bg-bg px-2.5 py-2 font-mono text-sm text-text placeholder:text-muted/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </label>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={check}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90"
        >
          Vérifier
        </button>
        <button
          type="button"
          onClick={() => setHint((h) => !h)}
          aria-pressed={hint}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-4 py-2 text-sm text-muted transition hover:border-primary-mid/50 hover:text-text"
        >
          <Lightbulb className="h-4 w-4" aria-hidden="true" />
          Indice
        </button>
      </div>

      {/* Indice : la grille des poids */}
      {hint && !outcome && (
        <div className="mt-4">
          <p className="mb-1.5 text-xs text-muted">
            Chaque bit vaut, de gauche à droite :
          </p>
          <WeightStrip />
        </div>
      )}

      {/* Résultat */}
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

          {/* Décomposition des poids par octet */}
          <div className="space-y-3 rounded-lg border border-border bg-bg p-3">
            {outcome.octets.map((value, i) => (
              <PlaceValueRow key={i} value={value} />
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

function Toggle<T extends string>({
  ariaLabel,
  options,
  value,
  onChange,
}: {
  ariaLabel: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5" role="group" aria-label={ariaLabel}>
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={active}
            className={`flex-1 rounded-lg border px-3 py-2 text-sm transition ${
              active
                ? "border-primary-mid/50 bg-primary/15 font-medium text-primary"
                : "border-border text-muted hover:border-primary-mid/50 hover:text-text"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/** Bande des 8 poids (128…1), pour l'indice. */
function WeightStrip() {
  return (
    <div className="grid grid-cols-8 gap-1 text-center font-mono text-xs">
      {BIT_WEIGHTS.map((w) => (
        <div key={w} className="rounded border border-border bg-card py-1 text-primary">
          {w}
        </div>
      ))}
    </div>
  );
}

/** Décomposition d'un octet : poids en haut, bit (0/1) en bas, bits à 1 surlignés. */
function PlaceValueRow({ value }: { value: number }) {
  const bits = toBinaryOctet(value).split("");
  return (
    <div>
      <div className="mb-1 text-xs text-muted">
        <span className="font-mono text-text">{value}</span> ={" "}
        <span className="font-mono text-text">{toBinaryOctet(value)}</span>
      </div>
      <div className="grid grid-cols-8 gap-1 text-center font-mono text-[11px]">
        {BIT_WEIGHTS.map((w, i) => {
          const on = bits[i] === "1";
          return (
            <div
              key={w}
              className={`rounded border py-1 ${
                on
                  ? "border-primary-mid/50 bg-primary/20 text-primary"
                  : "border-border bg-card text-muted"
              }`}
            >
              <div className="opacity-70">{w}</div>
              <div className="text-sm">{bits[i]}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
