import api from './api';

export interface UserPreferences {
  dashboardLayout: string;
  emailNotifs: boolean;
  inAppNotifs: boolean;
  preferredCharity: string;
  isPublicProfile: boolean;
  aiMemory: Record<string, any>;
}

export interface UserJourneyStep {
  stepKey: string;
  title: string;
  description: string;
  isDone: boolean;
}

export interface UserJourneyData {
  steps: UserJourneyStep[];
  completedStepsCount: number;
  totalStepsCount: number;
  progressPercentage: number;
  nextBestAction: {
    stepKey: string;
    title: string;
    description: string;
    reason: string;
    actionUrl: string;
    ctaText: string;
  };
}

export interface ConfigurableAchievement {
  id: string;
  key: string;
  title: string;
  description: string;
  category: string;
  iconName: string;
  triggerKey: string;
  threshold: number;
  xpReward: number;
  impactScore: number;
  active: boolean;
}

export interface ImpactLedgerItem {
  id: string;
  charityName: string;
  amount: number;
  metricType: string;
  metricCount: number;
  period: string;
  proofUrl: string;
  status: string;
  createdAt: string;
}

export interface DomainEvent {
  id: string;
  userId?: string;
  eventType: string;
  payload: string;
  createdAt: string;
}

export const level3Service = {
  async getPreferences() {
    const res = await api.get('/level3/preferences');
    return res.data.data as UserPreferences;
  },

  async updatePreferences(data: Partial<UserPreferences>) {
    const res = await api.patch('/level3/preferences', data);
    return res.data.data as UserPreferences;
  },

  async clearMemory() {
    const res = await api.post('/level3/preferences/clear-memory');
    return res.data;
  },

  async askCopilot(question: string) {
    const res = await api.post('/level3/copilot', { question });
    return res.data.data as { answer: string; timestamp: string };
  },

  async getJourney() {
    const res = await api.get('/level3/journey');
    return res.data.data as UserJourneyData;
  },

  async getAchievements() {
    const res = await api.get('/level3/gamification/achievements');
    return res.data.data as ConfigurableAchievement[];
  },

  async toggleAchievement(id: string, active: boolean) {
    const res = await api.patch(`/level3/gamification/achievements/${id}/toggle`, { active });
    return res.data.data as ConfigurableAchievement;
  },

  async getImpactLedger() {
    const res = await api.get('/level3/impact-ledger');
    return res.data.data as ImpactLedgerItem[];
  },

  async getEvents() {
    const res = await api.get('/level3/events');
    return res.data.data as DomainEvent[];
  },
};
