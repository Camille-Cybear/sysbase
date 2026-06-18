import Link from "next/link";
import { FileText } from "lucide-react";
import { getAllFiches } from "@/lib/mdx";
import { MODULES } from "@/data/modules";
import { DifficultyBadge } from "@/components/DifficultyBadge";

export default function FichesPage() {
  const fiches = getAllFiches();

  // Regroupe les fiches par module, dans l'ordre des modules.
  const byModule = MODULES.map((module) => ({
    module,
    fiches: fiches.filter((fiche) => fiche.module === module.slug),
  })).filter((group) => group.fiches.length > 0);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-base font-medium">Fiches tuto</h1>
        <span className="text-xs text-muted">{fiches.length} fiches</span>
      </div>

      {byModule.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted">
          Aucune fiche disponible pour l&apos;instant.
        </p>
      ) : (
        <div className="space-y-6">
          {byModule.map(({ module, fiches }) => (
            <section key={module.slug} aria-labelledby={`mod-${module.slug}`}>
              <h2
                id={`mod-${module.slug}`}
                className="mb-2 text-sm font-medium"
                style={{ color: module.color }}
              >
                {module.name}
              </h2>
              <ul className="space-y-2">
                {fiches.map((fiche) => (
                  <li key={fiche.href}>
                    <Link
                      href={fiche.href}
                      className="flex items-start gap-3 rounded-lg border border-border bg-card p-3.5 transition hover:border-primary-mid/50"
                    >
                      <FileText
                        className="mt-0.5 h-4 w-4 shrink-0 text-muted"
                        aria-hidden="true"
                      />
                      <span className="flex-1">
                        <span className="block text-sm font-medium text-text">
                          {fiche.title}
                        </span>
                        <span className="mt-0.5 block text-xs text-muted">
                          {fiche.theme}
                        </span>
                      </span>
                      <DifficultyBadge difficulty={fiche.difficulty} />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
