import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AclTrainer } from "@/components/AclTrainer";

export const metadata = {
  title: "Entraînement ACL",
  description:
    "Lis une liste de contrôle d'accès et détermine si un paquet est autorisé ou refusé.",
};

export default function AclPage() {
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
        <h1 className="text-base font-medium">Entraînement — ACL</h1>
        <p className="mt-1 text-sm text-muted">
          Le paquet passe-t-il l&apos;ACL ? Évalue les règles de haut en bas.
        </p>
      </div>
      <AclTrainer />
    </div>
  );
}
