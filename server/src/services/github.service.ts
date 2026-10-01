import axios from 'axios';
import { prisma } from '../utils/prisma';
import { broadcastLiveEvent } from '../utils/socket';

export interface GitHubStats {
  publicRepos: number;
  followers: number;
  totalStars: number;
  topLanguages: string[];
  recentRepos: Array<{
    name: string;
    description: string;
    html_url: string;
    language: string;
    stargazers_count: number;
  }>;
}

export async function fetchGitHubData(githubUsername: string): Promise<GitHubStats> {
  const cleanUsername = githubUsername.trim().replace(/^@/, '');
  if (!cleanUsername) throw new Error('GitHub username is required');

  try {
    // Fetch user profile
    const userRes = await axios.get(`https://api.github.com/users/${cleanUsername}`, {
      headers: { 'User-Agent': 'DigitalHeroes-App' },
      timeout: 8000,
    });

    // Fetch user repos (up to 30)
    const reposRes = await axios.get(`https://api.github.com/users/${cleanUsername}/repos?sort=updated&per_page=30`, {
      headers: { 'User-Agent': 'DigitalHeroes-App' },
      timeout: 8000,
    });

    const repos = reposRes.data || [];
    let totalStars = 0;
    const languagesMap: Record<string, number> = {};

    const recentRepos = repos.slice(0, 5).map((r: any) => {
      totalStars += r.stargazers_count || 0;
      if (r.language) {
        languagesMap[r.language] = (languagesMap[r.language] || 0) + 1;
      }
      return {
        name: r.name,
        description: r.description || 'Open source project on GitHub',
        html_url: r.html_url,
        language: r.language || 'Code',
        stargazers_count: r.stargazers_count || 0,
      };
    });

    const topLanguages = Object.entries(languagesMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([lang]) => lang);

    return {
      publicRepos: userRes.data.public_repos || 0,
      followers: userRes.data.followers || 0,
      totalStars,
      topLanguages,
      recentRepos,
    };
  } catch (err: any) {
    if (err.response?.status === 404) {
      throw new Error(`GitHub user "${cleanUsername}" not found`);
    }
    throw new Error('Failed to fetch data from GitHub API');
  }
}

export async function syncGitHubForHero(heroId: string, githubUsername: string) {
  const stats = await fetchGitHubData(githubUsername);

  // Calculate XP bonus based on GitHub activity
  const repoXP = Math.min(stats.publicRepos * 50, 1500); // up to 1500 XP
  const starXP = Math.min(stats.totalStars * 20, 2000);   // up to 2000 XP
  const followerXP = Math.min(stats.followers * 10, 1000); // up to 1000 XP

  const totalGitHubXPBonus = repoXP + starXP + followerXP;
  const impactBonus = Math.floor(totalGitHubXPBonus / 5);

  // Update hero profile with GitHub stats metadata
  const hero = await prisma.heroProfile.findUnique({ where: { id: heroId } });
  if (!hero) throw new Error('Hero profile not found');

  const earnedXP = Math.floor(totalGitHubXPBonus * 0.2);
  const newXP = hero.xp + earnedXP;
  const newLevel = Math.floor(newXP / 1000) + 1;

  const updatedProfile = await prisma.heroProfile.update({
    where: { id: heroId },
    data: {
      github: githubUsername,
      xp: newXP,
      level: newLevel,
      totalImpact: hero.totalImpact + Math.floor(impactBonus * 0.2),
    },
  });

  // Sync recent GitHub repos as Hero Projects if not already existing
  for (const repo of stats.recentRepos) {
    const existing = await prisma.project.findFirst({
      where: { heroId, title: repo.name },
    });

    if (!existing) {
      await prisma.project.create({
        data: {
          heroId,
          title: repo.name,
          description: repo.description,
          url: repo.html_url,
          tags: JSON.stringify([repo.language, 'GitHub', 'OSS']),
          status: 'active',
        },
      });
    }
  }

  // Create GitHub sync activity record
  await prisma.activity.create({
    data: {
      userId: hero.userId,
      heroId,
      type: 'achievement',
      content: `Synced GitHub profile (@${githubUsername}) — Import completed with ${stats.publicRepos} repos & ${stats.totalStars} stars!`,
      metadata: JSON.stringify({ stats, bonusXP: totalGitHubXPBonus }),
    },
  });

  // Broadcast WebSockets live event to all connected clients!
  broadcastLiveEvent({
    type: newLevel > hero.level ? 'level_up' : 'xp_gained',
    title: newLevel > hero.level ? `🎉 ${hero.displayName} Reached Level ${newLevel}!` : `⚡ ${hero.displayName} Earned +${earnedXP} XP!`,
    message: `Synced GitHub @${githubUsername} (${stats.publicRepos} repos, ${stats.totalStars} stars)`,
    heroName: hero.displayName,
    avatarUrl: hero.avatarUrl,
  });

  return {
    profile: updatedProfile,
    stats,
    xpEarned: earnedXP,
  };
}
