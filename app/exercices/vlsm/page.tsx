import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { VlsmTrainer } from "@/components/VlsmTrainer";

export const metadata = {
  title: "Entraînement VLSM",
  description:
    "Découpe un réseau en sous-réseaux de tailles variables selon des besoins en hôtes (VLSM).",
};

export default function VlsmPage() {
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
        <h1 className="text-base font-medium">Entraînement — VLSM</h1>
        <p className="mt-1 text-sm text-muted">
          Alloue des sous-réseaux de tailles variables, du plus grand au plus
          petit besoin.
        </p>
      </div>

      <VlsmTrainer />
    </div>
  );
}
