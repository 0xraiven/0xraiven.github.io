export interface GitHubRepoMetadata {
  name: string;
  fullName: string;
  description: string;
  language: string | null;
  languageStack: string[];
  topics: string[];
  stars: number;
  forks: number;
  htmlUrl: string;
  updatedAt: string;
}

export interface GitHubUserProfile {
  name: string;
  login: string;
  bio: string;
  avatarUrl: string;
  htmlUrl: string;
  publicRepos: number;
}

function parseRepoPath(repoOrUrl: string): { owner: string; repo: string } | null {
  if (!repoOrUrl) return null;

  // Handle https://github.com/owner/repo or github.com/owner/repo
  const clean = repoOrUrl.replace(/^https?:\/\/github\.com\//, "").replace(/\/$/, "");
  const parts = clean.split("/");
  if (parts.length >= 2) {
    return { owner: parts[0], repo: parts[1] };
  }
  return null;
}

export async function getGitHubRepoData(
  repoOrUrl: string
): Promise<GitHubRepoMetadata | null> {
  const parsed = parseRepoPath(repoOrUrl);
  if (!parsed) return null;

  const { owner, repo } = parsed;

  try {
    const headers: HeadersInit = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "r41n-knowledge-base",
    };

    // Include GITHUB_TOKEN if available in environment
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
    }

    const [repoRes, langRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers,
        next: { revalidate: 3600 },
      }),
      fetch(`https://api.github.com/repos/${owner}/${repo}/languages`, {
        headers,
        next: { revalidate: 3600 },
      }),
    ]);

    if (!repoRes.ok) {
      return null;
    }

    const repoJson = await repoRes.json();
    let languageStack: string[] = [];

    if (langRes.ok) {
      const langJson = await langRes.json();
      languageStack = Object.keys(langJson);
    } else if (repoJson.language) {
      languageStack = [repoJson.language];
    }

    return {
      name: repoJson.name || repo,
      fullName: repoJson.full_name || `${owner}/${repo}`,
      description: repoJson.description || "",
      language: repoJson.language || null,
      languageStack,
      topics: repoJson.topics || [],
      stars: repoJson.stargazers_count ?? 0,
      forks: repoJson.forks_count ?? 0,
      htmlUrl: repoJson.html_url || `https://github.com/${owner}/${repo}`,
      updatedAt: repoJson.pushed_at || repoJson.updated_at || "",
    };
  } catch {
    // Graceful fallback if offline or network throttled
    return null;
  }
}

export async function getGitHubUserProfile(
  username: string = "0xraiven"
): Promise<GitHubUserProfile | null> {
  try {
    const headers: HeadersInit = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "r41n-knowledge-base",
    };

    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
    }

    const res = await fetch(`https://api.github.com/users/${username}`, {
      headers,
      next: { revalidate: 3600 },
    });

    if (!res.ok) return null;

    const data = await res.json();
    return {
      name: data.name || username,
      login: data.login || username,
      bio: data.bio || "",
      avatarUrl: data.avatar_url || "",
      htmlUrl: data.html_url || `https://github.com/${username}`,
      publicRepos: data.public_repos ?? 0,
    };
  } catch {
    return null;
  }
}
