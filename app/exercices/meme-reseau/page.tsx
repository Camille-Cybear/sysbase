import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SameSubnetTrainer } from "@/components/SameSubnetTrainer";

export const metadata = {
  title: "Entraînement même sous-réseau",
  description:
    "Détermine si deux adresses IP appartiennent au même sous-réseau selon leur masque.",
};

export default function SameSubnetPage() {
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
        <h1 className="text-base font-medium">Entraînement — Même sous-réseau ?</h1>
        <p className="mt-1 text-sm text-muted">
          Deux IP communiquent-elles directement, ou faut-il un routeur ?
        </p>
      </div>
      <SameSubnetTrainer />
    </div>
  );
}
