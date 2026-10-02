import api from './api';

export interface ActionPreview {
  actionType: string;
  target: string;
  payload?: any;
  requiresScreenConfirmation: boolean;
  message: string;
}

export interface VoiceQueryResult {
  intent: string;
  response: string;
  confidence: number;
  action?: string;
  isCriticalAction: boolean;
  actionPreview?: ActionPreview;
  sessionId?: string;
}

export interface VoiceUsageStats {
  totalMinutes: number;
  totalSttCalls: number;
  totalTtsCalls: number;
  estimatedCostUsd: number;
  activeSessionsCount: number;
  providerHealth: {
    stt: string;
    tts: string;
    latencyMs: number;
  };
}

export interface VoicePrivacySettings {
  transcriptionOptIn: boolean;
  audioRetentionDays: number;
  allowPersonalization: boolean;
}

export const voiceService = {
  async sendVoiceQuery(transcript: string, screenContext: string = 'GENERAL'): Promise<VoiceQueryResult> {
    const res = await api.post('/voice/query', { transcript, screenContext });
    return res.data.data;
  },

  async getVoiceUsage(): Promise<VoiceUsageStats> {
    const res = await api.get('/voice/usage');
    return res.data.data;
  },

  async getPrivacySettings(): Promise<VoicePrivacySettings> {
    const res = await api.get('/voice/privacy');
    return res.data.data;
  },

  async clearVoiceHistory(): Promise<{ success: boolean; message: string }> {
    const res = await api.post('/voice/privacy/clear-history');
    return res.data;
  },
};
