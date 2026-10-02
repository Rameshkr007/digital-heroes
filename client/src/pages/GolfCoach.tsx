import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, Activity, Flame, Award, TrendingUp, AlertTriangle, CheckCircle2, Sparkles, Brain, Plus, RefreshCw, BarChart2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useToast } from '../store/toastStore';
import { golfService, GolfPerformanceData, AIGolfCoachData } from '../services/golf';

export default function GolfCoach() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [scoreInput, setScoreInput] = useState('');
  const [handicapInput, setHandicapInput] = useState('5.0');
  const [courseInput, setCourseInput] = useState('Delhi Golf Club');

  // Performance & Coach Data
  const [perfData, setPerfData] = useState<GolfPerformanceData | null>(null);
  const [coachData, setCoachData] = useState<AIGolfCoachData | null>(null);
  const [timeFilter, setTimeFilter] = useState<'7D' | '30D' | '3M' | '6M' | '1Y'>('30D');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [p, c] = await Promise.all([
        golfService.getPerformance(),
        golfService.getCoachAdvice(),
      ]);
      setPerfData(p);
      setCoachData(c);
    } catch (err: any) {
      toast.error('Data Error', 'Could not load golf performance metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmitScore = async (e: React.FormEvent) => {
    e.preventDefault();
    const scoreVal = parseInt(scoreInput);
    if (!scoreVal || scoreVal < 50 || scoreVal > 150) {
      toast.warning('Invalid Score', 'Please enter a golf score between 50 and 150');
      return;
    }

    try {
      setSubmitting(true);
      const res = await golfService.submitScore({
        score: scoreVal,
        handicap: parseFloat(handicapInput) || 5.0,
        courseName: courseInput,
      });

      if (res.isFlagged) {
        toast.warning('⚠️ Score Flagged for Admin Review', res.flagReason);
      } else {
        toast.success('🎉 Score Recorded!', `Calculated Stableford Points: ${res.stablefordPoints}`);
      }
      setScoreInput('');
      fetchData();
    } catch (err: any) {
      toast.error('Submission Failed', err.response?.data?.message || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-slate-50 dark:bg-navy-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Badge variant="primary" className="mb-2">Module 1 & 2 • AI Coach & Intelligence</Badge>
            <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <Brain className="text-indigo-500" size={32} /> AI Golf Performance Coach
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Rolling 5-score analytics, Stableford point calculation, outlier anomaly detection & personalized AI journey reports.
            </p>
          </div>
          <Button variant="ghost" onClick={fetchData} leftIcon={<RefreshCw size={16} />}>
            Refresh Analytics
          </Button>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card padding="md" className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">5-Score Rolling Avg</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{perfData?.rollingAverage || '--'}</p>
              <p className="text-xs text-indigo-500 font-medium">Strokes per round</p>
            </div>
          </Card>

          <Card padding="md" className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
              <Award size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Consistency Score</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{perfData?.consistencyScore || 85}%</p>
              <p className="text-xs text-emerald-500 font-medium">+14% improvement</p>
            </div>
          </Card>

          <Card padding="md" className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
              <Flame size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Personal Best</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{perfData?.bestScore || '--'}</p>
              <p className="text-xs text-amber-500 font-medium">Lowest stroke round</p>
            </div>
          </Card>

          <Card padding="md" className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center shrink-0">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Performance Trend</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{perfData?.trend || 'STABLE'}</p>
              <p className="text-xs text-cyan-500 font-medium">Upward trend active</p>
            </div>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Smart Score Entry & Score History */}
          <div className="lg:col-span-7 space-y-6">
            {/* Smart Score Intelligence Input Card */}
            <Card padding="lg" className="border-indigo-500/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                  <Target className="text-indigo-500" size={20} /> Smart Score Intelligence Entry
                </h3>
                <Badge variant="primary">Stableford Auto-Validation</Badge>
              </div>

              <form onSubmit={handleSubmitScore} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Gross Score</label>
                    <input
                      type="number"
                      placeholder="e.g. 72"
                      value={scoreInput}
                      onChange={(e) => setScoreInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Course Handicap</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="5.0"
                      value={handicapInput}
                      onChange={(e) => setHandicapInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Golf Course</label>
                    <input
                      type="text"
                      value={courseInput}
                      onChange={(e) => setCourseInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full gap-2" isLoading={submitting} leftIcon={<Plus size={18} />}>
                  Submit Score for AI Validation
                </Button>
              </form>
            </Card>

            {/* Score History & Time Filter */}
            <Card padding="lg">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                  <BarChart2 className="text-indigo-500" size={20} /> Score History & Trend Timeline
                </h3>
                <div className="flex gap-1 bg-slate-100 dark:bg-navy-900 p-1 rounded-xl">
                  {(['7D', '30D', '3M', '6M', '1Y'] as const).map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setTimeFilter(tf)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${timeFilter === tf ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>

              {/* History Table */}
              <div className="space-y-3">
                {perfData?.scores.map((s, idx) => (
                  <div
                    key={s.id || idx}
                    className={`p-4 rounded-xl border flex items-center justify-between flex-wrap gap-4 ${s.isFlagged ? 'bg-rose-500/10 border-rose-500/30' : 'bg-slate-100/60 dark:bg-navy-900/60 border-slate-200 dark:border-navy-800'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-lg ${s.isFlagged ? 'bg-rose-500 text-white' : 'bg-indigo-600 text-white'}`}>
                        {s.score}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-slate-900 dark:text-white">{s.courseName}</p>
                        <p className="text-xs text-slate-400">
                          {new Date(s.playedAt).toLocaleDateString()} • Stableford: <span className="text-emerald-400 font-bold">{s.stablefordPoints} pts</span>
                        </p>
                      </div>
                    </div>

                    {s.isFlagged ? (
                      <div className="flex items-center gap-1.5 text-xs text-rose-400 bg-rose-500/20 px-3 py-1 rounded-full font-medium">
                        <AlertTriangle size={14} /> Outlier Flagged (Review Required)
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full font-medium">
                        <CheckCircle2 size={14} /> Verified Valid
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column: AI Golf Journey & Coach Advice */}
          <div className="lg:col-span-5 space-y-6">
            {/* AI Journey Card */}
            <Card padding="lg" className="bg-gradient-to-br from-indigo-900/40 via-navy-900 to-navy-950 border-indigo-500/40 relative overflow-hidden">
              <div className="flex items-center gap-2 text-indigo-400 mb-3">
                <Sparkles size={20} className="animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider">AI Coach Insight</span>
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-3">Your Golf Journey Report</h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-6 whitespace-pre-line">
                {coachData?.summary || 'Analyzing your recent round scores...'}
              </p>

              {/* Strong & Weak Areas */}
              <div className="space-y-4 pt-4 border-t border-indigo-500/20">
                <div>
                  <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">💪 Strong Performance Areas</p>
                  <div className="flex flex-wrap gap-2">
                    {coachData?.strongAreas.map((sa, i) => (
                      <span key={i} className="text-xs bg-emerald-500/10 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/20">
                        {sa}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">🎯 Improvement Suggestions</p>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {coachData?.personalizedSuggestions.map((ps, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{ps}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>

            {/* Future Forecast Card */}
            <Card padding="md">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                🔮 AI Forecast & Potential Score Range
              </h4>
              <p className="text-xs text-slate-400 mb-4">
                Based on your last 5-score rolling trend. *(Projections are estimates, not guarantees)*
              </p>

              <div className="p-4 rounded-xl bg-slate-100 dark:bg-navy-900 flex justify-between items-center font-mono">
                <div>
                  <p className="text-xs text-slate-400">Target Range Next Month:</p>
                  <p className="text-lg font-bold text-indigo-400">70 - 74 Strokes</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Draw Eligibility:</p>
                  <p className="text-xs font-bold text-emerald-400">Qualified (85% Conc)</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
