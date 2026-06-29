import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeShiki from "@shikijs/rehype";
import remarkGfm from "remark-gfm";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { getAllPosts, getPost } from "@/lib/blog";
import { mdxComponents } from "@/components/MDXComponents";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

/** Prégénère tous les articles au build. */
export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

/** Métadonnées SEO propres à chaque article. */
export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const date = new Date(post.date).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="mx-auto max-w-3xl">
      <Link
        href="/blog"
        className="mb-4 inline-flex items-center gap-1.5 text-xs text-muted transition hover:text-text"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        Blog
      </Link>

      <header className="mb-6 border-b border-border pb-5">
        <h1 className="text-2xl font-semibold text-text">{post.title}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
            {date}
          </span>
          <span className="flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span key={tag} className="rounded bg-white/5 px-1.5 py-0.5">
                #{tag}
              </span>
            ))}
          </span>
        </div>
      </header>

      <div>
        <MDXRemote
          source={post.content}
          components={mdxComponents}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [[rehypeShiki, { theme: "github-dark" }]],
            },
          }}
        />
      </div>
    </article>
  );
}
