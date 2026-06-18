import { SearchView } from "@/components/SearchView";

interface SearchPageProps {
  searchParams: { q?: string };
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-4 text-base font-medium">Recherche</h1>
      <SearchView initialQuery={searchParams.q ?? ""} />
    </div>
  );
}
