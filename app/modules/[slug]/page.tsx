import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Layers, FileText, Play, HelpCircle } from "lucide-react";
import { MODULES, getModule } from "@/data/modules";
import { getFlashcards } from "@/lib/flashcards";
import { getFichesByModule } from "@/lib/mdx";
import { getQuiz } from "@/lib/quiz";
import { ModuleProgress } from "@/components/ModuleProgress";
import { DifficultyBadge } from "@/components/DifficultyBadge";
import { QuizScoreBadge } from "@/components/QuizScoreBadge";

interface ModulePageProps {
  params: Promise<{ slug: string }>;
}

/** Prégénère les 6 pages modules au build. */
export function generateStaticParams() {
  return MODULES.map((module) => ({ slug: module.slug }));
}

export async function generateMetadata({ params }: ModulePageProps): Promise<Metadata> {
  const { slug } = await params;
  const mod = getModule(slug);
  if (!mod) return {};
  const title = `Réviser ${mod.name}`;
  const description = `${mod.description} Fiches, flashcards et quiz pour réviser ${mod.name} sur sysbase.`;
  return {
    title,
    description,
    openGraph: { title, description },
  };
}

export default async function ModulePage({ params }: ModulePageProps) {
  const { slug } = await params;
  const mod = getModule(slug);
  if (!mod) notFound();

  const Icon = mod.icon;
  const cards = getFlashcards(mod.slug);
  const cardIds = cards.map((c) => c.id);
  const hasCards = cards.length > 0;
  const fiches = getFichesByModule(mod.slug);
  const hasQuiz = getQuiz(mod.slug).length > 0;

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/"
        className="mb-4 inline-flex items-center gap-1.5 text-xs text-muted transition hover:text-text"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        Tous les modules
      </Link>

      {/* En-tête module */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-start gap-3.5">
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${mod.color}26`, color: mod.color }}
          >
            <Icon className="h-6 w-6" aria-hidden="true" />
          </span>
          <div className="flex-1">
            <h1 className="text-lg font-medium">{mod.name}</h1>
            <p className="mt-0.5 text-sm text-muted">{mod.description}</p>
          </div>
        </div>

        <div className="mt-5">
          <ModuleProgress cardIds={cardIds} color={mod.color} />
        </div>

        {/* Stats + CTA */}
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <span className="inline-flex items-center gap-1.5 text-xs text-muted">
            <Layers className="h-4 w-4" aria-hidden="true" />
            {cards.length} flashcards
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs text-muted">
            <FileText className="h-4 w-4" aria-hidden="true" />
            {fiches.length} fiche{fiches.length > 1 ? "s" : ""}
          </span>
          <span className="flex-1" />
          {hasQuiz && <QuizScoreBadge moduleSlug={mod.slug} variant="inline" />}
          {hasQuiz && (
            <Link
              href={`/quiz/${mod.slug}`}
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-4 py-2 text-sm text-muted transition hover:border-primary/60 hover:text-text"
            >
              <HelpCircle className="h-4 w-4" aria-hidden="true" />
              Quiz
            </Link>
          )}
          {hasCards ? (
            <Link
              href={`/flashcards?module=${mod.slug}`}
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90"
            >
              <Play className="h-4 w-4" aria-hidden="true" />
              Réviser ce module
            </Link>
          ) : (
            !hasQuiz && (
              <span className="rounded-md border border-border px-4 py-2 text-sm text-muted">
                Bientôt disponible
              </span>
            )
          )}
        </div>
      </div>

      {/* Fiches tuto du module */}
      {fiches.length > 0 && (
        <section className="mt-6" aria-labelledby="fiches-heading">
          <h2 id="fiches-heading" className="mb-3 text-sm font-medium text-muted">
            Fiches tuto
          </h2>
          <ul className="space-y-2">
            {fiches.map((fiche) => (
              <li key={fiche.href}>
                <Link
                  href={fiche.href}
                  className="flex items-start gap-3 rounded-lg border border-border bg-card p-3.5 transition hover:border-primary-mid/50"
                >
                  <FileText
                    className="mt-0.5 h-4 w-4 shrink-0 text-muted"
                    aria-hidden="true"
                  />
                  <span className="flex-1">
                    <span className="block text-sm font-medium text-text">
                      {fiche.title}
                    </span>
                    <span className="mt-0.5 block text-xs text-muted">
                      {fiche.theme}
                    </span>
                  </span>
                  <DifficultyBadge difficulty={fiche.difficulty} />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Aperçu des flashcards */}
      {hasCards && (
        <section className="mt-6" aria-labelledby="cards-heading">
          <h2 id="cards-heading" className="mb-3 text-sm font-medium text-muted">
            Aperçu des flashcards
          </h2>
          <ul className="space-y-2">
            {cards.map((card) => (
              <li
                key={card.id}
                className="rounded-lg border border-border bg-card p-3.5"
              >
                <span
                  className="text-[11px] font-medium uppercase tracking-wide"
                  style={{ color: mod.color }}
                >
                  {card.theme}
                </span>
                <p className="mt-1 text-sm text-text">{card.question}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
