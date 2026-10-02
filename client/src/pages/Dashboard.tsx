import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Zap, TrendingUp, Star, Activity, ArrowRight, Github, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useAuthStore } from '../store/authStore';
import { Avatar } from '../components/ui/Avatar';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { ProgressRing } from '../components/ui/ProgressRing';
import { getLevelTitle, getXPProgress, formatNumber } from '../utils/helpers';
import { authService } from '../services/auth';
import { githubService } from '../services/github';
import { useToast } from '../store/toastStore';

import { level3Service, UserJourneyData } from '../services/level3';
import { JourneyTimeline } from '../components/JourneyTimeline';
import { UserPreferencesModal } from '../components/UserPreferencesModal';
import { Settings } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const toast = useToast();
  const { user, updateUser } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [githubModal, setGithubModal] = useState(false);
  const [prefsModal, setPrefsModal] = useState(false);
  const [ghUsername, setGhUsername] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [journeyData, setJourneyData] = useState<UserJourneyData | null>(null);

  useEffect(() => {
    authService.getMe().then((data) => { updateUser(data); }).catch(() => {}).finally(() => setLoading(false));
    level3Service.getJourney().then(setJourneyData).catch(() => {});
  }, [updateUser]);

  const profile = user?.profile;
  if (!profile) return null;

  const xpProgress = getXPProgress(profile.xp);
  const levelTitle = getLevelTitle(profile.level);

  const handleGitHubSync = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ghUsername.trim()) return;

    setSyncing(true);
    try {
      const res = await githubService.sync(ghUsername.trim());
      toast.success(
        'GitHub Synced Successfully! 🚀',
        `Earned +${res.xpEarned} XP! Imported ${res.stats.publicRepos} repos & ${res.stats.totalStars} stars.`
      );

      // Refresh user profile state
      const updatedUser = await authService.getMe();
      updateUser(updatedUser);
      setGithubModal(false);
      setGhUsername('');
    } catch (err: any) {
      toast.error('GitHub Sync Failed', err.response?.data?.message || err.message);
    } finally {
      setSyncing(false);
    }
  };

  const radarData = [
    { subject: 'Technical', value: 80 },
    { subject: 'Innovation', value: 65 },
    { subject: 'Community', value: 70 },
    { subject: 'Impact', value: 55 },
    { subject: 'Growth', value: 85 },
    { subject: 'Consistency', value: 60 },
  ];

  const activityData = [
    { month: 'Jan', xp: 200 }, { month: 'Feb', xp: 380 }, { month: 'Mar', xp: 520 },
    { month: 'Apr', xp: 410 }, { month: 'May', xp: 680 }, { month: 'Jun', xp: 750 },
    { month: 'Jul', xp: profile.xp % 1000 },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 bg-slate-50 dark:bg-navy-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Avatar src={profile.avatarUrl} alt={profile.displayName} size="xl" level={profile.level} />
              <div>
                <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">
                  Welcome back, {profile.displayName.split(' ')[0]}!
                </h1>
                <p className="text-slate-500 dark:text-slate-400">
                  {levelTitle} · {profile.xp.toLocaleString()} XP
                  {profile.github && <span className="ml-2 inline-flex items-center text-xs bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full font-medium">@{profile.github}</span>}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={() => setPrefsModal(true)} variant="ghost" leftIcon={<Settings size={16} />}>
                AI & Privacy Settings
              </Button>
              <Button onClick={() => setGithubModal(true)} variant="secondary" leftIcon={<Github size={16} />}>
                Sync GitHub
              </Button>
              <Button onClick={() => navigate(`/heroes/${user?.username}`)} variant="outline" rightIcon={<ArrowRight size={14} />}>
                View My Profile
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Personal Journey Engine Timeline & Smart Actions */}
        <JourneyTimeline journeyData={journeyData} onActionClick={(url) => navigate(url)} />

        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[{
            icon: <Star size={20} className="text-indigo-500" />, label: 'Level', value: profile.level, bg: 'from-indigo-500/10 to-violet-500/10'
          }, {
            icon: <Zap size={20} className="text-amber-500" />, label: 'Total XP', value: formatNumber(profile.xp), bg: 'from-amber-500/10 to-orange-500/10'
          }, {
            icon: <Trophy size={20} className="text-violet-500" />, label: 'Achievements', value: 0, bg: 'from-violet-500/10 to-purple-500/10'
          }, {
            icon: <TrendingUp size={20} className="text-emerald-500" />, label: 'Impact Score', value: formatNumber(profile.totalImpact), bg: 'from-emerald-500/10 to-teal-500/10'
          }].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Card padding="md" className={`bg-gradient-to-br ${stat.bg} border-none`}>
                <div className="flex items-center justify-between mb-2">
                  {stat.icon}
                  <span className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</span>
                </div>
                <p className="text-3xl font-bold font-display text-slate-900 dark:text-white">{stat.value}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* XP Progress */}
          <Card padding="md" className="flex flex-col items-center justify-center">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4 self-start">Level Progress</h3>
            <ProgressRing percentage={xpProgress} size={140} strokeWidth={12} color="#6366f1">
              <div className="text-center">
                <p className="text-3xl font-bold gradient-text">{profile.level}</p>
                <p className="text-xs text-slate-400">Level</p>
              </div>
            </ProgressRing>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">{Math.round(xpProgress)}% to Level {profile.level + 1}</p>
            <Badge variant="primary" className="mt-2">{levelTitle}</Badge>
          </Card>

          {/* XP Chart */}
          <Card padding="md" className="lg:col-span-2">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">XP Growth</h3>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="xpGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.1)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="transparent" />
                <YAxis tick={{ fontSize: 12 }} stroke="transparent" />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(15,14,40,0.9)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 12, color: '#e2e8f0' }} />
                <Area type="monotone" dataKey="xp" stroke="#6366f1" strokeWidth={2} fill="url(#xpGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Radar + Quick actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card padding="md">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Hero Dimensions</h3>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(99,102,241,0.2)" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                <Radar name="You" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
          </Card>

          <Card padding="md" className="lg:col-span-2">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><Activity size={18} className="text-indigo-500" /> Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[{
                icon: '⚡', label: 'Sync GitHub Activity', desc: 'Auto-import repos & earn XP bonus', action: () => setGithubModal(true)
              }, {
                icon: '🏆', label: 'Browse Achievements', desc: 'Find new achievements to earn', action: () => navigate('/achievements')
              }, {
                icon: '👥', label: 'Explore Heroes', desc: 'Connect with the community', action: () => navigate('/explore')
              }, {
                icon: '🚀', label: 'View My Profile', desc: 'See how others see you', action: () => navigate(`/heroes/${user?.username}`)
              }].map((item) => (
                <button key={item.label} onClick={item.action}
                  className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 dark:border-navy-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-all text-left group">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{item.label}</p>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* GitHub Sync Modal */}
      <Modal isOpen={githubModal} onClose={() => setGithubModal(false)} title="Sync GitHub Activity 🚀">
        <form onSubmit={handleGitHubSync} className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Enter your GitHub username to automatically fetch public repositories, stargazers, and followers. We will calculate your bonus XP and import top projects into your profile!
          </p>
          <Input
            label="GitHub Username"
            placeholder="e.g. Rameshkr007"
            value={ghUsername}
            onChange={(e) => setGhUsername(e.target.value)}
            leftElement={<Github size={16} />}
            required
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-navy-800">
            <Button type="button" variant="ghost" onClick={() => setGithubModal(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={syncing} leftIcon={<RefreshCw size={16} className={syncing ? 'animate-spin' : ''} />}>
              Start GitHub Sync
            </Button>
          </div>
        </form>
      </Modal>
      {/* User Preferences & AI Memory Modal */}
      <UserPreferencesModal isOpen={prefsModal} onClose={() => setPrefsModal(false)} />
    </div>
  );
}
