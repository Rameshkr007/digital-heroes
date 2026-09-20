import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Globe, Github, Twitter, Linkedin, Trophy, Zap, TrendingUp, Star, ArrowLeft, ExternalLink, CheckCircle2, Clock } from 'lucide-react';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { ProgressRing } from '../components/ui/ProgressRing';
import { Skeleton } from '../components/ui/Skeleton';
import { Tabs } from '../components/ui/Tabs';
import { Button } from '../components/ui/Button';
import { heroesService } from '../services/heroes';
import { getLevelTitle, getXPProgress, timeAgo, getCategoryColor, formatNumber } from '../utils/helpers';

interface FullHero {
  username: string;
  profile: {
    id: string;
    displayName: string;
    title: string;
    bio: string;
    avatarUrl: string;
    location: string;
    website: string;
    github: string;
    twitter: string;
    linkedin: string;
    level: number;
    xp: number;
    totalImpact: number;
    skills: Array<{ proficiency: number; endorsements: number; skill: { name: string; category: string } }>;
    achievements: Array<{ id: string; title: string; description: string; category: string; iconName: string; xpReward: number; impactScore: number; isVerified: boolean; achievedAt: string }>;
    badges: Array<{ earnedAt: string; badge: { name: string; description: string; iconName: string; rarity: string } }>;
    projects: Array<{ id: string; title: string; description: string; url: string; tags: string; status: string }>;
  };
}

