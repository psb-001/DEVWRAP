export interface GitHubStats {
    commits: number;
    prs: number;
    repos: number;
    languages: string[];
    linesOfCode: number;
    avatarUrl?: string;
    heatmap?: number[];
}

const LANGUAGE_MAP: Record<string, string> = {
    'typescript': 'ts',
    'javascript': 'js',
    'python': 'python',
    'java': 'java',
    'c++': 'cpp',
    'c': 'c',
    'c#': 'cs',
    'go': 'go',
    'rust': 'rust',
    'php': 'php',
    'ruby': 'ruby',
    'swift': 'swift',
    'kotlin': 'kotlin',
    'html': 'html',
    'css': 'css',
    'sql': 'sql',
};

// Generates a 7x15 grid of contribution levels (0-4)
function generateHeatmap(commits: number): number[] {
    const size = 7 * 15;
    const heatmap = new Array(size).fill(0);

    // Probability of a cell being active increases with commits
    const density = Math.min(0.8, (commits / 1000) + 0.1);

    for (let i = 0; i < size; i++) {
        if (Math.random() < density) {
            // Higher commits = higher intensity boxes
            const intensityBase = Math.min(3, Math.floor(commits / 300));
            heatmap[i] = Math.min(4, Math.floor(Math.random() * (4 - intensityBase + 1)) + intensityBase);
        } else {
            // Very occasional low-level noise even for low commits
            heatmap[i] = Math.random() < 0.05 ? 1 : 0;
        }
    }

    return heatmap;
}

export async function fetchGitHubStats(username: string, token?: string): Promise<GitHubStats> {
    const headers: HeadersInit = {
        'Accept': 'application/vnd.github.v3+json',
    };

    if (token) {
        headers['Authorization'] = `token ${token}`;
    }

    const dateRange = `2025-01-01..2025-12-31`;

    try {
        // First identify user to ensure they exist
        const userRes = await fetch(`https://api.github.com/users/${username}`, { headers });
        if (!userRes.ok) throw new Error(`User not found (${userRes.status})`);
        const userData = await userRes.json();

        // Fire all other requests in parallel
        const [commitRes, prRes, repoRes] = await Promise.all([
            fetch(`https://api.github.com/search/commits?q=author:${username}+committer-date:${dateRange}`, { headers }),
            fetch(`https://api.github.com/search/issues?q=author:${username}+is:pr+is:merged+created:${dateRange}`, { headers }),
            fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`, { headers })
        ]);

        // Process Commits
        let commitCount = 0;
        if (commitRes.ok) {
            const commitData = await commitRes.json();
            commitCount = commitData.total_count || 0;
        }

        // Process PRs
        let prCount = 0;
        if (prRes.ok) {
            const prData = await prRes.json();
            prCount = prData.total_count || 0;
        }

        // Process Repos & Languages
        let publicRepos = 0;
        const langMap: Record<string, number> = {};
        if (repoRes.ok) {
            const repoData = await repoRes.json();
            publicRepos = Array.isArray(repoData) ? repoData.length : 0;
            if (Array.isArray(repoData)) {
                repoData.forEach(repo => {
                    if (repo.language) {
                        langMap[repo.language] = (langMap[repo.language] || 0) + 1;
                    }
                });
            }
        }

        const topLanguages = Object.entries(langMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([lang]) => {
                const normalized = lang.toLowerCase();
                return LANGUAGE_MAP[normalized] || normalized;
            });

        const locEstimate = (commitCount * 55) + (publicRepos * 1050);

        return {
            commits: commitCount,
            prs: prCount,
            repos: publicRepos,
            languages: topLanguages,
            linesOfCode: locEstimate,
            avatarUrl: userData.avatar_url,
            heatmap: generateHeatmap(commitCount + prCount)
        };
    } catch (error) {
        console.error('[GitHub Magic] Fatal Error:', error);
        throw error;
    }
}
