import { DashboardModules } from "@/components/DashboardModules";
import { DailyFlashcard } from "@/components/DailyFlashcard";
import { ReviewBanner } from "@/components/ReviewBanner";
import { MODULES, type ModuleSlug } from "@/data/modules";
import { getFlashcards } from "@/lib/flashcards";

export default function DashboardPage() {
  // IDs des flashcards par module, pour la progression réelle (côté client).
  const cardIdsByModule = Object.fromEntries(
    MODULES.map((module) => [module.slug, getFlashcards(module.slug).map((c) => c.id)]),
  ) as Record<ModuleSlug, string[]>;
  const allCardIds = Object.values(cardIdsByModule).flat();

  // Flashcard du jour : rotation déterministe sur les cartes Réseaux.
  const dailyCards = getFlashcards("reseaux");
  const dayIndex =
    dailyCards.length > 0
      ? Math.floor(Date.now() / 86_400_000) % dailyCards.length
      : 0;
  const dailyCard = dailyCards[dayIndex];

  return (
    <div className="mx-auto max-w-5xl">
      {/* Invite à réviser les cartes « à revoir » (masquée si aucune) */}
      <ReviewBanner allCardIds={allCardIds} />

      {/* Modules : bascule grille/liste + progression réelle */}
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
