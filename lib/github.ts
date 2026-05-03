import { GitHubProfile, GitHubRepo } from '@/types/diagnostic';

const GITHUB_API = 'https://api.github.com';
const HEADERS: Record<string, string> = {
  'Accept': 'application/vnd.github.v3+json',
  'User-Agent': 'Githired-App',
};
if (process.env.GITHUB_TOKEN) {
  HEADERS['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
}

async function ghFetch(path: string) {
  const res = await fetch(`${GITHUB_API}${path}`, { headers: HEADERS, next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`GitHub API error: ${res.status} ${path}`);
  return res.json();
}

async function fetchRepoReadme(username: string, repoName: string): Promise<string> {
  try {
    const data = await ghFetch(`/repos/${username}/${repoName}/readme`);
    if (!data.content) return '';
    // GitHub returns base64-encoded content
    const decoded = Buffer.from(data.content, 'base64').toString('utf-8');
    // Return first 500 chars to keep context concise
    return decoded.slice(0, 500).replace(/\n+/g, ' ').trim();
  } catch {
    return '';
  }
}

async function fetchRepoTree(username: string, repoName: string): Promise<string[]> {
  try {
    // Get default branch first
    const repoData = await ghFetch(`/repos/${username}/${repoName}`);
    const branch = repoData.default_branch || 'main';
    const tree = await ghFetch(`/repos/${username}/${repoName}/git/trees/${branch}?recursive=0`);
    return (tree.tree as Array<{ path: string; type: string }>)
      .filter((f) => f.type === 'blob')
      .map((f) => f.path)
      .slice(0, 20); // top-level files only
  } catch {
    return [];
  }
}

export async function fetchGitHubProfile(usernameOrUrl: string): Promise<GitHubProfile> {
  const username = usernameOrUrl
    .replace(/^(https?:\/\/)?(www\.)?github\.com\//, '')
    .replace(/\/$/, '')
    .split('/')[0];

  const [profile, repos] = await Promise.all([
    ghFetch(`/users/${username}`),
    ghFetch(`/users/${username}/repos?sort=updated&per_page=100&type=public`),
  ]);

  // Check for profile README
  let hasProfileReadme = false;
  try {
    const res = await fetch(`${GITHUB_API}/repos/${username}/${username}/readme`, { headers: HEADERS });
    hasProfileReadme = res.ok;
  } catch { }

  // Deep dive on top 3 non-fork repos (sequential to avoid secondary rate limits)
  const topRepos = (repos as GitHubRepo[])
    .filter((r) => !r.fork)
    .slice(0, 3);

  const repoDetails: GitHubRepo[] = [];
  for (const repo of topRepos) {
    const readme = await fetchRepoReadme(username, repo.name);
    const files = await fetchRepoTree(username, repo.name);
    repoDetails.push({
      ...repo,
      description: 'Files: ' + files.slice(0, 5).join(', ') + ' | README: ' + (readme ? readme.slice(0, 400) : 'No README'),
      readme,
      files,
    });
  }

  // Merge enriched repos back with the full list
  const enrichedMap = new Map(repoDetails.map((r) => [r.name, r]));
  const allRepos = (repos as GitHubRepo[]).map((r) => enrichedMap.get(r.name) || r);

  // Aggregate top languages
  const languageCounts: Record<string, number> = {};
  for (const repo of repos as GitHubRepo[]) {
    if (repo.language && !repo.fork) {
      languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
    }
  }

  return {
    login: profile.login,
    name: profile.name || profile.login,
    bio: profile.bio,
    avatar_url: profile.avatar_url,
    public_repos: profile.public_repos,
    followers: profile.followers,
    following: profile.following,
    html_url: profile.html_url,
    location: profile.location,
    blog: profile.blog,
    repos: allRepos.slice(0, 20),
    topLanguages: languageCounts,
    hasProfileReadme,
  };
}
