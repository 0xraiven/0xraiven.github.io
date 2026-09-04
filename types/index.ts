export type ArticleCategory =
  | "web-security"
  | "linux"
  | "networking"
  | "active-directory"
  | "cloud-security"
  | "detection-engineering"
  | "red-team"
  | "ctf"
  | "tools";

export type ArticleKind = "writeup" | "note" | "research" | "lab-report";

export interface ArticleMeta {
  kind: ArticleKind;
  title: string;
  slug: string;
  description: string;
  category: ArticleCategory;
  tags: string[];
  date: string;
  published: boolean;
  coverImage?: string;
  relatedSlugs?: string[];
  readingTime?: number;
}

export type ProjectCategory =
  | "red-team-tooling"
  | "detection-engineering"
  | "cloud-security"
  | "lab-environment"
  | "browser-security";

export type ProjectStatus = "active" | "building" | "archived" | "planned";

export interface Project {
  title: string;
  slug: string;
  description: string;
  status: ProjectStatus;
  category: ProjectCategory;
  technologies: string[];
  githubUrl?: string;
  screenshots?: string[];
  relatedWriteupSlugs?: string[];
  body: ContentBlock[];
}

export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; level: 1 | 2 | 3; text: string }
  | { type: "orderedList"; items: string[] }
  | { type: "unorderedList"; items: string[] }
  | { type: "quote"; text: string; source?: string }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "gallery"; images: { src: string; alt: string }[] }
  | { type: "warning"; text: string }
  | { type: "note"; text: string }
  | { type: "tip"; text: string }
  | { type: "lab"; target: string; difficulty: "easy" | "medium" | "hard"; objective: string }
  | { type: "finding"; text: string }
  | { type: "mitigation"; text: string }
  | { type: "code"; language: string; code: string; filename?: string }
  | { type: "terminal"; title?: string; commands: { cmd: string; output?: string }[] }
  | { type: "fileTree"; tree: string }
  | { type: "divider" }
  | { type: "callout"; text: string }
  | { type: "twoColumn"; left: ContentBlock[]; right: ContentBlock[] };

export interface TOCItem {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface RelatedItem {
  title: string;
  href: string;
  category?: string;
  kind?: ArticleKind | "project";
}
