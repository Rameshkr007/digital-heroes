import api from './api';

export interface RecommendationItem {
  id: string;
  title: string;
  description: string;
  reason: string;
  dataSource: string;
  confidence: number;
  actionUrl: string;
  ctaText: string;
  dismissed: boolean;
}

export interface MonthlyStoryData {
  id: string;
  month: string;
  year: number;
  shareToken: string;
  summary: {
    heroName: string;
    month: string;
    year: number;
    totalScores: number;
    rollingAverage: number;
    bestScore: number;
    consistencyScore: number;
    trend: string;
    mealsFunded: number;
    treesPlanted: number;
    educationKits: number;
    totalContribution: number;
    highlights: string[];
  };
}

export interface PredictiveInsightItem {
  id: string;
  metricName: string;
  estimate: string;
  confidence: number;
  basis: string;
  limitations: string;
}

export interface AdminQueueItem {
  id: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  module: string;
  reason: string;
  recommendedAction: string;
  status: string;
  createdAt: string;
}

export interface BackgroundJobItem {
  id: string;
  jobType: string;
  status: string;
  attempts: number;
  maxAttempts: number;
  scheduledAt: string;
}

export const level4Service = {
  async getRecommendations() {
    const res = await api.get('/level4/recommendations');
    return res.data.data as RecommendationItem[];
  },

  async dismissRecommendation(id: string) {
    const res = await api.patch(`/level4/recommendations/${id}/dismiss`);
    return res.data.data;
  },

  async getMonthlyStory(month?: string, year?: number) {
    const res = await api.get('/level4/monthly-story', { params: { month, year } });
    return res.data.data as MonthlyStoryData;
  },

  async runDrawLab(data: { participantCount?: number; prizePool?: number; mode?: string }) {
    const res = await api.post('/level4/draw/lab-simulate', data);
    return res.data.data;
  },

  async getPredictiveInsights() {
    const res = await api.get('/level4/predictive');
    return res.data.data as PredictiveInsightItem[];
  },

  async getAdminQueue() {
    const res = await api.get('/level4/admin/queue');
    return res.data.data as AdminQueueItem[];
  },

  async resolveAdminQueueItem(id: string) {
    const res = await api.patch(`/level4/admin/queue/${id}/resolve`);
    return res.data.data;
  },

  async getJobs() {
    const res = await api.get('/level4/jobs');
    return res.data.data as BackgroundJobItem[];
  },

  async getSystemHealth() {
    const res = await api.get('/level4/system/health');
    return res.data;
  },
};
