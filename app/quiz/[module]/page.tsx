import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { MODULES, getModule } from "@/data/modules";
import { getQuiz } from "@/lib/quiz";
import { QuizEngine } from "@/components/QuizEngine";
import { QuizScoreBadge } from "@/components/QuizScoreBadge";

interface QuizPageProps {
  params: { module: string };
}

/** Prégénère une page quiz par module. */
export function generateStaticParams() {
  return MODULES.map((module) => ({ module: module.slug }));
}

export default function QuizPage({ params }: QuizPageProps) {
  const mod = getModule(params.module);
  if (!mod) notFound();

  const questions = getQuiz(mod.slug);

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href={`/modules/${mod.slug}`}
        className="mb-4 inline-flex items-center gap-1.5 text-xs text-muted transition hover:text-text"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        {mod.name}
      </Link>

      <div className="mb-3.5 flex items-center justify-between gap-3">
        <h1 className="text-base font-medium">Quiz — {mod.name}</h1>
        <div className="flex items-center gap-3">
          <QuizScoreBadge moduleSlug={mod.slug} />
          <span className="text-xs text-muted">
            {questions.length} question{questions.length > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <QuizEngine
        questions={questions}
        moduleSlug={mod.slug}
        moduleName={mod.name}
      />
    </div>
  );
}
