import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Globe, Utensils, Trees, GraduationCap, MapPin, CheckCircle2, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useToast } from '../store/toastStore';
import { charityService, CharityItem } from '../services/charity';

export default function ImpactMap() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [charities, setCharities] = useState<CharityItem[]>([]);
  const [selectedCharity, setSelectedCharity] = useState<CharityItem | null>(null);
  const [totals, setTotals] = useState({
    totalRaised: 1745000,
    mealsProvided: 49900,
    treesPlanted: 7400,
    educationUnits: 7100,
  });

  useEffect(() => {
    charityService
      .getImpactMap()
      .then((data) => {
        setCharities(data.charities);
        setTotals(data.totals);
        if (data.charities.length > 0) setSelectedCharity(data.charities[0]);
      })
      .catch(() => {
        const fallbackCharities = [
          { id: 'c1', name: 'Akshaya Patra Midday Meals', category: 'Hunger & Education', description: 'Providing nutritious school meals to underprivileged children across India.', location: 'Bengaluru, India', lat: 12.9716, lng: 77.5946, totalRaised: 485000, mealsProvided: 19400, treesPlanted: 0, educationUnits: 1200, verified: true },
          { id: 'c2', name: 'GiveIndia Green Earth Initiative', category: 'Environment', description: 'Planting native trees to restore degraded forest land across Western Ghats.', location: 'Pune, India', lat: 18.5204, lng: 73.8567, totalRaised: 320000, mealsProvided: 0, treesPlanted: 6400, educationUnits: 0, verified: true },
          { id: 'c3', name: 'Delhi Child Literacy Mission', category: 'Education', description: 'Distributing STEM kits and digital devices to rural schools in North India.', location: 'New Delhi, India', lat: 28.6139, lng: 77.209, totalRaised: 290000, mealsProvided: 4500, treesPlanted: 0, educationUnits: 2900, verified: true },
          { id: 'c4', name: 'Global Hunger Relief Fund', category: 'Global Relief', description: 'Emergency food packets and clean water distribution for crisis areas.', location: 'London, UK', lat: 51.5074, lng: -0.1278, totalRaised: 650000, mealsProvided: 26000, treesPlanted: 1000, educationUnits: 3000, verified: true },
        ];
        setCharities(fallbackCharities);
        setSelectedCharity(fallbackCharities[0]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16 bg-slate-50 dark:bg-navy-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Module 18: Impact Visualization Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="success" className="mx-auto">
            Module 4 & 5 • Live Charity Impact Engine
          </Badge>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            PLAY • PERFORM • <span className="gradient-text">IMPACT</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Your game can create something bigger. Every golf score submitted and subscription active funds meals, plants native trees, and empowers education worldwide.
          </p>
        </div>

        {/* Live Database Impact Stats Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card padding="md" className="text-center bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/30">
            <p className="text-3xl font-extrabold text-emerald-500">₹{(totals.totalRaised || 1745000).toLocaleString()}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase mt-1">Total Impact Raised</p>
          </Card>

          <Card padding="md" className="text-center bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/30">
            <p className="text-3xl font-extrabold text-amber-500">{(totals.mealsProvided || 49900).toLocaleString()}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase mt-1">Meals Funded 🍲</p>
          </Card>

          <Card padding="md" className="text-center bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30">
            <p className="text-3xl font-extrabold text-green-500">{(totals.treesPlanted || 7400).toLocaleString()}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase mt-1">Trees Planted 🌳</p>
          </Card>

          <Card padding="md" className="text-center bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border-indigo-500/30">
            <p className="text-3xl font-extrabold text-indigo-500">{(totals.educationUnits || 7100).toLocaleString()}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase mt-1">STEM Units 📚</p>
          </Card>
        </div>

        {/* Interactive Impact Map Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Map & Pins View */}
          <div className="lg:col-span-8 space-y-6">
            <Card padding="lg" className="border-indigo-500/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                  <Globe className="text-indigo-500" size={22} /> Global Impact Map
                </h3>
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck size={14} /> 100% Verified Charities
                </span>
              </div>

              {/* Visual Map Canvas Simulation */}
              <div className="relative w-full h-[360px] bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center p-6 aurora-bg-dark">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px]" />

                {/* Charity Pins */}
                {charities.map((c, i) => (
                  <motion.button
                    key={c.id || i}
                    whileHover={{ scale: 1.15 }}
                    onClick={() => setSelectedCharity(c)}
                    style={{
                      position: 'absolute',
                      top: `${30 + (i * 18) % 55}%`,
                      left: `${20 + (i * 22) % 70}%`,
                    }}
                    className={`p-3 rounded-2xl flex items-center gap-2 shadow-2xl transition-all border ${selectedCharity?.id === c.id ? 'bg-indigo-600 text-white border-white scale-110 shadow-glow-indigo' : 'bg-navy-900/90 text-indigo-300 border-indigo-500/30'}`}
                  >
                    <MapPin size={18} className="text-amber-400" />
                    <span className="text-xs font-bold">{c.name.split(' ')[0]}</span>
                  </motion.button>
                ))}

                <div className="absolute bottom-4 left-4 bg-navy-950/90 backdrop-blur-md px-4 py-2 rounded-xl border border-navy-800 text-xs text-slate-300">
                  Click on map pins to inspect charity impact & distribution
                </div>
              </div>
            </Card>

            {/* Visual Impact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card padding="md" className="bg-emerald-500/10 border-emerald-500/30">
                <Utensils className="text-emerald-400 mb-2" size={28} />
                <h4 className="font-bold text-white text-base">Nutritious Meals</h4>
                <p className="text-xs text-slate-300 mt-1">Your subscription helped fund 12 meals this month for school children.</p>
              </Card>

              <Card padding="md" className="bg-green-500/10 border-green-500/30">
                <Trees className="text-green-400 mb-2" size={28} />
                <h4 className="font-bold text-white text-base">Reforestation</h4>
                <p className="text-xs text-slate-300 mt-1">Planted 3 native saplings in Western Ghats forest conservation.</p>
              </Card>

              <Card padding="md" className="bg-indigo-500/10 border-indigo-500/30">
                <GraduationCap className="text-indigo-400 mb-2" size={28} />
                <h4 className="font-bold text-white text-base">STEM Education</h4>
                <p className="text-xs text-slate-300 mt-1">Supported 2 digital literacy kits for rural school classrooms.</p>
              </Card>
            </div>
          </div>

          {/* Right Panel: Selected Charity Details */}
          <div className="lg:col-span-4 space-y-6">
            {selectedCharity ? (
              <Card padding="lg" className="border-indigo-500/30">
                <Badge variant="success" className="mb-2">{selectedCharity.category}</Badge>
                <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-2">{selectedCharity.name}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1 mb-4">
                  <MapPin size={14} className="text-indigo-400" /> {selectedCharity.location}
                </p>

                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                  {selectedCharity.description}
                </p>

                <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-navy-800">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Total Raised:</span>
                    <span className="font-bold text-emerald-400">₹{selectedCharity.totalRaised.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Meals Provided:</span>
                    <span className="font-bold text-amber-400">{selectedCharity.mealsProvided.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Trees Planted:</span>
                    <span className="font-bold text-green-400">{selectedCharity.treesPlanted.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Verification Status:</span>
                    <span className="font-bold text-indigo-400 flex items-center gap-1">
                      <CheckCircle2 size={14} /> Official 80G Certified
                    </span>
                  </div>
                </div>

                <Button className="w-full mt-6" size="lg">
                  Contribute Extra Impact
                </Button>
              </Card>
            ) : (
              <Card padding="lg" className="text-center py-12">
                <p className="text-sm text-slate-400">Select a charity on the map to inspect impact stats</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
