import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

/** Racine des articles de blog. */
const BLOG_DIR = path.join(process.cwd(), "content/blog");

/** Frontmatter attendu en tête de chaque article. */
export interface PostFrontmatter {
  title: string;
  description: string;
  /** Date de publication (ISO, ex. "2026-06-29"). */
  date: string;
  tags: string[];
}

/** Métadonnées d'un article (frontmatter + localisation). */
export interface PostMeta extends PostFrontmatter {
  slug: string;
  href: string;
}

/** Article complet : métadonnées + contenu MDX. */
export interface Post extends PostMeta {
  content: string;
}

function listPostFiles(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs.readdirSync(BLOG_DIR).filter((file) => file.endsWith(".mdx"));
}

/** Tous les articles, triés du plus récent au plus ancien. */
export function getAllPosts(): PostMeta[] {
  const posts = listPostFiles().map((file) => {
    const slug = file.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
    const { data } = matter(raw);
    const frontmatter = data as PostFrontmatter;
    return { ...frontmatter, slug, href: `/blog/${slug}` };
  });
  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

/** Un article par slug, ou `null` s'il n'existe pas. */
export function getPost(slug: string): Post | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  return { ...(data as PostFrontmatter), slug, href: `/blog/${slug}`, content };
}
