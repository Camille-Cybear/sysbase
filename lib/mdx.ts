import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Difficulty } from "@/lib/types";
import { getModule, type ModuleSlug } from "@/data/modules";
import type { SearchItem } from "@/lib/search";

/** Racine des fiches MDX. */
const CONTENT_DIR = path.join(process.cwd(), "content");

/** Frontmatter attendu en tête de chaque fiche MDX. */
export interface FicheFrontmatter {
  title: string;
  module: ModuleSlug;
  theme: string;
  difficulty: Difficulty;
  tags: string[];
  updatedAt: string;
  /** Description SEO optionnelle (sinon générée automatiquement). */
  description?: string;
}

/** Métadonnées d'une fiche (frontmatter + localisation). */
export interface FicheMeta extends FicheFrontmatter {
  /** Slug du fichier (sans extension). */
  slug: string;
  /** Lien de la fiche. */
  href: string;
}

/** Fiche complète : métadonnées + contenu MDX brut. */
export interface Fiche extends FicheMeta {
  /** Corps MDX (sans le frontmatter). */
  content: string;
}

/** Liste les fichiers `.mdx` d'un dossier module (vide si absent). */
function listModuleFiles(module: string): string[] {
  const dir = path.join(CONTENT_DIR, module);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((file) => file.endsWith(".mdx"));
}

/** Liste les sous-dossiers de `content/` qui correspondent à un vrai module. */
function listModuleDirs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && getModule(entry.name) !== undefined)
    .map((entry) => entry.name);
}

/** Lit une fiche par module + slug, ou `null` si introuvable. */
export function getFiche(module: string, slug: string): Fiche | null {
  const filePath = path.join(CONTENT_DIR, module, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const frontmatter = data as FicheFrontmatter;

  return {
    ...frontmatter,
    slug,
    href: `/fiches/${module}/${slug}`,
    content,
  };
}

/** Retourne les métadonnées de toutes les fiches, triées par date décroissante. */
export function getAllFiches(): FicheMeta[] {
  const fiches: FicheMeta[] = [];

  for (const mod of listModuleDirs()) {
    for (const file of listModuleFiles(mod)) {
      const slug = file.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(CONTENT_DIR, mod, file), "utf8");
      const { data } = matter(raw);
      const frontmatter = data as FicheFrontmatter;
      fiches.push({
        ...frontmatter,
        slug,
        href: `/fiches/${mod}/${slug}`,
      });
    }
  }

  return fiches.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

/** Retourne les fiches d'un module donné. */
export function getFichesByModule(module: ModuleSlug): FicheMeta[] {
  return getAllFiches().filter((fiche) => fiche.module === module);
}

/** Convertit un corps MDX en texte brut (pour l'indexation et les extraits). */
function toPlainText(mdx: string): string {
  return mdx
    .replace(/```[\s\S]*?```/g, " ") // blocs de code
    .replace(/`[^`]*`/g, " ") // code inline
    .replace(/^\s*[#>|-]+/gm, " ") // titres, citations, tableaux, listes
    .replace(/[*_~]/g, "") // emphase
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // liens → texte
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Éléments de recherche issus des fiches MDX (titre, thème, tags + contenu).
 *
 * Serveur uniquement (lecture disque) — à appeler depuis un composant serveur.
 */
export function getFicheSearchItems(): SearchItem[] {
  const items: SearchItem[] = [];

  for (const mod of listModuleDirs()) {
    for (const file of listModuleFiles(mod)) {
      const slug = file.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(CONTENT_DIR, mod, file), "utf8");
      const { data, content } = matter(raw);
      const fm = data as FicheFrontmatter;
      const moduleInfo = getModule(fm.module);
      const plain = toPlainText(content);

      items.push({
        id: `fiche-${fm.module}-${slug}`,
        type: "fiche",
        module: fm.module,
        moduleName: moduleInfo?.name ?? fm.module,
        moduleColor: moduleInfo?.color ?? "#7B6FD4",
        theme: fm.theme,
        title: fm.title,
        excerpt: plain.slice(0, 200),
        content: plain,
        tags: fm.tags,
        href: `/fiches/${fm.module}/${slug}`,
      });
    }
  }

  return items;
}
