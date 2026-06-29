import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BinaryTrainer } from "@/components/BinaryTrainer";

export default function BinaryPage() {
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
        <h1 className="text-base font-medium">Entraînement — Conversion binaire</h1>
        <p className="mt-1 text-sm text-muted">
          Convertis entre décimal et binaire, sur un octet ou une IP complète.
        </p>
      </div>

      <BinaryTrainer />
    </div>
  );
}
