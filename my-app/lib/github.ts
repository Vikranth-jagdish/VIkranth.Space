const GITHUB_GRAPHQL_ENDPOINT = 'https://api.github.com/graphql';

async function getWithToken(username: string) {
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

    if (!GITHUB_TOKEN) {
        throw new Error('GITHUB_TOKEN is not defined in environment variables');
    }

    const query = `
    query($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
                color
              }
            }
          }
        }
        repositories(first: 100, ownerAffiliations: OWNER, orderBy: {field: STARGAZERS, direction: DESC}) {
          nodes {
            name
            stargazerCount
            forkCount
            url
            description
            languages(first: 3, orderBy: {field: SIZE, direction: DESC}) {
              nodes {
                name
                color
              }
            }
          }
        }
      }
    }
  `;

    const response = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query,
            variables: { username },
        }),
        next: { revalidate: 3600 }, // Cache for 1 hour
    });

    const data = await response.json();

    if (data.errors) {
        console.error('GitHub API Errors:', data.errors);
        throw new Error('Failed to fetch GitHub data');
    }

    return data.data.user;
}


type Day = { contributionCount: number; date: string; color: string };

// Fallback that needs no token: a public contributions feed plus GitHub's public repo list.
// Used when GITHUB_TOKEN is missing, expired or revoked, so the stats never go blank.
async function getPublic(username: string) {
    const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=last`, {
        next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`Public contributions feed returned ${res.status}`);
    const feed: { total?: Record<string, number>; contributions?: { date: string; count: number }[] } = await res.json();
    const days = feed.contributions ?? [];
    if (days.length === 0) throw new Error('Public contributions feed was empty');

    // Group into weeks that start on Sunday, the way GitHub draws its graph.
    const weeks: { contributionDays: Day[] }[] = [];
    for (const d of days) {
        const startsWeek = new Date(`${d.date}T00:00:00Z`).getUTCDay() === 0;
        if (weeks.length === 0 || startsWeek) weeks.push({ contributionDays: [] });
        weeks[weeks.length - 1].contributionDays.push({ contributionCount: d.count, date: d.date, color: '' });
    }
    const totalContributions = feed.total?.lastYear ?? days.reduce((sum, d) => sum + d.count, 0);

    let nodes: unknown[] = [];
    try {
        const repoRes = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&type=owner`, {
            headers: { Accept: 'application/vnd.github+json' },
            next: { revalidate: 3600 },
        });
        if (repoRes.ok) {
            const repos: { name: string; stargazers_count: number; forks_count: number; html_url: string; description: string | null; language: string | null; fork: boolean }[] = await repoRes.json();
            nodes = repos
                .filter(r => !r.fork)
                .sort((a, b) => b.stargazers_count - a.stargazers_count)
                .map(r => ({
                    name: r.name,
                    stargazerCount: r.stargazers_count,
                    forkCount: r.forks_count,
                    url: r.html_url,
                    description: r.description,
                    languages: { nodes: r.language ? [{ name: r.language, color: '#8b8d92' }] : [] },
                }));
        }
    } catch {
        // The repo list is a nice-to-have; contributions alone are enough.
    }

    return {
        contributionsCollection: { contributionCalendar: { totalContributions, weeks } },
        repositories: { nodes },
    };
}

export async function getGithubStats(username: string) {
    try {
        const user = await getWithToken(username);
        if (user?.contributionsCollection) return user;
        throw new Error('GitHub returned no user data');
    } catch (error) {
        console.error('GitHub token request failed, using public data instead:', error);
        return getPublic(username);
    }
}
