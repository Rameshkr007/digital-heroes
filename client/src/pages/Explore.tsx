import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Users, Trophy, TrendingUp, Zap, MapPin, ChevronDown, X } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Card } from '../components/ui/Card';
import { ProgressRing } from '../components/ui/ProgressRing';
import { HeroCardSkeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { Tabs } from '../components/ui/Tabs';
import { heroesService, HeroCard } from '../services/heroes';
import { useDebounce } from '../hooks/useDebounce';
import { getLevelTitle, formatNumber } from '../utils/helpers';

const sortOptions = [
  { id: 'xp', label: 'Most XP' },
  { id: 'level', label: 'Highest Level' },
  { id: 'achievements', label: 'Most Achievements' },
  { id: 'impact', label: 'Most Impact' },
  { id: 'newest', label: 'Newest' },
];

const skillFilters = ['React', 'Python', 'Design', 'ML', 'DevOps', 'Blockchain', 'Mobile', 'Security'];

export default function Explore() {
  const navigate = useNavigate();
  const [heroes, setHeroes] = useState<HeroCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('xp');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const debouncedSearch = useDebounce(search, 400);

  const fetchHeroes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await heroesService.getHeroes({
        search: debouncedSearch || undefined,
        sortBy,
        skill: selectedSkill || undefined,
        page,
        limit: 12,
      });
      setHeroes(res.heroes);
      setTotal(res.pagination.total);
      setTotalPages(res.pagination.totalPages);
    } catch {
      setHeroes([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, sortBy, selectedSkill, page]);

  useEffect(() => { fetchHeroes(); }, [fetchHeroes]);
  useEffect(() => { setPage(1); }, [debouncedSearch, sortBy, selectedSkill]);

  const clearFilters = () => { setSearch(''); setSortBy('xp'); setSelectedSkill(''); setPage(1); };
  const hasFilters = search || sortBy !== 'xp' || selectedSkill;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <Badge variant="primary" className="mb-3">Explore</Badge>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-3">
            Find Your <span className="gradient-text">Inspiration</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
            Browse and discover heroes across all disciplines and expertise.
          </p>
        </motion.div>

        {/* Search + Filters */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search heroes by name, title, or expertise..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftElement={<Search size={16} />}
                rightElement={search ? <button onClick={() => setSearch('')}><X size={14} /></button> : undefined}
              />
            </div>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-4 pr-8 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-900/60 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 appearance-none cursor-pointer"
              >
                {sortOptions.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Skill filters */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1"><Filter size={14} /> Filter by skill:</span>
            {skillFilters.map((skill) => (
              <button key={skill} onClick={() => setSelectedSkill(selectedSkill === skill ? '' : skill)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${selectedSkill === skill ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'}`}>
                {skill}
              </button>
            ))}
            {hasFilters && (
              <button onClick={clearFilters} className="px-3 py-1 rounded-full text-xs font-medium text-rose-500 bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 transition-colors flex items-center gap-1">
                <X size={10} /> Clear all
              </button>
            )}
          </div>
        </motion.div>

        {/* Results grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => <HeroCardSkeleton key={i} />)}
          </div>
        ) : heroes.length === 0 ? (
          <EmptyState
            icon={<Users size={32} />}
            title="No heroes found"
            description={search || selectedSkill ? `No results for your current filters. Try adjusting your search or clearing filters.` : "No heroes exist yet. Be the first!"}
            action={{ label: 'Clear Filters', onClick: clearFilters }}
            secondaryAction={{ label: 'Become a Hero', onClick: () => navigate('/register') }}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {heroes.map((hero, i) => (
                <motion.div key={hero.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card hover padding="md" onClick={() => navigate(`/heroes/${hero.user.username}`)} className="group h-full">
                    <div className="flex items-start gap-4 mb-4">
                      <Avatar src={hero.avatarUrl} alt={hero.displayName} size="lg" level={hero.level} />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{hero.displayName}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{hero.title}</p>
                        {hero.location && (
                          <div className="flex items-center gap-1 mt-1">
                            <MapPin size={10} className="text-slate-400" />
                            <span className="text-xs text-slate-400">{hero.location}</span>
                          </div>
                        )}
                      </div>
                      <ProgressRing percentage={(hero.xp % 1000) / 10} size={44} strokeWidth={4} color="#6366f1">
                        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{hero.level}</span>
                      </ProgressRing>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4">{hero.bio}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {hero.skills?.slice(0, 3).map((s) => <Badge key={s.skill.name} variant="default" size="sm">{s.skill.name}</Badge>)}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1"><Trophy size={11} className="text-amber-400" />{hero._count?.achievements}</span>
                        <span className="flex items-center gap-1"><TrendingUp size={11} className="text-emerald-400" />{formatNumber(hero.totalImpact)}</span>
                      </div>
                    </div>
                    {hero.badges && hero.badges.length > 0 && (
                      <div className="flex gap-1 mt-3 pt-3 border-t border-slate-100 dark:border-navy-800">
                        {hero.badges.slice(0, 3).map((b) => (
                          <Badge key={b.badge.name} variant={b.badge.rarity.toLowerCase() as 'common' | 'rare' | 'epic' | 'legendary'} size="sm">{b.badge.name}</Badge>
                        ))}
                      </div>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <Button variant="secondary" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
                <span className="text-sm text-slate-600 dark:text-slate-400 px-4">Page {page} of {totalPages}</span>
                <Button variant="secondary" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
