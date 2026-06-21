import { notFound } from "next/navigation";
import { FlashCardSession } from "@/components/FlashCardSession";
import { getFlashcards, getAllFlashcards } from "@/lib/flashcards";
import { getModule } from "@/data/modules";

interface FlashcardsPageProps {
  searchParams: { module?: string; mode?: string };
}

export default function FlashcardsPage({ searchParams }: FlashcardsPageProps) {
  // Mode « cartes à revoir » : toutes les cartes, filtrées côté client.
  if (searchParams.mode === "review") {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="mb-3.5 flex items-center justify-between">
          <h1 className="text-base font-medium">Révision — cartes à revoir</h1>
          <span className="text-xs text-muted">tous modules</span>
        </div>
        <FlashCardSession
          cards={getAllFlashcards()}
          moduleName="Cartes à revoir"
          mode="review"
        />
      </div>
    );
  }

  // Mode module : ?module=slug ; Réseaux par défaut.
  const mod = getModule(searchParams.module ?? "reseaux");
  if (!mod) notFound();

  const cards = getFlashcards(mod.slug);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-3.5 flex items-center justify-between">
        <h1 className="text-base font-medium">Révision — {mod.name}</h1>
        <span className="text-xs text-muted">{cards.length} cartes</span>
      </div>
      <FlashCardSession cards={cards} moduleName={mod.name} />
    </div>
  );
}
