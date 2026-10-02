import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, ArrowRight, Sparkles, HelpCircle, Compass } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { UserJourneyData } from '../services/level3';

interface JourneyTimelineProps {
  journeyData: UserJourneyData | null;
  onActionClick?: (url: string) => void;
}

export function JourneyTimeline({ journeyData, onActionClick }: JourneyTimelineProps) {
  if (!journeyData) return null;

  return (
    <div className="space-y-6">
      {/* Smart Next Best Action Card */}
      <Card padding="lg" className="bg-gradient-to-br from-indigo-900/40 via-navy-900 to-navy-950 border-indigo-500/40 relative overflow-hidden">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
          <Badge variant="primary" className="gap-1">
            <Sparkles size={14} /> Smart Action Center
          </Badge>
          <span className="text-xs text-indigo-300 font-medium flex items-center gap-1">
            <HelpCircle size={12} /> Why am I seeing this recommendation?
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h3 className="font-display text-xl font-bold text-white">
              {journeyData.nextBestAction.title}
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {journeyData.nextBestAction.description}
            </p>
            <p className="text-xs text-indigo-300 font-medium italic">
              💡 Rationale: {journeyData.nextBestAction.reason}
            </p>
          </div>

          <Button
            size="lg"
            onClick={() => onActionClick && onActionClick(journeyData.nextBestAction.actionUrl)}
            rightIcon={<ArrowRight size={18} />}
            className="shrink-0"
          >
            {journeyData.nextBestAction.ctaText}
          </Button>
        </div>
      </Card>

      {/* Visual Timeline Card */}
      <Card padding="lg">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
          <div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Compass className="text-indigo-500" size={20} /> My Hero Journey Timeline
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Personalized milestone tracking from signup to legendary status.
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold text-slate-400">Overall Progress</span>
            <p className="text-lg font-bold text-indigo-500">{journeyData.progressPercentage}% Completed</p>
          </div>
        </div>

        {/* Timeline Grid */}
        <div className="relative border-l-2 border-slate-200 dark:border-navy-800 ml-4 space-y-6 pl-6 py-2">
          {journeyData.steps.map((step, idx) => (
            <div key={step.stepKey || idx} className="relative group">
              <div
                className={`absolute -left-[31px] top-1.5 w-6 h-6 rounded-full flex items-center justify-center ${
                  step.isDone
                    ? 'bg-emerald-500 text-white shadow-glow-sm'
                    : 'bg-slate-200 dark:bg-navy-800 text-slate-400'
                }`}
              >
                {step.isDone ? <CheckCircle2 size={16} /> : <Circle size={14} />}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl hover:bg-slate-100/50 dark:hover:bg-navy-900/50 transition-colors">
                <div>
                  <h4 className={`text-sm font-bold ${step.isDone ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}>
                    {step.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{step.description}</p>
                </div>

                {step.isDone ? (
                  <Badge variant="success" size="sm">Achieved</Badge>
                ) : (
                  <Badge variant="default" size="sm">Pending</Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
