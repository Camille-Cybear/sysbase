"use client";

import { useEffect, useState, type KeyboardEvent } from "react";
import { RotateCcw, Check, X, Lightbulb } from "lucide-react";
import {
  computeSubnet,
  generateSubnetQuestion,
  type Level,
  type SubnetInfo,
  type SubnetQuestion,
} from "@/lib/subnetting";

const LEVELS: { value: Level; label: string }[] = [
  { value: "easy", label: "Facile" },
  { value: "medium", label: "Moyen" },
  { value: "hard", label: "Difficile" },
];

interface Inputs {
  network: string;
  broadcast: string;
  hosts: string;
}

interface Checked extends SubnetInfo {
  networkOk: boolean | null;
  broadcastOk: boolean | null;
  hostsOk: boolean | null;
}

const EMPTY_INPUTS: Inputs = { network: "", broadcast: "", hosts: "" };

function norm(s: string): string {
  return s.trim().replace(/\s/g, "");
}

/** Entraîneur de subnetting : IP/CIDR aléatoire, saisie, correction visuelle. */
export function SubnetTrainer() {
  const [level, setLevel] = useState<Level>("easy");
  const [question, setQuestion] = useState<SubnetQuestion | null>(null);
  const [inputs, setInputs] = useState<Inputs>(EMPTY_INPUTS);
  const [result, setResult] = useState<Checked | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [stats, setStats] = useState({ total: 0, correct: 0, streak: 0 });

  // Première question (et regénération au changement de niveau) côté client.
  useEffect(() => {
    setQuestion(generateSubnetQuestion(level));
    setInputs(EMPTY_INPUTS);
    setResult(null);
    setHint(null);
  }, [level]);

  function newQuestion() {
    setQuestion(generateSubnetQuestion(level));
    setInputs(EMPTY_INPUTS);
    setResult(null);
    setHint(null);
  }

  function check() {
    if (!question) return;
    const info = computeSubnet(question.ip, question.cidr);
    const uNet = norm(inputs.network);
    const uBc = norm(inputs.broadcast);
    const uHosts = norm(inputs.hosts);

    const networkOk = uNet ? uNet === info.network : null;
    const broadcastOk = uBc ? uBc === info.broadcast : null;
    const hostsOk = uHosts ? Number(uHosts) === info.hosts : null;

    const allFilled = Boolean(uNet && uBc && uHosts);
    const allOk = networkOk && broadcastOk && hostsOk;

    setStats((s) => ({
      total: s.total + 1,
      correct: s.correct + (allFilled && allOk ? 1 : 0),
      streak: allFilled && allOk ? s.streak + 1 : 0,
    }));
    setHint(null);
    setResult({ ...info, networkOk, broadcastOk, hostsOk });
  }

  function showHint() {
    if (!question) return;
    const info = computeSubnet(question.ip, question.cidr);
    setHint(
      info.block === 256
        ? "Bloc = 256 (l'octet est entier)"
        : `Bloc = 256 − ${256 - info.block} = ${info.block}`,
    );
  }

  function onEnter(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") check();
  }

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

      {/* Question */}
      <div className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-border bg-bg p-4">
        <span className="font-mono text-2xl tracking-wide text-text">
          {question?.ip ?? "—"}
          <span className="text-primary">
            {question ? `/${question.cidr}` : ""}
          </span>
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

      {/* Saisies */}
      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Field label="Adresse réseau" placeholder="192.168.1.0" value={inputs.network}
          onChange={(v) => setInputs((i) => ({ ...i, network: v }))} onKeyDown={onEnter} />
        <Field label="Broadcast" placeholder="192.168.1.63" value={inputs.broadcast}
          onChange={(v) => setInputs((i) => ({ ...i, broadcast: v }))} onKeyDown={onEnter} />
        <Field label="Hôtes utilisables" placeholder="62" value={inputs.hosts}
          onChange={(v) => setInputs((i) => ({ ...i, hosts: v }))} onKeyDown={onEnter} />
      </div>

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
          onClick={showHint}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-4 py-2 text-sm text-muted transition hover:border-primary-mid/50 hover:text-text"
        >
          <Lightbulb className="h-4 w-4" aria-hidden="true" />
          Indice
        </button>
      </div>

      {/* Indice */}
      {hint && (
        <p className="mt-4 font-mono text-sm text-primary" aria-live="polite">
          {hint}
        </p>
      )}

      {/* Résultat */}
      {result && (
        <div className="mt-4" aria-live="polite">
          <BlockBar info={result} />
          <div className="rounded-lg border border-border bg-bg px-4 py-1">
            <ResultRow k="Masque" v={result.mask} />
            <ResultRow k="Adresse réseau" v={result.network} mark={result.networkOk} />
            <ResultRow k="Première utilisable" v={result.firstHost} />
            <ResultRow k="Dernière utilisable" v={result.lastHost} />
            <ResultRow k="Broadcast" v={result.broadcast} mark={result.broadcastOk} />
            <ResultRow
              k="Hôtes utilisables"
              v={result.hosts.toLocaleString("fr-FR")}
              mark={result.hostsOk}
            />
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
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-muted">{label}</span>
      <input
        type="text"
        inputMode="decimal"
        autoComplete="off"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        className="w-full rounded-md border border-border bg-bg px-2.5 py-2 font-mono text-sm text-text placeholder:text-muted/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
    </label>
  );
}

function ResultRow({
  k,
  v,
  mark,
}: {
  k: string;
  v: string;
  mark?: boolean | null;
}) {
  return (
    <div className="flex items-center justify-between border-t border-border py-1.5 text-sm first:border-t-0">
      <span className="text-muted">{k}</span>
      <span className="flex items-center gap-2 font-mono text-text">
        {v}
        {mark === true && <Check className="h-3.5 w-3.5 text-emerald-400" aria-label="correct" />}
        {mark === false && <X className="h-3.5 w-3.5 text-red-400" aria-label="incorrect" />}
      </span>
    </div>
  );
}

function BlockBar({ info }: { info: SubnetInfo }) {
  const leftPct = (info.octetStart / 256) * 100;
  const widthPct = (info.block / 256) * 100;
  const markPct = (info.ipOctet / 256) * 100;
  const end = info.octetStart + info.block - 1;

  return (
    <div className="mb-3">
      <p className="mb-1.5 text-xs text-muted">
        Bloc de {info.block} sur l&apos;octet n°{info.octetIndex + 1} — ton IP tombe
        dans le bloc qui commence à {info.octetStart}
      </p>
      <div className="relative h-8 overflow-hidden rounded-md border border-border bg-bg">
        <div
          className="absolute inset-y-0 border-x-2 border-primary bg-primary/20"
          style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
        />
        <div className="absolute -inset-y-0.5 w-0.5 bg-red-400" style={{ left: `${markPct}%` }} />
        <span
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-[11px] text-primary"
          style={{ left: `${leftPct}%` }}
        >
          {info.octetStart}
        </span>
        <span
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-[11px] text-primary"
          style={{ left: `${leftPct + widthPct}%` }}
        >
          {end}
        </span>
      </div>
    </div>
  );
}
