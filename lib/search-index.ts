import fs from "fs/promises";
import path from "path";
import { getProjects } from "./projects";
import { getArticles } from "./articles";

export interface SearchItem {
  id: string;
  title: string;
  description: string;
  url: string;
  kind: "project" | "writeup" | "note" | "research" | "lab-report" | "page";
  category?: string;
  tags?: string[];
}

const STATIC_PAGES: SearchItem[] = [
  {
    id: "page-readme",
    title: "README",
    description: "System architecture, operator configuration, technical profile, and active security focus areas.",
    url: "/",
    kind: "page",
    category: "system",
    tags: ["profile", "configuration", "overview"],
  },
  {
    id: "page-projects",
    title: "Projects Directory",
    description: "Browse all security tooling, machine learning detectors, lab environments, and proof-of-work repositories.",
    url: "/projects",
    kind: "page",
    category: "projects",
    tags: ["directory", "tools", "repositories"],
  },
  {
    id: "page-writeups",
    title: "Writeups",
    description: "Technical post-mortems, exploit analysis, vulnerable lab walkthroughs, and vulnerability reports.",
    url: "/writeups",
    kind: "page",
    category: "field-reports",
    tags: ["writeups", "analysis", "reports"],
  },
  {
    id: "page-writeups-htb",
    title: "Hack The Box Writeups",
    description: "Hack The Box machine walkthroughs, exploit chains, privilege escalation techniques, and difficulty tiers.",
    url: "/writeups/htb",
    kind: "writeup",
    category: "htb",
    tags: ["htb", "hackthebox", "machines", "writeups", "ctf"],
  },
  {
    id: "page-notes",
    title: "Notes & References",
    description: "Operational notes, cheat sheets, command references, and defensive & offensive security runbooks.",
    url: "/notes",
    kind: "page",
    category: "knowledge-base",
    tags: ["notes", "cheatsheets", "commands"],
  },
  {
    id: "page-research",
    title: "Security Research",
    description: "In-depth vulnerability research, protocol audits, whitepapers, and target lab evaluations.",
    url: "/research",
    kind: "page",
    category: "research",
    tags: ["research", "papers", "labs"],
  },
  {
    id: "page-about",
    title: "About Operator",
    description: "Operator profile, defensive & offensive philosophy, security methodology, and contact details.",
    url: "/about",
    kind: "page",
    category: "operator",
    tags: ["bio", "contact", "philosophy"],
  },
  {
    id: "page-resume",
    title: "Resume & Profile",
    description: "Curriculum vitae, technical competencies, security credentials, and engineering experience.",
    url: "/resume",
    kind: "page",
    category: "operator",
    tags: ["resume", "experience", "skills"],
  },
];

export async function generateSearchIndex(): Promise<SearchItem[]> {
  const items: SearchItem[] = [...STATIC_PAGES];

  // 1. Projects
  try {
    const projects = await getProjects();
    for (const project of projects) {
      items.push({
        id: `project-${project.slug}`,
        title: project.title,
        description: project.description || `Technical project: ${project.title}`,
        url: `/projects/${project.slug}`,
        kind: "project",
        category: project.category,
        tags: project.technologies,
      });
    }
  } catch (error) {
    console.warn("[search-index] Warning reading projects:", error);
  }

  // 2. Articles (writeups, notes, research)
  try {
    const articles = await getArticles();
    for (const article of articles) {
      const section =
        article.kind === "writeup"
          ? "writeups"
          : article.kind === "note"
          ? "notes"
          : "research";

      items.push({
        id: `${article.kind}-${article.slug}`,
        title: article.title,
        description: article.description || `${article.kind}: ${article.title}`,
        url: `/${section}/${article.slug}`,
        kind: article.kind,
        category: article.category,
        tags: article.tags,
      });
    }
  } catch (error) {
    console.warn("[search-index] Warning reading articles:", error);
  }

  // Write index to public/search-index.json
  const publicDir = path.resolve(process.cwd(), "public");
  await fs.mkdir(publicDir, { recursive: true });
  const outputPath = path.join(publicDir, "search-index.json");
  await fs.writeFile(outputPath, JSON.stringify(items, null, 2), "utf-8");

  return items;
}
