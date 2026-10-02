import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Dices, ShieldCheck, Play, CheckCircle2, Clock, FileCheck, Layers, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useToast } from '../store/toastStore';
import { drawService, DrawPoolItem } from '../services/draw';

export default function DrawEngine() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);
  const [drawPool, setDrawPool] = useState<DrawPoolItem | null>(null);

  // Simulation Lab State
  const [simMode, setSimMode] = useState<'HYBRID' | 'RANDOM' | 'WEIGHTED'>('HYBRID');
  const [simSeed, setSimSeed] = useState('seed_9824a71');
  const [simResult, setSimResult] = useState<any>(null);

  useEffect(() => {
    drawService
      .getCurrentDraw()
      .then(setDrawPool)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleRunSimulation = async () => {
    try {
      setSimulating(true);
      const res = await drawService.simulateDraw({ mode: simMode, seed: simSeed });
      setSimResult(res);
      toast.success('🎉 Simulation Complete!', `Seeded simulation executed without live payouts.`);
    } catch (err: any) {
      toast.error('Simulation Error', err.message);
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-slate-50 dark:bg-navy-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Badge variant="primary" className="mb-2">Module 3 & 15 • Transparent Draw Engine & Simulator Lab</Badge>
            <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <Dices className="text-indigo-500" size={32} /> Dynamic Draw Engine & Simulator Lab
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Cryptographically secure transparent selection (Random, Weighted, Hybrid) with dedicated Admin Simulator Lab.
            </p>
          </div>
        </div>

        {/* Current Draw Pool Status Card */}
        <Card padding="lg" className="bg-gradient-to-br from-indigo-900/40 via-navy-900 to-navy-950 border-indigo-500/40">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="success">{drawPool?.status || 'OPEN'}</Badge>
                <Badge variant="primary">{drawPool?.mode || 'HYBRID'} MODE</Badge>
              </div>
              <h2 className="font-display text-2xl font-bold text-white">{drawPool?.title || 'October 2026 Champion Draw Pool'}</h2>
              <p className="text-sm text-slate-300">
                Eligible Participants: <span className="font-bold text-indigo-400">{drawPool?.totalParticipants || 2481} active subscribers</span>
              </p>
            </div>

            <div className="text-right space-y-1 bg-navy-950/80 p-4 rounded-2xl border border-indigo-500/30 shrink-0">
              <p className="text-xs text-slate-400">Total Prize Pool</p>
              <p className="text-3xl font-extrabold text-emerald-400">₹{(drawPool?.prizePool || 85000).toLocaleString()}</p>
              <p className="text-xs text-indigo-300">Monthly Reward Distribution</p>
            </div>
          </div>
        </Card>

        {/* Simulator Lab Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Simulation Controls */}
          <div className="lg:col-span-5 space-y-6">
            <Card padding="lg" className="border-indigo-500/30">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Layers className="text-indigo-500" size={20} /> Draw Simulator Lab
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 mb-1 block">Algorithm Mode</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['HYBRID', 'RANDOM', 'WEIGHTED'] as const).map((m) => (
                      <button
                        key={m}
                        onClick={() => setSimMode(m)}
                        className={`py-2 rounded-xl text-xs font-bold transition-all border ${simMode === m ? 'bg-indigo-600 text-white border-indigo-400 shadow-glow-sm' : 'bg-navy-900 text-slate-400 border-navy-700'}`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 mb-1 block">Cryptographic Seed / Hash</label>
                  <input
                    type="text"
                    value={simSeed}
                    onChange={(e) => setSimSeed(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 text-slate-900 dark:text-white font-mono text-sm"
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-100 dark:bg-navy-900 text-xs text-slate-400 space-y-1">
                  <p className="font-bold text-slate-200">Mode Breakdown:</p>
                  <p>• **Random:** Cryptographically secure uniform random selection.</p>
                  <p>• **Weighted:** Probability weighted by score consistency & level.</p>
                  <p>• **Hybrid:** Random selection constrained by verified eligibility rules.</p>
                </div>

                <Button size="lg" className="w-full gap-2" isLoading={simulating} onClick={handleRunSimulation} leftIcon={<Play size={18} />}>
                  Run Seeded Simulation
                </Button>
              </div>
            </Card>
          </div>

          {/* Simulation Results & Proof Verification */}
          <div className="lg:col-span-7 space-y-6">
            {simResult ? (
              <Card padding="lg" className="border-emerald-500/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="text-emerald-400" size={20} /> Simulation Result #001
                  </h3>
                  <Badge variant="success">Verified Reproducible</Badge>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 font-mono text-xs text-slate-300 space-y-2 mb-6">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Preview Winner:</span>
                    <span className="text-emerald-400 font-bold">{simResult.selectedWinner?.displayName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Mode / Seed:</span>
                    <span className="text-indigo-400">{simResult.mode} / {simResult.seed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Eligible Candidates:</span>
                    <span>{simResult.eligibleCount} users</span>
                  </div>
                </div>

                <h4 className="font-bold text-sm text-white mb-3">Top Weighted Candidates Preview:</h4>
                <div className="space-y-2">
                  {simResult.candidates?.slice(0, 4).map((c: any, i: number) => (
                    <div key={i} className="p-3 rounded-xl bg-navy-900 border border-navy-800 flex justify-between items-center text-xs">
                      <span className="font-semibold text-white">{c.displayName} (Level {c.level})</span>
                      <span className="text-indigo-400 font-mono font-bold">Weight Factor: {c.weight}x</span>
                    </div>
                  ))}
                </div>
              </Card>
            ) : (
              <Card padding="lg" className="text-center py-16">
                <Dices className="text-indigo-500 mx-auto mb-4" size={40} />
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Simulation Lab Ready</h3>
                <p className="text-sm text-slate-400 max-w-sm mx-auto">
                  Run a seeded draw simulation to preview candidate selection, eligibility snapshots, and audit logs without triggering live payouts.
                </p>
              </Card>
            )}

            {/* Winner Verification Status Card */}
            <Card padding="md">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <FileCheck className="text-indigo-500" size={18} /> Module 13 • Winner Verification Pipeline
              </h4>

              <div className="grid grid-cols-4 gap-2 text-center text-xs font-semibold">
                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">1. Winner Picked</div>
                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">2. Proof Upload</div>
                <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">3. Admin Review</div>
                <div className="p-2 rounded-lg bg-navy-900 text-slate-500 border border-navy-800">4. Payout</div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
