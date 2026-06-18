"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { search } from "@/lib/search";
import { RichText } from "@/components/RichText";

export interface SearchViewProps {
  /** Requête initiale (issue de `?q=`). */
  initialQuery?: string;
}

/** Page de recherche : filtrage full-text live sur le contenu (Fuse.js). */
export function SearchView({ initialQuery = "" }: SearchViewProps) {
  const [query, setQuery] = useState(initialQuery);

  const results = useMemo(() => search(query), [query]);
  const trimmed = query.trim();

  return (
    <div className="mx-auto max-w-3xl">
      {/* Champ de recherche */}
      <div className="relative mb-5">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted"
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          placeholder="Rechercher une notion, commande, protocole…"
          aria-label="Rechercher"
          className="w-full rounded-lg border border-border bg-card py-2.5 pl-10 pr-3 text-sm text-text placeholder:text-muted focus:border-primary"
        />
      </div>

      {/* Résultats */}
      {trimmed.length < 2 ? (
        <p className="py-10 text-center text-sm text-muted">
          Saisis au moins 2 caractères pour lancer la recherche.
        </p>
      ) : results.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted">
          Aucun résultat pour «&nbsp;{trimmed}&nbsp;».
        </p>
      ) : (
        <>
          <p className="mb-3 text-xs text-muted">
            {results.length} résultat{results.length > 1 ? "s" : ""}
          </p>
          <ul className="space-y-2">
            {results.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className="block rounded-lg border border-border bg-card p-3.5 transition hover:border-primary-mid/50"
                >
                  <div className="mb-1 flex items-center gap-2">
                    <span
                      className="rounded px-1.5 py-px text-[10px] font-medium"
                      style={{
                        backgroundColor: `${item.moduleColor}26`,
                        color: item.moduleColor,
                      }}
                    >
                      {item.moduleName}
                    </span>
                    <span className="text-[11px] uppercase tracking-wide text-muted">
                      {item.theme}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-text">{item.title}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-muted">
                    <RichText>{item.excerpt}</RichText>
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
