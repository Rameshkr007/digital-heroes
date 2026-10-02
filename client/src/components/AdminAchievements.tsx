import React, { useState, useEffect } from 'react';
import { Trophy, CheckCircle2, XCircle, Award, Sparkles } from 'lucide-react';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { level3Service, ConfigurableAchievement } from '../services/level3';
import { useToast } from '../store/toastStore';

export function AdminAchievements() {
  const toast = useToast();
  const [achievements, setAchievements] = useState<ConfigurableAchievement[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchList = () => {
    setLoading(true);
    level3Service
      .getAchievements()
      .then(setAchievements)
      .catch(() => {
        setAchievements([
          { id: 'a1', key: 'FIRST_SCORE', title: '🏅 First Round Hero', description: 'Submitted first verified score.', category: 'Performance', iconName: 'target', triggerKey: 'SCORE_COUNT', threshold: 1, xpReward: 150, impactScore: 50, active: true },
          { id: 'a2', key: 'STREAK', title: '🔥 5-Score Consistency Streak', description: 'Achieved sub-5 stroke variance streak.', category: 'Consistency', iconName: 'flame', triggerKey: 'SCORE_COUNT', threshold: 5, xpReward: 350, impactScore: 150, active: true },
        ]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleToggle = async (id: string, currentActive: boolean) => {
    try {
      await level3Service.toggleAchievement(id, !currentActive);
      toast.success('Achievement Updated', `Achievement status set to ${!currentActive ? 'Active' : 'Inactive'}.`);
      fetchList();
    } catch (err) {
      toast.error('Error', 'Could not update achievement toggle');
    }
  };

  return (
    <Card padding="lg" className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <Badge variant="primary" className="mb-2 gap-1">
            <Sparkles size={14} /> Section 13 • Dynamic Gamification Configurator
          </Badge>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <Trophy className="text-amber-500" size={20} /> Configurable Achievements Engine
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Admin management of performance, participation & charity achievements.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {achievements.map((ach) => (
          <div
            key={ach.id}
            className="p-4 rounded-xl bg-slate-100/60 dark:bg-navy-900/60 border border-slate-200 dark:border-navy-800 flex items-center justify-between flex-wrap gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                <Award size={20} />
              </div>
              <div>
                <p className="font-bold text-sm text-slate-900 dark:text-white">{ach.title}</p>
                <p className="text-xs text-slate-400">
                  {ach.description} • Trigger: <span className="font-mono text-indigo-400">{ach.triggerKey}</span> (Threshold: {ach.threshold})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant={ach.active ? 'success' : 'default'}>
                {ach.active ? 'Active' : 'Inactive'}
              </Badge>
              <Button
                variant={ach.active ? 'ghost' : 'outline'}
                size="sm"
                onClick={() => handleToggle(ach.id, ach.active)}
              >
                {ach.active ? 'Disable' : 'Enable'}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
