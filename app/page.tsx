import { DashboardModules } from "@/components/DashboardModules";
import { DailyFlashcard } from "@/components/DailyFlashcard";
import { MODULES, type ModuleSlug } from "@/data/modules";
import { getFlashcards } from "@/lib/flashcards";

export default function DashboardPage() {
  // IDs des flashcards par module, pour la progression réelle (côté client).
  const cardIdsByModule = Object.fromEntries(
    MODULES.map((module) => [module.slug, getFlashcards(module.slug).map((c) => c.id)]),
  ) as Record<ModuleSlug, string[]>;

  // Flashcard du jour : rotation déterministe sur les cartes Réseaux.
  const dailyCards = getFlashcards("reseaux");
  const dayIndex =
    dailyCards.length > 0
      ? Math.floor(Date.now() / 86_400_000) % dailyCards.length
      : 0;
  const dailyCard = dailyCards[dayIndex];

  return (
    <div className="mx-auto max-w-5xl">
      {/* En-tête modules */}
      <div className="mb-3.5 flex items-center justify-between">
        <h1 className="text-base font-medium">Modules</h1>
        <div className="flex gap-1" role="group" aria-label="Affichage">
          <button
            type="button"
            className="rounded-md border border-primary-mid/50 bg-primary/15 px-2 py-1 text-[11px] text-primary"
            aria-pressed="true"
          >
            Grille
          </button>
          <button
            type="button"
            className="rounded-md border border-border px-2 py-1 text-[11px] text-muted transition hover:text-text"
            aria-pressed="false"
          >
            Liste
          </button>
        </div>
      </div>

      {/* Grille des modules (progression réelle) */}
      <DashboardModules cardIdsByModule={cardIdsByModule} />

      {/* Flashcard du jour */}
      <div className="mb-3.5 flex items-center justify-between">
        <h2 className="text-base font-medium">Flashcard du jour — Réseaux</h2>
        <span className="text-xs text-muted">Mode révision</span>
      </div>
      {dailyCard && (
        <DailyFlashcard
          card={dailyCard}
          index={dayIndex + 1}
          total={dailyCards.length}
        />
      )}
    </div>
  );
}
