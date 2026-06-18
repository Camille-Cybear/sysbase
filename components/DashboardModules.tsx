"use client";

import { useEffect, useState } from "react";
import { ModuleCard } from "@/components/ModuleCard";
import { MODULES, type ModuleSlug } from "@/data/modules";
import { getModuleProgress, loadProgress } from "@/lib/progress";

export interface DashboardModulesProps {
  /** IDs des flashcards par module, pour calculer la progression réelle. */
  cardIdsByModule: Record<ModuleSlug, string[]>;
}

/**
 * Grille des modules du dashboard, avec progression lue depuis le localStorage.
 *
 * Rendu initial à 0 % (le serveur ignore le localStorage), puis mise à jour
 * après montage pour éviter tout décalage d'hydratation.
 */
export function DashboardModules({ cardIdsByModule }: DashboardModulesProps) {
  const [progress, setProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    const state = loadProgress();
    const next: Record<string, number> = {};
    for (const mod of MODULES) {
      next[mod.slug] = getModuleProgress(cardIdsByModule[mod.slug], state);
    }
    setProgress(next);
  }, [cardIdsByModule]);

  return (
    <div className="mb-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
      {MODULES.map((module) => (
        <ModuleCard
          key={module.slug}
          module={module}
          progress={progress[module.slug] ?? 0}
        />
      ))}
    </div>
  );
}
