import { NavContent, type SidebarCounts } from "@/components/layout/NavContent";

export interface SidebarProps {
  /** Compteurs de contenu pour les badges. */
  counts: SidebarCounts;
  /** IDs de toutes les flashcards, pour la progression globale (localStorage). */
  allCardIds: string[];
}

/**
 * Barre latérale de navigation principale (desktop).
 *
 * Cachée sous `lg` (mobile-first) ; la navigation mobile passe par `MobileNav`
 * dans la TopBar.
 */
export function Sidebar({ counts, allCardIds }: SidebarProps) {
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-sidebar lg:flex">
      <NavContent counts={counts} allCardIds={allCardIds} />
    </aside>
  );
}
