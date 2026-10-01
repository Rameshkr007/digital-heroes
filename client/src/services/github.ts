import api from './api';

export interface GitHubSyncResponse {
  profile: any;
  stats: {
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
  };
  xpEarned: number;
}

export const githubService = {
  async sync(githubUsername: string) {
    const res = await api.post('/github/sync', { githubUsername });
    return res.data.data as GitHubSyncResponse;
  },

  async getStats(username: string) {
    const res = await api.get(`/github/stats/${username}`);
    return res.data.data;
  },
};
