import api from './api';

export interface AuditLogItem {
  id: string;
  username: string;
  action: string;
  module: string;
  details: string;
  createdAt: string;
}

export const adminService = {
  async getAuditLogs(params?: { module?: string; action?: string }) {
    const res = await api.get('/admin/audit-logs', { params });
    return res.data.data as AuditLogItem[];
  },

  async getAnomalies() {
    const res = await api.get('/admin/anomalies');
    return res.data.data;
  },

  async askCopilot(question: string) {
    const res = await api.post('/admin/ai-copilot', { question });
    return res.data.data as { answer: string };
  },

  async getFeatureFlags() {
    const res = await api.get('/admin/feature-flags');
    return res.data.data;
  },

  async toggleFeatureFlag(key: string, enabled: boolean) {
    const res = await api.patch('/admin/feature-flags', { key, enabled });
    return res.data.data;
  },
};
