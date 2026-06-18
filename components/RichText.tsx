import { Fragment, type ReactNode } from "react";

export interface RichTextProps {
  /** Texte source pouvant contenir du Markdown inline (`**gras**`, `` `code` ``). */
  children: string;
}

/**
 * Rendu Markdown inline léger pour les réponses de flashcards.
 *
 * Gère le **gras** (`**…**`) et le `code` inline (`` `…` ``) — suffisant pour le
 * contenu des cartes, sans dépendance externe.
 */
export function RichText({ children }: RichTextProps) {
  // Découpe en conservant les délimiteurs **…** et `…`.
  const tokens = children.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);

  return (
    <>
      {tokens.map((token, i) => {
        if (token.startsWith("**") && token.endsWith("**")) {
          return (
            <strong key={i} className="font-semibold text-text">
              {token.slice(2, -2)}
            </strong>
          );
        }
        if (token.startsWith("`") && token.endsWith("`")) {
          return (
            <code
              key={i}
              className="rounded bg-white/10 px-1 py-0.5 font-mono text-[0.85em] text-primary"
            >
              {token.slice(1, -1)}
            </code>
          );
        }
        return <Fragment key={i}>{token}</Fragment>;
      })}
    </>
  );
}
