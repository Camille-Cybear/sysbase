import Link from "next/link";
import { Network, Binary, Layers, ArrowRight } from "lucide-react";

interface Exercise {
  href: string;
  title: string;
  description: string;
  icon: typeof Network;
  available: boolean;
}

const EXERCISES: Exercise[] = [
  {
    href: "/exercices/subnetting",
    title: "Subnetting",
    description:
      "Calcule l'adresse réseau, le broadcast et le nombre d'hôtes à partir d'une IP/CIDR.",
    icon: Network,
    available: true,
  },
  {
    href: "/exercices/binaire",
    title: "Conversion binaire",
    description:
      "Convertis entre décimal et binaire, sur un octet ou une IP complète.",
    icon: Binary,
    available: true,
  },
  {
    href: "/exercices/vlsm",
    title: "VLSM",
    description:
      "Découpe un réseau en sous-réseaux de tailles variables selon des besoins en hôtes.",
    icon: Layers,
    available: false,
  },
];

export const metadata = {
  title: "Exercices",
  description:
    "Entraîne-toi en pratique : subnetting et conversion binaire, avec questions générées aléatoirement.",
};

export default function ExercisesPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <header className="mb-5">
        <h1 className="text-base font-medium">Exercices</h1>
        <p className="mt-1 text-sm text-muted">
          Entraîne-toi en pratique avec des questions générées aléatoirement.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {EXERCISES.map((ex) => {
          const Icon = ex.icon;
          const content = (
            <>
              <div className="mb-3 flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                {ex.available ? (
                  <ArrowRight className="h-4 w-4 text-muted" aria-hidden="true" />
                ) : (
                  <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-muted">
                    Bientôt
                  </span>
                )}
              </div>
              <h2 className="text-sm font-medium text-text">{ex.title}</h2>
              <p className="mt-1 text-xs text-muted">{ex.description}</p>
            </>
          );

          return ex.available ? (
            <Link
              key={ex.href}
              href={ex.href}
              className="block rounded-xl border border-border bg-card p-4 transition hover:border-primary-mid/50"
            >
              {content}
            </Link>
          ) : (
            <div
              key={ex.href}
              className="rounded-xl border border-border bg-card p-4 opacity-60"
            >
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
}
