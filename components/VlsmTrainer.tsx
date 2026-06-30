"use client";

import { useEffect, useMemo, useState, type KeyboardEvent } from "react";
import { RotateCcw, Check, X, Lightbulb } from "lucide-react";
import {
  generateVlsmQuestion,
  type Level,
  type VlsmQuestion,
} from "@/lib/subnetting";

const LEVELS: { value: Level; label: string }[] = [
  { value: "easy", label: "Facile" },
  { value: "medium", label: "Moyen" },
  { value: "hard", label: "Difficile" },
];

const SEGMENT_COLORS = ["#7B6FD4", "#2EB88A", "#E0703F", "#D69A34", "#6BA5E0"];

interface RowInput {
  prefix: string;
  network: string;
  broadcast: string;
}

const emptyRow = (): RowInput => ({ prefix: "", network: "", broadcast: "" });

function norm(s: string): string {
  return s.trim().replace(/\s/g, "");
}

/** Entraîneur VLSM : allouer des sous-réseaux de tailles variables. */
export function VlsmTrainer() {
  const [level, setLevel] = useState<Level>("easy");
  const [question, setQuestion] = useState<VlsmQuestion | null>(null);
  const [rows, setRows] = useState<RowInput[]>([]);
  const [checked, setChecked] = useState(false);
  const [hint, setHint] = useState(false);
  const [stats, setStats] = useState({ total: 0, correct: 0, streak: 0 });

  function load(lvl: Level) {
    const q = generateVlsmQuestion(lvl);
    setQuestion(q);
    setRows(q.requirements.map(emptyRow));
    setChecked(false);
    setHint(false);
  }

  useEffect(() => {
    load(level);
  }, [level]);

  function setField(i: number, field: keyof RowInput, value: string) {
    setRows((prev) =>
      prev.map((row, idx) => (idx === i ? { ...row, [field]: value } : row)),
    );
  }

  const marks = useMemo(() => {
    if (!checked || !question) return null;
    return question.allocations.map((alloc, i) => {
      const row = rows[i] ?? emptyRow();
      return {
        prefix: Number(norm(row.prefix).replace("/", "")) === alloc.prefix,
        network: norm(row.network) === alloc.network,
        broadcast: norm(row.broadcast) === alloc.broadcast,
      };
    });
  }, [checked, question, rows]);

  function check() {
    if (!question) return;
    const allOk = question.allocations.every((alloc, i) => {
      const row = rows[i] ?? emptyRow();
      return (
        Number(norm(row.prefix).replace("/", "")) === alloc.prefix &&
        norm(row.network) === alloc.network &&
        norm(row.broadcast) === alloc.broadcast
      );
    });
    setStats((s) => ({
      total: s.total + 1,
      correct: s.correct + (allOk ? 1 : 0),
      streak: allOk ? s.streak + 1 : 0,
    }));
    setHint(false);
    setChecked(true);
  }

  function onEnter(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") check();
  }

  if (!question) {
    return (
      <div className="rounded-xl border border-border bg-card p-10 text-center text-muted">
        Préparation…
      </div>
    );
  }

  const baseSize = 2 ** (32 - question.basePrefix);

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      {/* Stats */}
      <div className="mb-4 flex justify-end gap-2">
        <Stat label="Série" value={stats.streak} />
        <Stat label="Réussis" value={`${stats.correct}/${stats.total}`} />
      </div>

      {/* Niveaux */}
      <div className="mb-4 flex flex-wrap gap-1.5" role="group" aria-label="Niveau">
        {LEVELS.map((lvl) => {
          const active = level === lvl.value;
          return (
            <button
              key={lvl.value}
              type="button"
              onClick={() => setLevel(lvl.value)}
              aria-pressed={active}
              className={`flex-1 rounded-lg border px-3 py-2 text-sm transition ${
                active
                  ? "border-primary-mid/50 bg-primary/15 font-medium text-primary"
                  : "border-border text-muted hover:border-primary-mid/50 hover:text-text"
              }`}
            >
              {lvl.label}
            </button>
          );
        })}
      </div>

      {/* Réseau de base */}
      <div className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-border bg-bg p-4">
        <span>
          <span className="block text-xs text-muted">Réseau de base</span>
          <span className="font-mono text-xl text-text">
            {question.baseIp}
            <span className="text-primary">/{question.basePrefix}</span>
          </span>
        </span>
        <button
          type="button"
          onClick={() => load(level)}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs text-muted transition hover:border-primary-mid/50 hover:text-text"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          Nouveau
        </button>
      </div>

      <p className="mb-2 text-xs text-muted">
        Alloue chaque sous-réseau (du plus grand au plus petit) :
      </p>

      {/* Lignes de besoins */}
      <div className="space-y-2">
        {question.requirements.map((req, i) => {
          const alloc = question.allocations[i];
          const mark = marks?.[i];
          return (
            <div key={i} className="rounded-lg border border-border bg-bg p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-text">{req.label}</span>
                <span className="text-xs text-muted">
                  {req.hosts} hôte{req.hosts > 1 ? "s" : ""}
                </span>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <Field
                  label="CIDR"
                  placeholder="/26"
                  value={rows[i]?.prefix ?? ""}
                  onChange={(v) => setField(i, "prefix", v)}
                  onKeyDown={onEnter}
                  ok={mark?.prefix}
                  expected={alloc ? `/${alloc.prefix}` : ""}
                />
                <Field
                  label="Adresse réseau"
                  placeholder="192.168.1.0"
                  value={rows[i]?.network ?? ""}
                  onChange={(v) => setField(i, "network", v)}
                  onKeyDown={onEnter}
                  ok={mark?.network}
                  expected={alloc?.network ?? ""}
                />
                <Field
                  label="Broadcast"
                  placeholder="192.168.1.63"
                  value={rows[i]?.broadcast ?? ""}
                  onChange={(v) => setField(i, "broadcast", v)}
                  onKeyDown={onEnter}
                  ok={mark?.broadcast}
                  expected={alloc?.broadcast ?? ""}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="mt-4 flex flex-wrap gap-2">
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

      {/* Indice */}
      {hint && !checked && (
        <p className="mt-4 text-sm text-primary">
          Trie par besoin décroissant. Pour <b>N</b> hôtes, prends le plus petit
          bloc tel que <span className="font-mono">2^b − 2 ≥ N</span>, puis place
          chaque sous-réseau juste après le broadcast du précédent.
        </p>
      )}

      {/* Barre d'occupation (après vérification) */}
      {checked && (
        <div className="mt-5" aria-live="polite">
          <p className="mb-1.5 text-xs text-muted">Occupation de l&apos;espace d&apos;adressage</p>
          <div className="flex h-8 overflow-hidden rounded-md border border-border">
            {question.allocations.map((alloc, i) => (
              <div
                key={i}
                className="flex items-center justify-center overflow-hidden text-[10px] font-medium text-bg"
                style={{
                  width: `${(alloc.block / baseSize) * 100}%`,
                  backgroundColor: SEGMENT_COLORS[i % SEGMENT_COLORS.length],
                }}
                title={`${alloc.label} — /${alloc.prefix}`}
              >
                /{alloc.prefix}
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

function Field({
  label,
  placeholder,
  value,
  onChange,
  onKeyDown,
  ok,
  expected,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  ok?: boolean;
  expected: string;
}) {
  const showWrong = ok === false;
  return (
    <label className="block">
      <span className="mb-1 flex items-center gap-1 text-[11px] text-muted">
        {label}
        {ok === true && <Check className="h-3 w-3 text-emerald-400" aria-label="correct" />}
        {ok === false && <X className="h-3 w-3 text-red-400" aria-label="incorrect" />}
      </span>
      <input
        type="text"
        inputMode="decimal"
        autoComplete="off"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        className={`w-full rounded-md border bg-bg px-2.5 py-2 font-mono text-sm text-text placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 ${
          showWrong ? "border-red-500/50" : "border-border focus:border-primary"
        }`}
      />
      {showWrong && (
        <span className="mt-1 block font-mono text-[11px] text-emerald-300">
          {expected}
        </span>
      )}
    </label>
  );
}
