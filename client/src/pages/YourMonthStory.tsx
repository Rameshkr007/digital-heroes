import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, CheckCircle2, Heart, Award, ArrowRight, Calendar } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function YourMonthStory() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const name = user?.profile?.displayName?.split(' ')[0] || 'Hero';

  return (
    <div className="min-h-screen pt-24 pb-16 bg-slate-50 dark:bg-navy-950 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 w-full space-y-8 text-center">
        <Badge variant="primary" className="mx-auto">Section 11 • Personal Monthly Story</Badge>
        <h1 className="font-display text-4xl font-extrabold text-slate-900 dark:text-white">
          YOUR <span className="gradient-text">SEPTEMBER</span> RECAP 🗓️
        </h1>
        <p className="text-slate-400 text-sm">
          September was your strongest month yet, {name}! Here is your personalized journey story.
        </p>

        {/* Animated Story Cards Stack */}
        <div className="space-y-6 text-left">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card padding="lg" className="bg-gradient-to-br from-indigo-900/40 via-navy-900 to-navy-950 border-indigo-500/40">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="text-indigo-400" size={24} />
                <h3 className="font-bold text-white text-lg">Performance ↑</h3>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                Your 5-score rolling average improved by **14%** this month. Your stroke consistency reached **85%**, unlocking official draw eligibility.
              </p>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card padding="lg" className="bg-gradient-to-br from-emerald-900/40 via-navy-900 to-navy-950 border-emerald-500/40">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle2 className="text-emerald-400" size={24} />
                <h3 className="font-bold text-white text-lg">Participation ✓</h3>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                You maintained an active subscription and qualified for the **₹85,000 Hybrid Draw Pool**.
              </p>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card padding="lg" className="bg-gradient-to-br from-amber-900/40 via-navy-900 to-navy-950 border-amber-500/40">
              <div className="flex items-center gap-3 mb-2">
                <Heart className="text-amber-400" size={24} />
                <h3 className="font-bold text-white text-lg">Impact ↑</h3>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                Your subscription funded **60 nutritious midday meals** for children through Akshaya Patra Foundation.
              </p>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card padding="lg" className="bg-gradient-to-br from-violet-900/40 via-navy-900 to-navy-950 border-violet-500/40">
              <div className="flex items-center gap-3 mb-2">
                <Award className="text-violet-400" size={24} />
                <h3 className="font-bold text-white text-lg">Achievement Unlocked 🏆</h3>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                Earned the ***Consistency Hero*** badge for maintaining an 85%+ consistency index.
              </p>
            </Card>
          </motion.div>
        </div>

        <Button size="lg" className="mx-auto" onClick={() => navigate('/dashboard')}>
          Back to My Dashboard
        </Button>
      </div>
    </div>
  );
}
