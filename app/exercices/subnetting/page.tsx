import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SubnetTrainer } from "@/components/SubnetTrainer";

export const metadata = {
  title: "Entraînement subnetting",
  description:
    "Calcule adresse réseau, broadcast et nombre d'hôtes sur des questions aléatoires, à trois niveaux.",
};

export default function SubnettingPage() {
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
        <h1 className="text-base font-medium">Entraînement — Subnetting</h1>
        <p className="mt-1 text-sm text-muted">
          Calcule l&apos;adresse réseau, le broadcast et le nombre d&apos;hôtes.
        </p>
      </div>

      <SubnetTrainer />
    </div>
  );
}
