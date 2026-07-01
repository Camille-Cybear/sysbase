import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { RoutingTrainer } from "@/components/RoutingTrainer";

export const metadata = {
  title: "Entraînement table de routage",
  description:
    "Détermine par quelle route part un paquet en appliquant le longest prefix match.",
};

export default function RoutingPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/exercices"
        className="mb-4 inline-flex items-center gap-1.5 text-xs text-muted transition hover:text-text"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        Exercices
      </Link>
      <div className="mb-3.5">
        <h1 className="text-base font-medium">Entraînement — Table de routage</h1>
        <p className="mt-1 text-sm text-muted">
          Applique le longest prefix match pour trouver la bonne route.
        </p>
      </div>
      <RoutingTrainer />
    </div>
  );
}
