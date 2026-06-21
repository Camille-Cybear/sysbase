import type { Metadata } from "next";
import { Sparkles, GraduationCap, Code2, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "À propos — sysbase",
  description:
    "sysbase, plateforme de révision pour les certifications IT, imaginée et rédigée par Camille, étudiant TSSR, avec l'aide de Claude.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-semibold">À propos de sysbase</h1>
      <p className="mt-2 text-muted">
        Une plateforme de révision pour les certifications IT, pensée pour être
        moderne, rapide et agréable sur mobile.
      </p>

      <div className="mt-8 space-y-5">
        <section className="rounded-xl border border-border bg-card p-5">
          <div className="mb-2 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
            <h2 className="text-base font-medium">L'idée</h2>
          </div>
          <p className="text-sm leading-relaxed text-muted">
            <strong className="text-text">sysbase</strong> est né d'un constat
            simple : les sites de révision existants pour la certification{" "}
            <strong className="text-text">TSSR</strong> sont vieillissants et peu
            adaptés au mobile. L'objectif est d'offrir un outil clair — fiches,
            flashcards et quiz — pour réviser efficacement, avec à terme
            plusieurs parcours de certification.
          </p>
        </section>

        <section className="rounded-xl border border-border bg-card p-5">
          <div className="mb-2 flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" aria-hidden="true" />
            <h2 className="text-base font-medium">L'auteur</h2>
          </div>
          <p className="text-sm leading-relaxed text-muted">
            Le projet est{" "}
            <strong className="text-text">
              imaginé et rédigé par Camille
            </strong>
            , étudiant en <strong className="text-text">TSSR</strong> (Technicien
            Supérieur Systèmes et Réseaux) en reconversion vers la
            cybersécurité. Le contenu des fiches et flashcards est écrit en
            parallèle du cours, à partir de notes personnelles.
          </p>
        </section>

        <section className="rounded-xl border border-border bg-card p-5">
          <div className="mb-2 flex items-center gap-2">
            <Code2 className="h-5 w-5 text-primary" aria-hidden="true" />
            <h2 className="text-base font-medium">Comment c'est fait</h2>
          </div>
          <p className="text-sm leading-relaxed text-muted">
            sysbase est{" "}
            <strong className="text-text">propulsé à l'aide de Claude</strong>{" "}
            (l'IA d'Anthropic), dans une démarche d'apprentissage : explorer le
            développement web moderne tout en construisant un outil réellement
            utile. Stack : Next.js 14, Tailwind CSS, TypeScript, MDX.
          </p>
        </section>

        <section className="rounded-xl border border-border bg-card p-5">
          <div className="mb-2 flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" aria-hidden="true" />
            <h2 className="text-base font-medium">Un projet vivant</h2>
          </div>
          <p className="text-sm leading-relaxed text-muted">
            Le contenu s'enrichit régulièrement. Une remarque, une erreur
            repérée, une suggestion&nbsp;? N'hésite pas à passer par{" "}
            <a
              href="https://cybear.fr"
              className="text-primary underline-offset-2 hover:underline"
            >
              cybear.fr
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
