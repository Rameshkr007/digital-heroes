import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Search, Filter, MapPin, CheckCircle2, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { charityService, CharityItem } from '../services/charity';

export default function CharityExplorer() {
  const [loading, setLoading] = useState(true);
  const [charities, setCharities] = useState<CharityItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  useEffect(() => {
    charityService
      .getImpactMap()
      .then((data) => setCharities(data.charities))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = ['ALL', 'Hunger & Education', 'Environment', 'Education', 'Global Relief'];

  const filteredCharities = charities.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || c.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen pt-24 pb-16 bg-slate-50 dark:bg-navy-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Badge variant="success" className="mb-2">Section 9 • Premium Charity Discovery</Badge>
            <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <Heart className="text-rose-500" size={32} /> Charity Impact Explorer
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Discover verified non-profit partners powering real-world hunger relief, reforestation, and STEM literacy.
            </p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <Card padding="md" className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by charity name, city or mission..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${selectedCategory === cat ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-navy-900 text-slate-400 hover:text-white'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </Card>

        {/* Charity Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCharities.map((c) => (
            <Card key={c.id} padding="lg" hover className="flex flex-col justify-between border-indigo-500/20">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="success">{c.category}</Badge>
                  <span className="text-xs text-indigo-400 font-bold flex items-center gap-1">
                    <ShieldCheck size={14} /> Verified 80G
                  </span>
                </div>

                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{c.name}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1 mb-3">
                  <MapPin size={14} className="text-indigo-400" /> {c.location}
                </p>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                  {c.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-navy-800 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Total Funds Distributed:</span>
                  <span className="font-bold text-emerald-400">₹{c.totalRaised.toLocaleString()}</span>
                </div>
                {c.mealsProvided > 0 && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Meals Funded:</span>
                    <span className="font-bold text-amber-400">{c.mealsProvided.toLocaleString()} 🍲</span>
                  </div>
                )}
                {c.treesPlanted > 0 && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Trees Planted:</span>
                    <span className="font-bold text-green-400">{c.treesPlanted.toLocaleString()} 🌳</span>
                  </div>
                )}
                <Button className="w-full mt-4 gap-2" size="sm" variant="secondary" rightIcon={<ArrowUpRight size={14} />}>
                  Inspect Impact Records
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
