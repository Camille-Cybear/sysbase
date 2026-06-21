import { SearchView } from "@/components/SearchView";
import { getFlashcardSearchItems } from "@/lib/search";
import { getFicheSearchItems } from "@/lib/mdx";

interface SearchPageProps {
  searchParams: { q?: string };
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  // Index combiné : flashcards (client-safe) + fiches (lecture disque, serveur).
  const items = [...getFlashcardSearchItems(), ...getFicheSearchItems()];

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-4 text-base font-medium">Recherche</h1>
      <SearchView initialQuery={searchParams.q ?? ""} items={items} />
    </div>
  );
}
