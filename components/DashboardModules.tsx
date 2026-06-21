"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LayoutGrid, List, type LucideIcon } from "lucide-react";
import { ModuleCard } from "@/components/ModuleCard";
import { MODULES, type ModuleSlug } from "@/data/modules";
import { getModuleProgress, loadProgress } from "@/lib/progress";

type View = "grid" | "list";

/** Clé localStorage de la préférence d'affichage. */
const VIEW_KEY = "sysbase_view";

export interface DashboardModulesProps {
  /** IDs des flashcards par module, pour calculer la progression réelle. */
  cardIdsByModule: Record<ModuleSlug, string[]>;
}

/**
 * Section « Modules » du dashboard : bascule grille/liste + progression réelle.
 *
 * Progression et préférence de vue sont lues depuis le localStorage après
 * montage (le serveur l'ignore), pour éviter tout décalage d'hydratation.
 */
export function DashboardModules({ cardIdsByModule }: DashboardModulesProps) {
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [view, setView] = useState<View>("grid");

  useEffect(() => {
    const state = loadProgress();
    const next: Record<string, number> = {};
    for (const mod of MODULES) {
      next[mod.slug] = getModuleProgress(cardIdsByModule[mod.slug], state);
    }
    setProgress(next);
  }, [cardIdsByModule]);

  useEffect(() => {
    const saved = window.localStorage.getItem(VIEW_KEY);
    if (saved === "grid" || saved === "list") setView(saved);
  }, []);

  function changeView(next: View) {
    setView(next);
    try {
      window.localStorage.setItem(VIEW_KEY, next);
    } catch {
      /* stockage indisponible : on ignore */
    }
  }

  const toggleButton = (value: View, label: string, Icon: LucideIcon) => (
    <button
      type="button"
      onClick={() => changeView(value)}
      aria-pressed={view === value}
      className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] transition ${
        view === value
          ? "border-primary-mid/50 bg-primary/15 text-primary"
          : "border-border text-muted hover:text-text"
      }`}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {label}
    </button>
  );

  return (
    <section className="mb-6">
      <div className="mb-3.5 flex items-center justify-between">
        <h1 className="text-base font-medium">Modules</h1>
        <div className="flex gap-1" role="group" aria-label="Affichage des modules">
          {toggleButton("grid", "Grille", LayoutGrid)}
          {toggleButton("list", "Liste", List)}
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {MODULES.map((module) => (
            <ModuleCard
              key={module.slug}
              module={module}
              progress={progress[module.slug] ?? 0}
            />
          ))}
        </div>
      ) : (
        <ul className="space-y-2">
          {MODULES.map((module) => {
            const Icon = module.icon;
            const pct = progress[module.slug] ?? 0;
            return (
              <li key={module.slug}>
                <Link
                  href={`/modules/${module.slug}`}
                  className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition hover:border-primary-mid/50"
                >
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                    style={{
                      backgroundColor: `${module.color}26`,
                      color: module.color,
                    }}
                  >
                    <Icon className="h-[17px] w-[17px]" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] font-medium text-text">
                      {module.name}
                    </span>
                    <span className="block truncate text-[11px] text-muted">
                      {module.topics}
                    </span>
                  </span>
                  <span className="hidden w-32 shrink-0 sm:block">
                    <span className="block h-[3px] overflow-hidden rounded-full bg-white/5">
                      <span
                        className="block h-full rounded-full"
                        style={{ width: `${pct}%`, backgroundColor: module.color }}
                      />
                    </span>
                  </span>
                  <span className="w-9 shrink-0 text-right text-[11px] text-muted">
                    {pct}%
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
