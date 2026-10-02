import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, ArrowRight, HelpCircle, Shield } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { level4Service, RecommendationItem } from '../services/level4';
import { useNavigate } from 'react-router-dom';

export function RecommendationEngine() {
  const navigate = useNavigate();
  const [recs, setRecs] = useState<RecommendationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecs = () => {
    level4Service
      .getRecommendations()
      .then(setRecs)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRecs();
  }, []);

  const handleDismiss = async (id: string) => {
    setRecs((prev) => prev.filter((r) => r.id !== id));
    try {
      await level4Service.dismissRecommendation(id);
    } catch {
      // ignore
    }
  };

  if (loading || recs.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Badge variant="primary" className="gap-1">
          <Sparkles size={14} /> Autonomous Intelligence Engine • Self-Improving Recommendations
        </Badge>
      </div>

      <AnimatePresence>
        {recs.map((rec) => (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <Card padding="md" className="border-indigo-500/30 bg-gradient-to-r from-indigo-900/20 to-navy-900 relative">
              <button
                onClick={() => handleDismiss(rec.id)}
                className="absolute top-3 right-3 text-slate-400 hover:text-slate-200 p-1"
                aria-label="Dismiss recommendation"
              >
                <X size={16} />
              </button>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pr-6">
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{rec.title}</h4>
                    <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-mono px-2 py-0.5 rounded">
                      {Math.round(rec.confidence * 100)}% Confidence
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{rec.description}</p>
                  <div className="flex items-center gap-3 text-[11px] text-indigo-300 font-medium pt-1">
                    <span className="flex items-center gap-1">
                      <HelpCircle size={12} /> Why am I seeing this? {rec.reason}
                    </span>
                    <span className="text-slate-500">•</span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <Shield size={12} /> Source: {rec.dataSource}
                    </span>
                  </div>
                </div>

                {rec.actionUrl && (
                  <Button
                    size="sm"
                    onClick={() => navigate(rec.actionUrl)}
                    rightIcon={<ArrowRight size={14} />}
                    className="shrink-0"
                  >
                    {rec.ctaText}
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
