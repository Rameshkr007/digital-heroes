import api from './api';

export interface HeroCard {
  id: string;
  displayName: string;
  title: string;
  bio: string;
  avatarUrl: string;
  level: number;
  xp: number;
  totalImpact: number;
  location: string;
  user: { username: string };
  skills: Array<{ proficiency: number; skill: { name: string; category: string; iconName: string } }>;
  badges: Array<{ badge: { name: string; iconName: string; rarity: string } }>;
  _count: { achievements: number };
}

export interface HeroProfile extends HeroCard {
  website: string;
  github: string;
  twitter: string;
  linkedin: string;
  achievements: Achievement[];
  projects: Project[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: string;
  iconName: string;
  xpReward: number;
  impactScore: number;
  isVerified: boolean;
  achievedAt: string;
  relatedSkills: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  url: string;
  tags: string;
  status: string;
}

export interface PlatformStats {
  heroCount: number;
  achievementCount: number;
  totalXp: number;
  impactScore: number;
}

export const heroesService = {
  async getHeroes(params?: { search?: string; skill?: string; sortBy?: string; page?: number; limit?: number }) {
    const res = await api.get('/heroes', { params });
    return res.data as { heroes: HeroCard[]; pagination: { total: number; page: number; limit: number; totalPages: number } };
  },

  async getHero(username: string) {
    const res = await api.get(`/heroes/${username}`);
    return res.data.data as { username: string; profile: HeroProfile };
  },

  async getTopHeroes() {
    const res = await api.get('/heroes/top');
    return res.data.data as HeroCard[];
  },

  async getStats() {
    const res = await api.get('/heroes/stats');
    return res.data.data as PlatformStats;
  },
};
