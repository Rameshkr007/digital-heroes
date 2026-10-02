import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, ShieldAlert, FileText, ToggleLeft, ToggleRight, Send, AlertTriangle, CheckCircle2, Lock, Cpu, Search, Activity } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useToast } from '../store/toastStore';
import { adminService, AuditLogItem } from '../services/admin';

export default function AdminCopilot() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);

  // AI Copilot state
  const [queryInput, setQueryInput] = useState('');
  const [copilotReply, setCopilotReply] = useState<string | null>(null);
  const [copilotLoading, setCopilotLoading] = useState(false);

  // Anomaly & Audit state
  const [anomalies, setAnomalies] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [featureFlags, setFeatureFlags] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      adminService.getAnomalies(),
      adminService.getAuditLogs(),
      adminService.getFeatureFlags(),
    ])
      .then(([a, logs, flags]) => {
        setAnomalies(a);
        setAuditLogs(logs);
        setFeatureFlags(flags);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleAskCopilot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryInput.trim() || copilotLoading) return;
    try {
      setCopilotLoading(true);
      const res = await adminService.askCopilot(queryInput);
      setCopilotReply(res.answer);
    } catch (err: any) {
      toast.error('AI Copilot Error', err.message);
    } finally {
      setCopilotLoading(false);
    }
  };

  const handleToggleFlag = async (key: string, currentEnabled: boolean) => {
    try {
      const updated = await adminService.toggleFeatureFlag(key, !currentEnabled);
      setFeatureFlags((prev) => prev.map((f) => (f.key === key ? updated : f)));
      toast.success('Feature Flag Updated', `'${key}' is now ${!currentEnabled ? 'ENABLED' : 'DISABLED'}`);
    } catch (err: any) {
      toast.error('Flag Toggle Error', err.message);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-slate-50 dark:bg-navy-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <Badge variant="primary" className="mb-2">Module 10, 11, 12, 14, 23 • Admin & Security Center</Badge>
            <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <Cpu className="text-indigo-500" size={32} /> AI Admin Copilot & Security Center
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Authorized AI Copilot, Fraud & Outlier Anomaly Detection, Feature Flags & Complete Audit Trail Explorer.
            </p>
          </div>
        </div>

        {/* AI Admin Copilot Section */}
        <Card padding="lg" className="border-indigo-500/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white">
              <Bot size={22} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Ask Digital Heroes AI Copilot</h3>
              <p className="text-xs text-slate-400">Read-only authorized database insights for administrators</p>
            </div>
          </div>

          <form onSubmit={handleAskCopilot} className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="e.g. How many active subscribers do we have? Or show unusual score changes."
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Button type="submit" size="lg" isLoading={copilotLoading} leftIcon={<Send size={16} />}>
              Ask Copilot
            </Button>
          </form>

          {copilotReply && (
            <div className="p-4 rounded-xl bg-slate-900 border border-indigo-500/30 text-slate-200 text-sm leading-relaxed whitespace-pre-line">
              {copilotReply}
            </div>
          )}
        </Card>

        {/* Grid: Fraud Monitor & Feature Flags */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Fraud & Anomaly Monitor */}
          <div className="lg:col-span-6 space-y-6">
            <Card padding="lg" className="border-rose-500/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldAlert className="text-rose-500" size={20} /> Fraud & Anomaly Risk Monitor
                </h3>
                <Badge variant={anomalies?.riskLevel === 'HIGH' ? 'error' : 'warning'}>
                  RISK STATUS: {anomalies?.riskLevel || 'LOW'}
                </Badge>
              </div>

              <div className="space-y-3">
                {anomalies?.flaggedScores?.length > 0 ? (
                  anomalies.flaggedScores.map((fs: any, i: number) => (
                    <div key={i} className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex justify-between items-start">
                      <div>
                        <p className="font-bold text-sm text-white">{fs.displayName} (@{fs.username})</p>
                        <p className="text-xs text-rose-300 mt-1">{fs.flagReason}</p>
                        <p className="text-xs text-slate-400 mt-1">Course: {fs.courseName} • Score: {fs.score}</p>
                      </div>
                      <Badge variant="error">Review Required</Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-xs text-slate-400">
                    <CheckCircle2 className="text-emerald-400 mx-auto mb-2" size={28} />
                    All submitted golf scores are within normal statistical ranges. Risk level LOW.
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Module 23: Dynamic Feature Flags */}
          <div className="lg:col-span-6 space-y-6">
            <Card padding="lg">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Activity className="text-indigo-500" size={20} /> Dynamic Feature Flags Manager
              </h3>

              <div className="space-y-3">
                {featureFlags.map((ff) => (
                  <div key={ff.key} className="p-3.5 rounded-xl bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-navy-800 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm text-slate-900 dark:text-white">{ff.description || ff.key}</p>
                      <p className="text-xs text-slate-400 font-mono">{ff.key}</p>
                    </div>

                    <button onClick={() => handleToggleFlag(ff.key, ff.enabled)} className="text-indigo-500 hover:text-indigo-400 transition-colors">
                      {ff.enabled ? <ToggleRight size={32} className="text-emerald-400" /> : <ToggleLeft size={32} className="text-slate-500" />}
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Module 12: Complete Audit Log Explorer */}
        <Card padding="lg">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="text-indigo-500" size={20} /> Complete Audit Trail Explorer
            </h3>
            <Badge variant="primary">System Audit Log</Badge>
          </div>

          <div className="space-y-3">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start justify-between flex-wrap gap-2 font-mono text-xs">
                <div>
                  <span className="font-bold text-indigo-400">[{log.module}]</span>{' '}
                  <span className="text-white font-semibold">{log.action}</span>
                  <p className="text-slate-300 mt-1">{log.details}</p>
                </div>
                <div className="text-right text-slate-400">
                  <p>{new Date(log.createdAt).toLocaleString()}</p>
                  <p className="text-slate-500">User: {log.username}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
