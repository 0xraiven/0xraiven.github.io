import { reader } from "./keystatic-reader";
import { ArticleKind, ArticleCategory, HTBDifficulty } from "./taxonomy";
import { ArticleMeta } from "@/types";

function calculateReadingTime(textOrBody: unknown): number {
  if (!textOrBody) return 1;
  const str = typeof textOrBody === "string" ? textOrBody : JSON.stringify(textOrBody);
  const words = str.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function resolveHtbDifficulty(item: { category?: string; htbDifficulty?: string }): HTBDifficulty | undefined {
  if (item.htbDifficulty && item.htbDifficulty !== "none") {
    return item.htbDifficulty as HTBDifficulty;
  }
  if (item.category === "htb-low") return "low";
  if (item.category === "htb-medium") return "medium";
  if (item.category === "htb-hard") return "hard";
  if (item.category === "htb-insane") return "insane";
  return undefined;
}

export async function getArticles(kind?: ArticleKind): Promise<ArticleMeta[]> {
  const results: ArticleMeta[] = [];

  // Determine collections to read based on kind
  const collectionsToRead: Array<"writeups" | "notes" | "research"> = kind
    ? kind === "writeup"
      ? ["writeups"]
      : kind === "note"
      ? ["notes"]
      : ["research"]
    : ["writeups", "notes", "research"];

  for (const coll of collectionsToRead) {
    try {
      const slugs = await reader.collections[coll].list();
      for (const slug of slugs) {
        const item = await reader.collections[coll].read(slug);
        if (!item) continue;

        const resolvedKind = (item.kind as ArticleKind) || (
          coll === "research" ? "research" : coll === "notes" ? "note" : "writeup"
        );

        if (kind && resolvedKind !== kind) {
          continue;
        }

        const body = await item.body();

        const tags = item.tags
          ? item.tags.filter((t): t is string => typeof t === "string")
          : [];

        const relatedSlugs = item.relatedSlugs
          ? item.relatedSlugs.filter((s): s is string => typeof s === "string")
          : [];

        results.push({
          slug,
          title: item.title,
          description: item.description,
          kind: resolvedKind,
          category: item.category as ArticleCategory,
          tags,
          date: item.date || "",
          published: Boolean(item.published),
          coverImage: item.coverImage || undefined,
          relatedSlugs,
          readingTime: calculateReadingTime(body),
          htbDifficulty: resolveHtbDifficulty(item as { category?: string; htbDifficulty?: string }),
        });
      }
    } catch {
      // Return accumulated or empty array if directory not yet populated
    }
  }

  // Sort descending by date
  return results.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getArticleBySlug(
  collection: "writeups" | "notes" | "research",
  slug: string
) {
  try {
    const item = await reader.collections[collection].read(slug);
    if (!item) return null;

    const body = await item.body();

    const resolvedKind = (item.kind as ArticleKind) || (
      collection === "research" ? "research" : collection === "notes" ? "note" : "writeup"
    );

    const tags = item.tags
      ? item.tags.filter((t): t is string => typeof t === "string")
      : [];

    const relatedSlugs = item.relatedSlugs
      ? item.relatedSlugs.filter((s): s is string => typeof s === "string")
      : [];

    const meta: ArticleMeta = {
      slug,
      title: item.title,
      description: item.description,
      kind: resolvedKind,
      category: item.category as ArticleCategory,
      tags,
      date: item.date || "",
      published: Boolean(item.published),
      coverImage: item.coverImage || undefined,
      relatedSlugs,
      readingTime: calculateReadingTime(body),
      htbDifficulty: resolveHtbDifficulty(item as { category?: string; htbDifficulty?: string }),
    };

    return {
      meta,
      body,
    };
  } catch {
    return null;
  }
}

export async function getArticlesByCategory(
  category: ArticleCategory
): Promise<ArticleMeta[]> {
  const all = await getArticles();
  return all.filter((a) => a.category === category);
}
