import React, { useState, useEffect } from 'react';
import { Compass, Info, Sparkles } from 'lucide-react';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { level4Service, PredictiveInsightItem } from '../services/level4';

export function PredictiveInsights() {
  const [insights, setInsights] = useState<PredictiveInsightItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    level4Service
      .getPredictiveInsights()
      .then(setInsights)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading || insights.length === 0) return null;

  return (
    <Card padding="md" className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <Compass className="text-cyan-400" size={18} /> Predictive Insights & Potential Forecasts
        </h4>
        <Badge variant="primary" className="text-[10px]">
          Labeled Estimates (Non-Guaranteed)
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.map((item) => (
          <div key={item.id} className="p-3.5 rounded-xl bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-navy-800 space-y-2">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{item.metricName}</p>
            <p className="text-lg font-bold text-indigo-500 dark:text-indigo-400 font-mono">{item.estimate}</p>
            <div className="space-y-1 text-[11px] text-slate-400 border-t border-slate-200 dark:border-navy-800 pt-2">
              <p>📊 <strong>Basis:</strong> {item.basis}</p>
              <p className="text-slate-500 italic">⚠️ <strong>Limitations:</strong> {item.limitations}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
