import { notFound } from "next/navigation";
import { FlashCardSession } from "@/components/FlashCardSession";
import { getFlashcards } from "@/lib/flashcards";
import { getModule } from "@/data/modules";

interface FlashcardsPageProps {
  searchParams: { module?: string };
}

export default function FlashcardsPage({ searchParams }: FlashcardsPageProps) {
  // Module ciblé via ?module=slug ; Réseaux par défaut.
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
