"use client";

import { useState, type FormEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search } from "lucide-react";

/**
 * Barre de recherche du TopBar : redirige vers `/recherche?q=…` à la validation.
 *
 * Masquée sur la page `/recherche` (qui possède son propre champ), tout en
 * conservant l'alignement des actions du TopBar via un espaceur.
 */
export function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [value, setValue] = useState("");

  if (pathname === "/recherche") {
    return <div className="flex-1" aria-hidden="true" />;
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const query = value.trim();
    if (query.length === 0) return;
    router.push(`/recherche?q=${encodeURIComponent(query)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="relative flex-1" role="search">
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-muted"
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Rechercher une notion, commande, protocole…"
        aria-label="Rechercher"
        className="w-full rounded-md border border-border bg-card py-2 pl-9 pr-3 text-sm text-text placeholder:text-muted focus:border-primary"
      />
    </form>
  );
}
