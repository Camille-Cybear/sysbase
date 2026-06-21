"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { NavContent, type SidebarCounts } from "@/components/layout/NavContent";

export interface MobileNavProps {
  /** Compteurs de contenu pour les badges. */
  counts: SidebarCounts;
  /** IDs de toutes les flashcards, pour la progression globale. */
  allCardIds: string[];
}

/**
 * Navigation mobile : bouton hamburger ouvrant un tiroir latéral réutilisant
 * `NavContent`. Visible uniquement sous `lg` (la sidebar prend le relais au-delà).
 */
export function MobileNav({ counts, allCardIds }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Ferme le tiroir à chaque changement de route.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Échap pour fermer + blocage du scroll de fond quand le tiroir est ouvert.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Ouvrir le menu"
        aria-expanded={open}
        className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted transition hover:text-text"
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
          {/* Voile */}
          <button
            type="button"
            aria-label="Fermer le menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/60"
          />
          {/* Tiroir */}
          <div className="absolute inset-y-0 left-0 flex w-72 max-w-[82%] flex-col border-r border-border bg-sidebar shadow-xl">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fermer le menu"
              className="absolute right-2 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-md text-muted transition hover:bg-white/5 hover:text-text"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
            <NavContent
              counts={counts}
              allCardIds={allCardIds}
              onNavigate={() => setOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
