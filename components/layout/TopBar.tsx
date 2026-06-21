import Link from "next/link";
import { Play, Layers } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { MobileNav } from "@/components/layout/MobileNav";
import type { SidebarCounts } from "@/components/layout/NavContent";

export interface TopBarProps {
  /** Compteurs de contenu pour le menu mobile. */
  counts: SidebarCounts;
  /** IDs de toutes les flashcards, pour la progression du menu mobile. */
  allCardIds: string[];
}

/**
 * Barre supérieure : menu mobile (hamburger) + recherche + actions rapides.
 */
export function TopBar({ counts, allCardIds }: TopBarProps) {
  return (
    <header className="flex items-center gap-3 border-b border-border bg-sidebar px-4 py-3 sm:px-5">
      {/* Menu de navigation mobile (la sidebar prend le relais sur desktop) */}
      <MobileNav counts={counts} allCardIds={allCardIds} />

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
