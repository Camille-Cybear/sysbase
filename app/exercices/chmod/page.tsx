import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ChmodTrainer } from "@/components/ChmodTrainer";

export const metadata = {
  title: "Entraînement permissions chmod",
  description:
    "Convertis les permissions Linux entre notation octale (755) et symbolique (rwxr-xr-x).",
};

export default function ChmodPage() {
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
        <h1 className="text-base font-medium">Entraînement — Permissions chmod</h1>
        <p className="mt-1 text-sm text-muted">
          Convertis entre octal et symbolique, dans les deux sens.
        </p>
      </div>
      <ChmodTrainer />
    </div>
  );
}
