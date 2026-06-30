import Link from "next/link";

/** Pied de page global : crédits et lien « À propos ». */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border px-5 py-4">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 text-[11px] text-muted sm:flex-row">
        <p>
          © {year} <span className="font-medium text-text">sysbase</span> —
          imaginé et rédigé par{" "}
          <Link
            href="/camille"
            className="text-primary underline-offset-2 hover:underline"
          >
            Camille
          </Link>
          , propulsé à l'aide de Claude.
        </p>
        <Link
          href="/a-propos"
          className="transition hover:text-text"
        >
          À propos
        </Link>
      </div>
    </footer>
  );
}
