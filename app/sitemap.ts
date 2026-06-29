import type { MetadataRoute } from "next";
import { MODULES } from "@/data/modules";
import { getAllFiches } from "@/lib/mdx";
import { getAllPosts } from "@/lib/blog";
import { getQuiz } from "@/lib/quiz";

const BASE = "https://sysbase.fr";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Pages statiques principales.
  const staticPaths = [
    "",
    "/flashcards",
    "/fiches",
    "/recherche",
    "/exercices",
    "/exercices/subnetting",
    "/exercices/binaire",
    "/blog",
    "/a-propos",
  ];
  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  // Pages modules + quiz (quiz seulement si le module a des questions).
  const moduleEntries: MetadataRoute.Sitemap = MODULES.flatMap((module) => {
    const entries: MetadataRoute.Sitemap = [
      {
        url: `${BASE}/modules/${module.slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8,
      },
    ];
    if (getQuiz(module.slug).length > 0) {
      entries.push({
        url: `${BASE}/quiz/${module.slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
    return entries;
  });

  // Fiches tuto (lastModified = date du frontmatter).
  const ficheEntries: MetadataRoute.Sitemap = getAllFiches().map((fiche) => ({
    url: `${BASE}${fiche.href}`,
    lastModified: new Date(fiche.updatedAt),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // Articles de blog.
  const postEntries: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${BASE}${post.href}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticEntries, ...moduleEntries, ...ficheEntries, ...postEntries];
}
