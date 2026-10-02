import api from './api';

export interface GolfScoreItem {
  id: string;
  score: number;
  handicap: number;
  stablefordPoints: number;
  courseName: string;
  isFlagged: boolean;
  flagReason?: string;
  playedAt: string;
}

export interface GolfPerformanceData {
  totalScores: number;
  rollingAverage: number;
  bestScore: number;
  worstScore: number;
  consistencyScore: number;
  trend: 'IMPROVING' | 'STABLE' | 'DECLINING';
  scores: GolfScoreItem[];
}

export interface AIGolfCoachData {
  coachName: string;
  summary: string;
  consistencyScore: number;
  trend: string;
  strongAreas: string[];
  weakAreas: string[];
  personalizedSuggestions: string[];
  journeyReport: string;
}

export const golfService = {
  async submitScore(data: { score: number; handicap?: number; courseName?: string }) {
    const res = await api.post('/golf/score', data);
    return res.data.data;
  },

  async getPerformance() {
    const res = await api.get('/golf/performance');
    return res.data.data as GolfPerformanceData;
  },

  async getCoachAdvice() {
    const res = await api.get('/golf/coach');
    return res.data.data as AIGolfCoachData;
  },
};
