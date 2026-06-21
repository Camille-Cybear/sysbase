import { SearchView } from "@/components/SearchView";
import { getFlashcardSearchItems } from "@/lib/search";
import { getFicheSearchItems } from "@/lib/mdx";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  // Index combiné : flashcards (client-safe) + fiches (lecture disque, serveur).
  const items = [...getFlashcardSearchItems(), ...getFicheSearchItems()];

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-4 text-base font-medium">Recherche</h1>
      <SearchView initialQuery={q ?? ""} items={items} />
    </div>
  );
}
