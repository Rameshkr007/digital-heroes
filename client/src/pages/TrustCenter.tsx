import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Dices, Heart, FileCheck, Target, Award, ArrowRight } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export default function TrustCenter() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-24 pb-16 bg-slate-50 dark:bg-navy-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="primary" className="mx-auto">Section 20 • Trust & Transparency Center</Badge>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            100% Verifiable & <span className="gradient-text">Transparent Rules</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Digital Heroes is engineered around complete transparency—from cryptographically seedable draw algorithms to verified 80G charity contributions.
          </p>
        </div>

        {/* 4 Pillars of Trust */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card padding="md" className="border-indigo-500/30">
            <Target size={28} className="text-indigo-400 mb-3" />
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">Score Verification</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Automatic Stableford point validation and statistical 5-score rolling average outlier anomaly detection.
            </p>
          </Card>

          <Card padding="md" className="border-emerald-500/30">
            <Dices size={28} className="text-emerald-400 mb-3" />
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">Draw Transparency</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Open algorithm modes (Random, Weighted, Hybrid) with seedable Admin Draw Simulator Lab audit logs.
            </p>
          </Card>

          <Card padding="md" className="border-amber-500/30">
            <Heart size={28} className="text-amber-400 mb-3" />
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">Charity Calculations</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              100% of charity allocations are distributed to official 80G certified partner foundations.
            </p>
          </Card>

          <Card padding="md" className="border-cyan-500/30">
            <Lock size={28} className="text-cyan-400 mb-3" />
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">Data Security & Privacy</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Bank-grade JWT authentication, bcrypt password hashing, RBAC permissions, and comprehensive audit trails.
            </p>
          </Card>
        </div>

        {/* Detailed Explanation Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card padding="lg" className="space-y-4">
            <h3 className="font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
              <FileCheck className="text-indigo-500" size={22} /> Winner Verification Pipeline 2.0
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Every monthly draw winner undergoes a mandatory 4-step verification process before payouts are disbursed:
            </p>
            <ol className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <span className="font-mono font-bold text-indigo-400">01.</span>
                <span>**Winner Selected:** Selected via seedable hybrid transparent algorithm.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-mono font-bold text-indigo-400">02.</span>
                <span>**Proof Upload:** Winner submits official identity and handicap proof document.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-mono font-bold text-indigo-400">03.</span>
                <span>**Admin Review:** Admin team verifies document authenticity against checklist.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-mono font-bold text-indigo-400">04.</span>
                <span>**Payout Disbursed:** Funds transferred and audit trail event permanently recorded.</span>
              </li>
            </ol>
          </Card>

          <Card padding="lg" className="space-y-4">
            <h3 className="font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="text-emerald-500" size={22} /> Security & Anomaly Guardrails
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Our Risk Monitor system dynamically reviews golf score entries for anomalies without unfair auto-rejections:
            </p>
            <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>**NORMAL:** Score within standard deviation of 5-score rolling average.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>**REVIEW:** Flagged for manual admin verification due to sudden stroke variance.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span>**SUSPICIOUS:** Multiple rapid submissions detected; queued for investigation.</span>
              </li>
            </ul>
          </Card>
        </div>

        <div className="text-center pt-4">
          <Button size="lg" onClick={() => navigate('/draw-engine')} rightIcon={<ArrowRight size={16} />}>
            Explore Draw Engine & Simulator Lab
          </Button>
        </div>
      </div>
    </div>
  );
}
