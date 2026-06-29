import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeShiki from "@shikijs/rehype";
import remarkGfm from "remark-gfm";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { getAllFiches, getFiche } from "@/lib/mdx";
import { getModule } from "@/data/modules";
import { mdxComponents } from "@/components/MDXComponents";
import { DifficultyBadge } from "@/components/DifficultyBadge";

interface FichePageProps {
  params: Promise<{ module: string; slug: string }>;
}

/** Prégénère toutes les fiches existantes au build. */
export function generateStaticParams() {
  return getAllFiches().map((fiche) => ({
    module: fiche.module,
    slug: fiche.slug,
  }));
}

export async function generateMetadata({ params }: FichePageProps): Promise<Metadata> {
  const { module: moduleSlug, slug } = await params;
  const fiche = getFiche(moduleSlug, slug);
  if (!fiche) return {};
  const moduleName = getModule(fiche.module)?.name ?? fiche.module;
  const description =
    fiche.description ??
    `Fiche de révision ${moduleName} : ${fiche.title}. ${fiche.tags.slice(0, 4).join(", ")}.`;
  return {
    title: fiche.title,
    description,
    openGraph: { title: fiche.title, description, type: "article" },
  };
}

export default async function FichePage({ params }: FichePageProps) {
  const { module: moduleSlug, slug } = await params;
  const fiche = getFiche(moduleSlug, slug);
  if (!fiche) notFound();

  const mod = getModule(fiche.module);
  const moduleColor = mod?.color ?? "#7B6FD4";
  const updated = new Date(fiche.updatedAt).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="mx-auto max-w-3xl">
      <Link
        href={`/modules/${fiche.module}`}
        className="mb-4 inline-flex items-center gap-1.5 text-xs text-muted transition hover:text-text"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        {mod?.name ?? "Retour"}
      </Link>

      {/* En-tête de la fiche */}
      <header className="mb-6 border-b border-border pb-5">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span
            className="rounded px-1.5 py-0.5 text-[10px] font-medium"
            style={{ backgroundColor: `${moduleColor}26`, color: moduleColor }}
          >
            {fiche.theme}
          </span>
          <DifficultyBadge difficulty={fiche.difficulty} />
        </div>
        <h1 className="text-2xl font-semibold text-text">{fiche.title}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
            Mis à jour le {updated}
          </span>
          <span className="flex flex-wrap gap-1.5">
            {fiche.tags.map((tag) => (
              <span key={tag} className="rounded bg-white/5 px-1.5 py-0.5">
                #{tag}
              </span>
            ))}
          </span>
        </div>
      </header>

      {/* Corps MDX */}
      <div>
        <MDXRemote
          source={fiche.content}
          components={mdxComponents}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [[rehypeShiki, { theme: "github-dark" }]],
            },
          }}
        />
      </div>
    </article>
  );
}
