import React, { useState } from 'react';
import { FlaskConical, Play, CheckCircle2, Shield, RefreshCw } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { level4Service } from '../services/level4';
import { useToast } from '../store/toastStore';

export function DrawLab() {
  const toast = useToast();
  const [participantCount, setParticipantCount] = useState('2500');
  const [prizePool, setPrizePool] = useState('85000');
  const [mode, setMode] = useState('HYBRID');
  const [simulating, setSimulating] = useState(false);
  const [simResult, setSimResult] = useState<any>(null);

  const handleRunSim = async (e: React.FormEvent) => {
    e.preventDefault();
    setSimulating(true);
    try {
      const res = await level4Service.runDrawLab({
        participantCount: parseInt(participantCount) || 2500,
        prizePool: parseFloat(prizePool) || 85000,
        mode,
      });
      setSimResult(res);
      toast.success('Simulation Completed', `Selected preview winner: ${res.selectedWinner}`);
    } catch (err: any) {
      toast.error('Simulation Error', err.message);
    } finally {
      setSimulating(false);
    }
  };

  return (
    <Card padding="lg" className="border-indigo-500/30 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <Badge variant="primary" className="mb-2 gap-1">
            <FlaskConical size={14} /> Section 10 • Draw Simulation Lab
          </Badge>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
            Non-Destructive Draw Algorithm Simulator
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Simulate custom participant pools & algorithm weights. *(Never alters live production draw pools)*
          </p>
        </div>
      </div>

      <form onSubmit={handleRunSim} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
        <div>
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Participant Count</label>
          <input
            type="number"
            value={participantCount}
            onChange={(e) => setParticipantCount(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Prize Pool (₹)</label>
          <input
            type="number"
            value={prizePool}
            onChange={(e) => setPrizePool(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Algorithm Mode</label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="HYBRID">HYBRID (Random + Consistency Rule)</option>
            <option value="WEIGHTED">WEIGHTED (Level 1.5x Weight)</option>
            <option value="RANDOM">RANDOM (Cryptographic Direct)</option>
          </select>
        </div>
        <Button type="submit" isLoading={simulating} leftIcon={<Play size={16} />}>
          Run Simulation Lab
        </Button>
      </form>

      {simResult && (
        <div className="p-4 rounded-xl bg-slate-900 border border-indigo-500/30 text-slate-200 space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between text-emerald-400 font-bold">
            <span>🎉 Preview Winner: {simResult.selectedWinner}</span>
            <Badge variant="success">SHA-256 Verified</Badge>
          </div>
          <p>Algorithm: {simResult.algorithm}</p>
          <p className="text-slate-400">Hash: {simResult.verificationHash}</p>
          <p className="text-slate-400">Seed: {simResult.seed}</p>
        </div>
      )}
    </Card>
  );
}
