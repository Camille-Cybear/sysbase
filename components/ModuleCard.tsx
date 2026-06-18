import Link from "next/link";
import type { Module } from "@/data/modules";

export interface ModuleCardProps {
  /** Module à représenter. */
  module: Module;
  /** Progression de l'utilisateur sur le module (0–100). */
  progress?: number;
  /** Met en évidence la carte (bordure d'accent). */
  active?: boolean;
}

/**
 * Carte d'un module affichée sur le dashboard.
 *
 * TODO (MVP) : brancher la barre de progression réelle (localStorage).
 */
export function ModuleCard({
  module,
  progress = 0,
  active = false,
}: ModuleCardProps) {
  const Icon = module.icon;

  return (
    <Link
      href={`/modules/${module.slug}`}
      className={`block rounded-xl border bg-card p-3.5 transition hover:border-primary-mid/50 ${
        active ? "border-primary-mid/60" : "border-border"
      }`}
    >
      <span
        className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg"
        style={{ backgroundColor: `${module.color}26`, color: module.color }}
      >
        <Icon className="h-[17px] w-[17px]" aria-hidden="true" />
      </span>

      <h3 className="text-[13px] font-medium text-text">{module.name}</h3>
      <p className="mb-2 mt-0.5 text-[11px] text-muted">{module.topics}</p>

      {/* Barre de progression */}
      <div className="h-[3px] overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full"
          style={{ width: `${progress}%`, backgroundColor: module.color }}
        />
      </div>
    </Link>
  );
}
