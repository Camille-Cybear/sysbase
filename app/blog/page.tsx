import Link from "next/link";
import { CalendarDays, ArrowRight } from "lucide-react";
import { getAllPosts } from "@/lib/blog";

export const metadata = {
  title: "Blog",
  description:
    "Méthodes, astuces et fiches pratiques pour réviser les certifications IT (TSSR et plus).",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-3xl">
      <header className="mb-6">
        <h1 className="text-base font-medium">Blog</h1>
        <p className="mt-1 text-sm text-muted">
          Méthodes, astuces et approfondissements pour tes révisions.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="rounded-xl border border-border bg-card p-10 text-center text-muted">
          Aucun article pour l&apos;instant.
        </p>
      ) : (
        <ul className="space-y-3">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={post.href}
                className="block rounded-xl border border-border bg-card p-5 transition hover:border-primary-mid/50"
              >
                <span className="inline-flex items-center gap-1.5 text-xs text-muted">
                  <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                  {new Date(post.date).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <h2 className="mt-1.5 text-lg font-medium text-text">
                  {post.title}
                </h2>
                <p className="mt-1 text-sm text-muted">{post.description}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded bg-white/5 px-1.5 py-0.5 text-[11px] text-muted"
                    >
                      #{tag}
                    </span>
                  ))}
                  <span className="ml-auto inline-flex items-center gap-1 text-sm font-medium text-primary">
                    Lire
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
