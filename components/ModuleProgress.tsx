"use client";

import { useEffect, useState } from "react";
import { getModuleProgress } from "@/lib/progress";

export interface ModuleProgressProps {
  /** IDs des cartes du module, pour calculer le pourcentage maîtrisé. */
  cardIds: string[];
  /** Couleur d'accent de la barre. */
  color: string;
}

/**
 * Barre de progression d'un module alimentée par le localStorage.
 *
 * Démarre à 0 puis lit la progression réelle après montage, pour éviter tout
 * décalage d'hydratation (le serveur ne connaît pas le localStorage).
 */
export function ModuleProgress({ cardIds, color }: ModuleProgressProps) {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    setPercent(getModuleProgress(cardIds));
  }, [cardIds]);

  return (
    <div>
      <div className="mb-1.5 flex justify-between text-[11px] text-muted">
        <span>Progression</span>
        <span>{percent}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${percent}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
