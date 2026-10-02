import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mic,
  Activity,
  DollarSign,
  Clock,
  Server,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import { voiceService, VoiceUsageStats } from '../services/voice';
import { useToast } from '../store/toastStore';

export function AdminVoiceUsage() {
  const [stats, setStats] = useState<VoiceUsageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await voiceService.getVoiceUsage();
      setStats(data);
    } catch {
      toast.error('Voice Usage', 'Failed to load voice AI metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-3xl bg-slate-900/90 border border-emerald-500/20 shadow-2xl space-y-6 text-white"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Mic className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2">
              Voice AI & Copilot Infrastructure
              <span className="text-xs uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Level 4 Active
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Real-time Speech-to-Text, Text-to-Speech & Cost Analytics
            </p>
          </div>
        </div>

        <button
          onClick={fetchStats}
          disabled={loading}
          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center gap-2 text-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
          Refresh
        </button>
      </div>

      {loading && !stats ? (
        <div className="py-12 flex items-center justify-center text-xs text-slate-400 gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
          Loading Voice Metrics...
        </div>
      ) : stats ? (
        <>
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Minutes Streamed */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Total Voice Audio</span>
                <Clock className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-white">
                {stats.totalMinutes} <span className="text-xs text-slate-400 font-sans">mins</span>
              </div>
              <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Transient Audio Processing
              </div>
            </div>

            {/* STT & TTS Calls */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>STT / TTS Invocation</span>
                <Activity className="w-4 h-4 text-teal-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-white">
                {stats.totalSttCalls + stats.totalTtsCalls}
              </div>
              <div className="text-[10px] text-slate-400">
                STT: {stats.totalSttCalls} | TTS: {stats.totalTtsCalls}
              </div>
            </div>

            {/* Estimated AI Cost */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Estimated Voice Cost</span>
                <DollarSign className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-amber-300">
                ${stats.estimatedCostUsd.toFixed(4)}
              </div>
              <div className="text-[10px] text-slate-400">
                Based on $0.006/min STT + $0.015/1k ch TTS
              </div>
            </div>

            {/* Active Voice Sessions */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Active Voice Sessions</span>
                <Server className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-indigo-300">
                {stats.activeSessionsCount}
              </div>
              <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Live Audited Gateway
              </div>
            </div>
          </div>

          {/* Infrastructure Provider Status */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">STT Engine:</span>
                <span className="font-semibold text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> {stats.providerHealth.stt}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">TTS Engine:</span>
                <span className="font-semibold text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> {stats.providerHealth.tts}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-400">
              <span>Avg Latency:</span>
              <span className="font-mono text-emerald-300 font-bold">{stats.providerHealth.latencyMs} ms</span>
            </div>
          </div>
        </>
      ) : null}
    </motion.div>
  );
}
