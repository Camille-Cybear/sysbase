import type { Metadata } from "next";
import { Mail, Github, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "Camille",
  description:
    "Camille — étudiant TSSR en reconversion vers la cybersécurité, auteur de sysbase.",
};

export default function CamillePage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-semibold">Camille</h1>
      <p className="mt-2 text-muted">
        Étudiant TSSR en reconversion vers la cybersécurité, et auteur de
        sysbase.
      </p>

      <div className="mt-8 rounded-xl border border-border bg-card p-5">
        <p className="text-sm leading-relaxed text-text/90">
          {/* TODO : présentation à compléter — parcours, objectifs, projets. */}
          Page en cours de rédaction. J&apos;y détaillerai bientôt mon parcours,
          mes objectifs et les projets sur lesquels je travaille.
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <a
            href="https://cybear.fr"
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm text-muted transition hover:border-primary/60 hover:text-text"
          >
            <Globe className="h-4 w-4" aria-hidden="true" />
            cybear.fr
          </a>
          <a
            href="https://github.com/Camille-Cybear"
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm text-muted transition hover:border-primary/60 hover:text-text"
          >
            <Github className="h-4 w-4" aria-hidden="true" />
            GitHub
          </a>
          <a
            href="mailto:camille@cybear.fr"
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm text-muted transition hover:border-primary/60 hover:text-text"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            Contact
          </a>
        </div>
      </div>
    </div>
  );
}
