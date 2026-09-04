import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import type { ProjectCategory, ProjectStatus } from '@/types';

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  fork: boolean;
  archived: boolean;
  disabled: boolean;
  topics?: string[];
  language?: string | null;
  stargazers_count: number;
  forks_count: number;
  default_branch: string;
}

export interface SyncResult {
  scaffolded: string[];
  skipped: string[];
  errors: { repo: string; error: string }[];
}

const GITHUB_USERNAME = '0xraiven';
const EXCLUDED_REPOS = new Set<string>();

function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
}

function formatTitle(name: string): string {
  const spaced = name.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/[-_]/g, ' ');
  return spaced
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function inferCategory(repo: GitHubRepo): ProjectCategory {
  const topics = (repo.topics || []).map((t) => t.toLowerCase());
  const desc = (repo.description || '').toLowerCase();
  const combined = `${topics.join(' ')} ${desc} ${repo.name.toLowerCase()}`;

  if (
    combined.includes('phish') ||
    combined.includes('extension') ||
    combined.includes('chrome') ||
    combined.includes('browser')
  ) {
    return 'browser-security';
  }

  if (
    combined.includes('ebpf') ||
    combined.includes('audit') ||
    combined.includes('telemetry') ||
    combined.includes('detection') ||
    combined.includes('monitor') ||
    combined.includes('hunt')
  ) {
    return 'detection-engineering';
  }

  if (
    combined.includes('lab') ||
    combined.includes('bandit') ||
    combined.includes('ctf') ||
    combined.includes('practice')
  ) {
    return 'lab-environment';
  }

  if (
    combined.includes('cloud') ||
    combined.includes('aws') ||
    combined.includes('azure') ||
    combined.includes('gcp') ||
    combined.includes('iam') ||
    combined.includes('icp') ||
    combined.includes('on-chain')
  ) {
    return 'cloud-security';
  }

  return 'red-team-tooling';
}

function inferStatus(repo: GitHubRepo): ProjectStatus {
  if (repo.archived) return 'archived';
  return 'active';
}

async function fetchRepoLanguages(repoName: string): Promise<string[]> {
  try {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'r41n-portfolio',
    };
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
    }

    const res = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${repoName}/languages`, {
      headers,
    });
    if (!res.ok) return [];
    const data = (await res.json()) as Record<string, number>;
    return Object.keys(data).slice(0, 5);
  } catch {
    return [];
  }
}

async function fetchRepoReadme(repoName: string): Promise<string | null> {
  try {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'r41n-portfolio',
    };
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
    }

    const res = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${repoName}/readme`, {
      headers,
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { content?: string; encoding?: string };
    if (data.content && data.encoding === 'base64') {
      const decoded = Buffer.from(data.content, 'base64').toString('utf-8');
      return cleanReadmeForMarkdoc(decoded, repoName);
    }
    return null;
  } catch {
    return null;
  }
}

function cleanReadmeForMarkdoc(readme: string, repoName: string): string {
  const cleaned = readme
    .replace(/<div[\s\S]*?<\/div>/gi, '')
    .replace(/<p[\s\S]*?<\/p>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<img[^>]*>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .trim();

  if (cleaned.length < 30) {
    return generateDefaultScaffold(repoName);
  }

  return cleaned;
}

function generateDefaultScaffold(repoName: string): string {
  const title = formatTitle(repoName);
  return `# ${title}

## Overview

Technical implementation artifact and repository.

## Architecture

Modular implementation detailing operational components and threat model considerations.

## Usage & Verification

Refer to repository documentation and build instructions for local lab reproduction.
`;
}

/**
 * Synchronize all repositories from GitHub for 0xraiven and scaffold missing project content.
 * GUARANTEE: Never overwrites existing index.json or body.mdoc files!
 */
export async function syncGitHubRepos(options: { forceFetch?: boolean } = {}): Promise<SyncResult> {
  const result: SyncResult = {
    scaffolded: [],
    skipped: [],
    errors: [],
  };

  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'r41n-portfolio',
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
  }

  let repos: GitHubRepo[] = [];
  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=pushed`, {
      headers,
      ...(options.forceFetch ? { cache: 'no-store' } : {}),
    });

    if (!res.ok) {
      throw new Error(`GitHub API responded with status ${res.status}: ${res.statusText}`);
    }

    repos = (await res.json()) as GitHubRepo[];
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[sync-repos] Failed to fetch repositories from GitHub:`, message);
    result.errors.push({ repo: 'ALL', error: message });
    return result;
  }

  const projectsDir = path.join(process.cwd(), 'content', 'projects');
  if (!fs.existsSync(projectsDir)) {
    fs.mkdirSync(projectsDir, { recursive: true });
  }

  for (const repo of repos) {
    if (EXCLUDED_REPOS.has(repo.name) || repo.fork) {
      continue;
    }

    const slug = toSlug(repo.name);
    const repoDir = path.join(projectsDir, slug);
    const indexPath = path.join(repoDir, 'index.json');
    const mdocPath = path.join(repoDir, 'index.mdoc');

    // NEVER overwrite existing content!
    if (fs.existsSync(mdocPath) || fs.existsSync(indexPath)) {
      result.skipped.push(slug);
      continue;
    }

    try {
      if (!fs.existsSync(repoDir)) {
        fs.mkdirSync(repoDir, { recursive: true });
      }

      const languages = await fetchRepoLanguages(repo.name);
      const category = inferCategory(repo);
      const status = inferStatus(repo);
      const readme = await fetchRepoReadme(repo.name);

      const techStack = Array.from(
        new Set([
          ...(repo.language ? [repo.language] : []),
          ...languages,
          ...(repo.topics || []).slice(0, 4),
        ])
      );

      const metadata = {
        title: formatTitle(repo.name),
        description: repo.description || `${formatTitle(repo.name)} security engineering artifact.`,
        status,
        category,
        technologies: techStack,
        githubUrl: repo.html_url,
        screenshots: [],
        relatedWriteupSlugs: [],
      };

      const bodyText = readme || generateDefaultScaffold(repo.name);
      const frontmatter = yaml.dump(metadata, { lineWidth: -1 }).trim();
      const mdocContent = `---\n${frontmatter}\n---\n\n${bodyText}\n`;

      fs.writeFileSync(mdocPath, mdocContent, 'utf-8');
      fs.writeFileSync(indexPath, JSON.stringify(metadata, null, 2), 'utf-8');

      console.log(`[sync-repos] Successfully scaffolded new project: ${slug}`);
      result.scaffolded.push(slug);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[sync-repos] Failed scaffolding ${slug}:`, message);
      result.errors.push({ repo: slug, error: message });
    }
  }

  return result;
}

/**
 * On-demand check for a single slug: If not present locally, check GitHub and scaffold immediately.
 */
export async function ensureProjectFromGitHub(slug: string): Promise<boolean> {
  const projectsDir = path.join(process.cwd(), 'content', 'projects');
  const repoDir = path.join(projectsDir, slug);
  const mdocPath = path.join(repoDir, 'index.mdoc');
  const indexPath = path.join(repoDir, 'index.json');

  if (fs.existsSync(mdocPath) || fs.existsSync(indexPath)) {
    return true; // Already exists locally
  }

  // Attempt to sync from GitHub
  await syncGitHubRepos({ forceFetch: true });
  return fs.existsSync(mdocPath) || fs.existsSync(indexPath);
}
