import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Zap, TrendingUp, CheckCircle2, Clock, Filter } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { Tabs } from '../components/ui/Tabs';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { Avatar } from '../components/ui/Avatar';
import api from '../services/api';
import { timeAgo, getCategoryColor } from '../utils/helpers';

interface AchievementItem {
  id: string; title: string; description: string; category: string; iconName: string;
  xpReward: number; impactScore: number; isVerified: boolean; achievedAt: string;
  hero: { displayName: string; avatarUrl: string; user: { username: string } };
}

const categories = ['All', 'Innovation', 'Technical', 'Community', 'Impact', 'Achievement', 'Security'];

export default function Achievements() {
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    setLoading(true);
    const params = activeCategory !== 'All' ? { category: activeCategory } : {};
    api.get('/achievements', { params }).then((r) => setAchievements(r.data.data)).catch(() => setAchievements([])).finally(() => setLoading(false));
  }, [activeCategory]);

  const tabs = categories.map((c) => ({ id: c, label: c }));

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <Badge variant="primary" className="mb-3">Hall of Fame</Badge>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-3">
            Hero <span className="gradient-text">Achievements</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">Celebrating real impact, real growth, and real milestones.</p>
        </motion.div>

        <Tabs tabs={tabs} activeTab={activeCategory} onChange={setActiveCategory} variant="pills" className="mb-8" />

        {loading ? (
          <div className="space-y-4">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} height={96} />)}</div>
        ) : achievements.length === 0 ? (
          <EmptyState icon={<Trophy size={32} />} title="No achievements yet" description="Be the first to earn achievements in this category." />
        ) : (
          <div className="space-y-4">
            {achievements.map((ach, i) => (
              <motion.div key={ach.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                <Card padding="md" className="flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl shrink-0 font-bold ${getCategoryColor(ach.category)}`}>
                    🏆
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-slate-900 dark:text-white">{ach.title}</h3>
                      <div className="flex items-center gap-2">
                        {ach.isVerified && <Badge variant="success" size="sm"><CheckCircle2 size={10} /> Verified</Badge>}
                        <Badge variant="default" size="sm">{ach.category}</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{ach.description}</p>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1 text-xs text-amber-500"><Zap size={11} />+{ach.xpReward} XP</span>
                      <span className="flex items-center gap-1 text-xs text-emerald-500"><TrendingUp size={11} />+{ach.impactScore} Impact</span>
                      <span className="flex items-center gap-1 text-xs text-slate-400"><Clock size={11} />{timeAgo(ach.achievedAt)}</span>
                    </div>
                  </div>
                  <div className="shrink-0 hidden sm:flex flex-col items-center gap-2">
                    <Avatar src={ach.hero.avatarUrl} alt={ach.hero.displayName} size="md" />
                    <p className="text-xs text-slate-500 text-center">{ach.hero.displayName}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
