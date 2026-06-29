"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Layers,
  FileText,
  HelpCircle,
  Dumbbell,
  Newspaper,
  Server,
  Info,
} from "lucide-react";
import { MODULES } from "@/data/modules";
import { getModuleProgress } from "@/lib/progress";

/** Compteurs de contenu affichés dans les badges (calculés côté serveur). */
export interface SidebarCounts {
  modules: number;
  flashcards: number;
  fiches: number;
  quiz: number;
}

export interface NavContentProps {
  /** Compteurs de contenu pour les badges. */
  counts: SidebarCounts;
  /** IDs de toutes les flashcards, pour la progression globale (localStorage). */
  allCardIds: string[];
  /** Appelé au clic sur un lien (sert à fermer le tiroir mobile). */
  onNavigate?: () => void;
}

interface NavLink {
  href: string;
  label: string;
  icon: typeof LayoutGrid;
  /** Compteur optionnel affiché en badge. */
  badge?: number;
}

/**
 * Contenu de navigation partagé entre la sidebar desktop et le tiroir mobile :
 * logo, liens de révision, modules, « À propos » et progression globale.
 */
export function NavContent({ counts, allCardIds, onNavigate }: NavContentProps) {
  const pathname = usePathname();

  // Progression globale réelle (localStorage), recalculée à chaque navigation.
  const [globalProgress, setGlobalProgress] = useState(0);
  useEffect(() => {
    setGlobalProgress(getModuleProgress(allCardIds));
  }, [allCardIds, pathname]);

  const revisionLinks: NavLink[] = [
    { href: "/", label: "Modules", icon: LayoutGrid, badge: counts.modules },
    { href: "/flashcards", label: "Flashcards", icon: Layers, badge: counts.flashcards },
    { href: "/fiches", label: "Fiches tuto", icon: FileText, badge: counts.fiches },
    { href: "/quiz/reseaux", label: "Quiz QCM", icon: HelpCircle, badge: counts.quiz },
    { href: "/exercices", label: "Exercices", icon: Dumbbell },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const navItemClass = (active: boolean) =>
    `flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition ${
      active
        ? "bg-primary/15 font-medium text-primary"
        : "text-muted hover:bg-white/5 hover:text-text"
    }`;

  return (
    <>
      {/* Logo — retour à l'accueil */}
      <Link
        href="/"
        onClick={onNavigate}
        aria-label="sysbase — accueil"
        className="flex items-center gap-2.5 border-b border-border px-4 py-4 transition hover:bg-white/5"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <Server className="h-[18px] w-[18px] text-white" aria-hidden="true" />
        </span>
        <span className="leading-tight">
          <span className="block text-[15px] font-semibold tracking-tight">
            sysbase
          </span>
          <span className="block text-[11px] text-muted">
            Révisions certifications IT
          </span>
        </span>
      </Link>

      {/* Navigation */}
      <nav
        className="flex-1 overflow-y-auto px-2.5 py-3"
        aria-label="Navigation principale"
      >
        <p className="px-2 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-muted">
          Révision
        </p>
        <ul className="space-y-0.5">
          {revisionLinks.map(({ href, label, icon: Icon, badge }) => {
            const active = isActive(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={onNavigate}
                  className={navItemClass(active)}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                  <span className="flex-1">{label}</span>
                  {badge !== undefined && (
                    <span
                      className={`rounded-full px-1.5 py-px text-[10px] ${
                        active
                          ? "bg-primary/25 text-primary"
                          : "bg-white/5 text-muted"
                      }`}
                    >
                      {badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <p className="px-2 pb-1 pt-5 text-[10px] font-semibold uppercase tracking-wider text-muted">
          Modules
        </p>
        <ul className="space-y-0.5">
          {MODULES.map((module) => {
            const href = `/modules/${module.slug}`;
            const active = isActive(href);
            const Icon = module.icon;
            return (
              <li key={module.slug}>
                <Link
                  href={href}
                  onClick={onNavigate}
                  className={navItemClass(active)}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon
                    className="h-[18px] w-[18px]"
                    style={{ color: active ? undefined : module.color }}
                    aria-hidden="true"
                  />
                  {module.name}
                </Link>
              </li>
            );
          })}
        </ul>

        <ul className="mt-5 space-y-0.5 border-t border-border pt-3">
          <li>
            <Link
              href="/blog"
              onClick={onNavigate}
              className={navItemClass(isActive("/blog"))}
              aria-current={isActive("/blog") ? "page" : undefined}
            >
              <Newspaper className="h-[18px] w-[18px]" aria-hidden="true" />
              Blog
            </Link>
          </li>
          <li>
            <Link
              href="/a-propos"
              onClick={onNavigate}
              className={navItemClass(isActive("/a-propos"))}
              aria-current={isActive("/a-propos") ? "page" : undefined}
            >
              <Info className="h-[18px] w-[18px]" aria-hidden="true" />
              À propos
            </Link>
          </li>
        </ul>
      </nav>

      {/* Progression globale */}
      <div className="border-t border-border px-4 py-3">
        <div className="mb-1.5 flex justify-between text-[11px] text-muted">
          <span>Progression globale</span>
          <span>{globalProgress}%</span>
        </div>
        <div className="h-1 overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${globalProgress}%` }}
          />
        </div>
      </div>
    </>
  );
}
