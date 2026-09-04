import type { MetadataRoute } from "next";
import { reader } from "@/lib/keystatic-reader";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://0xraiven.github.io";

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/writeups`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/notes`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/research`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/resume`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Dynamic projects
  let projectRoutes: MetadataRoute.Sitemap = [];
  try {
    const projectSlugs = await reader.collections.projects.list();
    projectRoutes = projectSlugs.map((slug) => ({
      url: `${baseUrl}/projects/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));
  } catch {
    // If collection cannot be read, continue gracefully
  }

  // Dynamic writeups
  let writeupRoutes: MetadataRoute.Sitemap = [];
  try {
    const writeupSlugs = await reader.collections.writeups.list();
    writeupRoutes = writeupSlugs.map((slug) => ({
      url: `${baseUrl}/writeups/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));
  } catch {
    // If collection cannot be read, continue gracefully
  }

  // Dynamic notes
  let noteRoutes: MetadataRoute.Sitemap = [];
  try {
    const noteSlugs = await reader.collections.notes.list();
    noteRoutes = noteSlugs.map((slug) => ({
      url: `${baseUrl}/notes/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch {
    // If collection cannot be read, continue gracefully
  }

  // Dynamic research
  let researchRoutes: MetadataRoute.Sitemap = [];
  try {
    const researchSlugs = await reader.collections.research.list();
    researchRoutes = researchSlugs.map((slug) => ({
      url: `${baseUrl}/research/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));
  } catch {
    // If collection cannot be read, continue gracefully
  }

  return [
    ...staticRoutes,
    ...projectRoutes,
    ...writeupRoutes,
    ...noteRoutes,
    ...researchRoutes,
  ];
}
