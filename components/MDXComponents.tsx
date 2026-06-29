import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

/**
 * Composants custom pour le rendu MDX des fiches tuto (thème dark).
 *
 * Les blocs de code (`pre`) sont colorés en amont par Shiki (rehype) ; on se
 * contente ici d'habiller le conteneur.
 */
export const mdxComponents: MDXComponents = {
  h1: (props: ComponentPropsWithoutRef<"h1">) => (
    <h1 className="mb-4 mt-8 text-2xl font-semibold text-text first:mt-0" {...props} />
  ),
  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <h2 className="mb-3 mt-8 border-b border-border pb-1.5 text-xl font-semibold text-text" {...props} />
  ),
  h3: (props: ComponentPropsWithoutRef<"h3">) => (
    <h3 className="mb-2 mt-6 text-lg font-medium text-text" {...props} />
  ),
  p: (props: ComponentPropsWithoutRef<"p">) => (
    <p className="my-3 text-sm leading-relaxed text-text/90" {...props} />
  ),
  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul className="my-3 list-disc space-y-1.5 pl-5 text-sm text-text/90 marker:text-muted" {...props} />
  ),
  ol: (props: ComponentPropsWithoutRef<"ol">) => (
    <ol className="my-3 list-decimal space-y-1.5 pl-5 text-sm text-text/90 marker:text-muted" {...props} />
  ),
  li: (props: ComponentPropsWithoutRef<"li">) => (
    <li className="leading-relaxed" {...props} />
  ),
  a: ({ href = "#", ...props }: ComponentPropsWithoutRef<"a">) => (
    <Link
      href={href}
      className="font-medium text-primary underline underline-offset-2 hover:text-primary-mid"
      {...props}
    />
  ),
  strong: (props: ComponentPropsWithoutRef<"strong">) => (
    <strong className="font-semibold text-text" {...props} />
  ),
  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      className="my-4 border-l-2 border-primary-mid/60 bg-card py-2 pl-4 pr-3 text-sm italic text-muted"
      {...props}
    />
  ),
  // Code inline (les blocs passent par Shiki et ne reçoivent pas cette classe).
  code: (props: ComponentPropsWithoutRef<"code">) => (
    <code
      className="rounded bg-white/10 px-1 py-0.5 font-mono text-[0.85em] text-primary"
      {...props}
    />
  ),
  pre: (props: ComponentPropsWithoutRef<"pre">) => (
    <pre
      className="my-4 overflow-x-auto rounded-lg border border-border p-4 text-[13px] leading-relaxed [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-inherit"
      {...props}
    />
  ),
  table: (props: ComponentPropsWithoutRef<"table">) => (
    <div className="my-4 overflow-x-auto">
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  ),
  th: (props: ComponentPropsWithoutRef<"th">) => (
    <th className="border border-border bg-card px-3 py-2 text-left font-medium text-text" {...props} />
  ),
  td: (props: ComponentPropsWithoutRef<"td">) => (
    <td className="border border-border px-3 py-2 text-text/90" {...props} />
  ),
  // Images : `![texte alternatif](/chemin.png)` → image stylée et responsive.
  img: ({ alt = "", ...props }: ComponentPropsWithoutRef<"img">) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={alt}
      loading="lazy"
      className="my-4 h-auto max-w-full rounded-lg border border-border"
      {...props}
    />
  ),
  hr: () => <hr className="my-6 border-border" />,
};