export default function HeroProfile() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [hero, setHero] = useState<FullHero | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('achievements');

  useEffect(() => {
    if (!username) return;
    setLoading(true);
    heroesService.getHero(username)
      .then((data) => setHero(data as unknown as FullHero))
      .catch(() => setError('Hero not found'))
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <Skeleton height={240} className="w-full" />
          <div className="grid grid-cols-3 gap-4">
            <Skeleton height={120} /><Skeleton height={120} /><Skeleton height={120} />
          </div>
        </div>
      </div>
    );
  }

  if (error || !hero) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🦸</div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Hero not found</h2>
          <p className="text-slate-500 mb-6">This hero doesn't exist or has gone incognito.</p>
          <Button onClick={() => navigate('/heroes')}>Browse Heroes</Button>
        </div>
      </div>
    );
  }

  const p = hero.profile;
  const xpProgress = getXPProgress(p.xp);
  const tabs = [
    { id: 'achievements', label: 'Achievements', count: p.achievements?.length },
    { id: 'skills', label: 'Skills', count: p.skills?.length },
    { id: 'projects', label: 'Projects', count: p.projects?.length },
    { id: 'badges', label: 'Badges', count: p.badges?.length },
  ];

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-navy-900 via-indigo-950 to-navy-950 pt-12 pb-24 overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 60% 40%, rgba(99,102,241,0.2) 0%, transparent 60%)' }} />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft size={16} /> Back
          </button>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
              <Avatar src={p.avatarUrl} alt={p.displayName} size="2xl" level={p.level} />
            </motion.div>
            <div className="flex-1">
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <h1 className="font-display text-4xl font-bold text-white mb-1">{p.displayName}</h1>
                <p className="text-indigo-300 text-lg mb-3">{p.title}</p>
                <div className="flex flex-wrap gap-3 mb-4">
                  {p.location && <span className="flex items-center gap-1.5 text-sm text-slate-300"><MapPin size={14} />{p.location}</span>}
                  {p.website && <a href={p.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-indigo-300 hover:text-indigo-200 transition-colors"><Globe size={14} />Website <ExternalLink size={10} /></a>}
                  {p.github && <a href={`https://github.com/${p.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-slate-300 hover:text-white transition-colors"><Github size={14} />{p.github}</a>}
                  {p.twitter && <a href={`https://twitter.com/${p.twitter}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-slate-300 hover:text-white transition-colors"><Twitter size={14} />@{p.twitter}</a>}
                </div>
                {p.bio && <p className="text-slate-300 leading-relaxed max-w-xl">{p.bio}</p>}
              </motion.div>
            </div>
            {/* Level ring */}
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
              <ProgressRing percentage={xpProgress} size={90} strokeWidth={8} color="#818cf8">
                <div className="flex flex-col items-center">
                  <span className="text-xl font-bold text-white">{p.level}</span>
                  <span className="text-xs text-indigo-300">LVL</span>
                </div>
              </ProgressRing>
              <p className="text-xs text-indigo-300 mt-2">{getLevelTitle(p.level)}</p>
              <p className="text-xs text-slate-400">{p.xp.toLocaleString()} XP</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="bg-white dark:bg-navy-900 border-b border-slate-200 dark:border-navy-700 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 divide-x divide-slate-200 dark:divide-navy-700 -mt-6">
            {[{
              icon: <Trophy size={18} className="text-amber-500" />, value: p.achievements?.length || 0, label: 'Achievements'
            }, {
              icon: <TrendingUp size={18} className="text-emerald-500" />, value: formatNumber(p.totalImpact), label: 'Impact Score'
            }, {
              icon: <Star size={18} className="text-violet-500" />, value: p.badges?.length || 0, label: 'Badges'
            }].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center py-6 px-4">
                <div className="flex items-center gap-2 mb-1">
                  {stat.icon}
                  <span className="text-2xl font-bold font-display text-slate-900 dark:text-white">{stat.value}</span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="mb-8" />

        {activeTab === 'achievements' && (
          <div className="space-y-4">
            {p.achievements?.length === 0 ? (
              <div className="text-center py-12 text-slate-400">No achievements yet</div>
            ) : p.achievements?.map((ach, i) => (
              <motion.div key={ach.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                <Card padding="md" className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg shrink-0 ${getCategoryColor(ach.category)}`}>
                    🏆
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <h3 className="font-semibold text-slate-900 dark:text-white">{ach.title}</h3>
                      <div className="flex items-center gap-2">
                        {ach.isVerified && <Badge variant="success" size="sm"><CheckCircle2 size={10} /> Verified</Badge>}
                        <Badge variant="default" size="sm">{ach.category}</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{ach.description}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1 text-xs text-amber-500"><Zap size={11} />+{ach.xpReward} XP</span>
                      <span className="flex items-center gap-1 text-xs text-emerald-500"><TrendingUp size={11} />+{ach.impactScore} Impact</span>
                      <span className="flex items-center gap-1 text-xs text-slate-400"><Clock size={11} />{timeAgo(ach.achievedAt)}</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {p.skills?.map((s, i) => (
              <motion.div key={s.skill.name} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card padding="md">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-white">{s.skill.name}</h4>
                      <p className="text-xs text-slate-500">{s.skill.category}</p>
                    </div>
                    <span className="text-2xl font-bold gradient-text">{s.proficiency}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-navy-800 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${s.proficiency}%` }}
                      transition={{ duration: 1, delay: i * 0.1, ease: 'easeOut' }}
                      className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                    />
                  </div>
                  {s.endorsements > 0 && (
                    <p className="text-xs text-slate-400 mt-2">{s.endorsements} endorsements</p>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {p.projects?.length === 0 ? (
              <div className="col-span-2 text-center py-12 text-slate-400">No projects yet</div>
            ) : p.projects?.map((proj, i) => {
              const tags = (() => { try { return JSON.parse(proj.tags); } catch { return []; } })();
              return (
                <motion.div key={proj.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                  <Card hover padding="md" className="h-full flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-slate-900 dark:text-white">{proj.title}</h3>
                      {proj.url && (
                        <a href={proj.url} target="_blank" rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-indigo-500 hover:text-indigo-600 transition-colors">
                          <ExternalLink size={16} />
                        </a>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 flex-1">{proj.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {tags.map((tag: string) => <Badge key={tag} variant="default" size="sm">{tag}</Badge>)}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        {activeTab === 'badges' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {p.badges?.length === 0 ? (
              <div className="col-span-4 text-center py-12 text-slate-400">No badges yet</div>
            ) : p.badges?.map((b, i) => (
              <motion.div key={b.badge.name} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.07 }}>
                <Card padding="md" className="text-center hover:scale-105 transition-transform duration-200">
                  <div className={`w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center text-2xl ${
                    b.badge.rarity === 'LEGENDARY' ? 'bg-gradient-to-br from-amber-400 to-yellow-500 shadow-glow-indigo' :
                    b.badge.rarity === 'EPIC' ? 'bg-gradient-to-br from-violet-500 to-purple-600' :
                    b.badge.rarity === 'RARE' ? 'bg-gradient-to-br from-blue-500 to-indigo-600' :
                    'bg-gradient-to-br from-slate-400 to-slate-500'
                  }`}>
                    ⭐
                  </div>
                  <h4 className="font-medium text-sm text-slate-900 dark:text-white mb-1">{b.badge.name}</h4>
                  <Badge variant={b.badge.rarity.toLowerCase() as 'common' | 'rare' | 'epic' | 'legendary'} size="sm">{b.badge.rarity}</Badge>
                  <p className="text-xs text-slate-400 mt-2">{timeAgo(b.earnedAt)}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
