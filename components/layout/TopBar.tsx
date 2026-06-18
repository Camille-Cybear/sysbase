import Link from "next/link";
import { Play, Layers, Server } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";

/**
 * Barre supérieure : recherche + actions rapides.
 */
export function TopBar() {
  return (
    <header className="flex items-center gap-3 border-b border-border bg-sidebar px-4 py-3 sm:px-5">
      {/* Marque visible uniquement sur mobile (la sidebar la porte sur desktop) */}
      <Link href="/" className="flex items-center gap-2 lg:hidden" aria-label="Accueil TSSRev">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Server className="h-4 w-4 text-white" aria-hidden="true" />
        </span>
      </Link>

      {/* Recherche */}
      <SearchBar />

      {/* Actions */}
      <div className="flex shrink-0 gap-2">
        <Link
          href="/quiz/reseaux"
          className="hidden items-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs text-muted transition hover:border-primary/60 hover:text-text sm:inline-flex"
        >
          <Play className="h-4 w-4" aria-hidden="true" />
          Quiz rapide
        </Link>
        <Link
          href="/flashcards"
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs font-medium text-white transition hover:bg-primary/90"
        >
          <Layers className="h-4 w-4" aria-hidden="true" />
          Réviser
        </Link>
      </div>
    </header>
  );
}
