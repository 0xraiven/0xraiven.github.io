import { reader } from "./keystatic-reader";
import { ProjectCategory, ProjectStatus } from "./taxonomy";
import { getGitHubRepoData, GitHubRepoMetadata } from "./github";
import { ensureProjectFromGitHub } from "./sync-repos";

export interface EnrichedProject {
  slug: string;
  title: string;
  description: string;
  status: ProjectStatus;
  category: ProjectCategory;
  technologies: string[];
  githubUrl?: string;
  screenshots?: string[];
  relatedWriteupSlugs?: string[];
  githubData?: GitHubRepoMetadata | null;
  body?: unknown;
}

export async function getProjects(): Promise<EnrichedProject[]> {
  try {
    const slugs = await reader.collections.projects.list();
    const projects: EnrichedProject[] = [];

    for (const slug of slugs) {
      const item = await reader.collections.projects.read(slug);
      if (!item) continue;

      let githubData: GitHubRepoMetadata | null = null;
      if (item.githubUrl) {
        githubData = await getGitHubRepoData(item.githubUrl);
      }

      // Merge technologies with GitHub languages and topics if available
      const techSet = new Set<string>(
        item.technologies
          ? item.technologies.filter((t): t is string => typeof t === "string")
          : []
      );

      if (githubData) {
        githubData.languageStack.forEach((lang) => techSet.add(lang));
        githubData.topics.forEach((topic) => techSet.add(topic));
      }

      // Use GitHub repo description if local description is empty
      const description =
        item.description || (githubData?.description ?? "");

      const screenshots = item.screenshots
        ? item.screenshots.filter((s): s is string => typeof s === "string")
        : [];

      const relatedWriteupSlugs = item.relatedWriteupSlugs
        ? item.relatedWriteupSlugs.filter((s): s is string => typeof s === "string")
        : [];

      projects.push({
        slug,
        title: item.title,
        description,
        status: item.status as ProjectStatus,
        category: item.category as ProjectCategory,
        technologies: Array.from(techSet),
        githubUrl: item.githubUrl || undefined,
        screenshots,
        relatedWriteupSlugs,
        githubData,
      });
    }

    return projects;
  } catch {
    return [];
  }
}

export async function getProjectBySlug(slug: string): Promise<EnrichedProject | null> {
  try {
    let item = await reader.collections.projects.read(slug);
    if (!item) {
      const synced = await ensureProjectFromGitHub(slug);
      if (synced) {
        item = await reader.collections.projects.read(slug);
      }
    }
    if (!item) return null;

    let githubData: GitHubRepoMetadata | null = null;
    if (item.githubUrl) {
      githubData = await getGitHubRepoData(item.githubUrl);
    }

    const techSet = new Set<string>(
      item.technologies
        ? item.technologies.filter((t): t is string => typeof t === "string")
        : []
    );

    if (githubData) {
      githubData.languageStack.forEach((lang) => techSet.add(lang));
      githubData.topics.forEach((topic) => techSet.add(topic));
    }

    const description = item.description || (githubData?.description ?? "");
    const body = await item.body();

    const screenshots = item.screenshots
      ? item.screenshots.filter((s): s is string => typeof s === "string")
      : [];

    const relatedWriteupSlugs = item.relatedWriteupSlugs
      ? item.relatedWriteupSlugs.filter((s): s is string => typeof s === "string")
      : [];

    return {
      slug,
      title: item.title,
      description,
      status: item.status as ProjectStatus,
      category: item.category as ProjectCategory,
      technologies: Array.from(techSet),
      githubUrl: item.githubUrl || undefined,
      screenshots,
      relatedWriteupSlugs,
      githubData,
      body,
    };
  } catch {
    return null;
  }
}

export async function getProjectsByCategory(
  category: ProjectCategory
): Promise<EnrichedProject[]> {
  const all = await getProjects();
  return all.filter((p) => p.category === category);
}
