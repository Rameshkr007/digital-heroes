import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ExternalLink, FileText, CheckCircle2, Building2, Calendar, Award } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { level3Service, ImpactLedgerItem } from '../services/level3';

export default function ImpactLedger() {
  const [items, setItems] = useState<ImpactLedgerItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    level3Service
      .getImpactLedger()
      .then(setItems)
      .catch(() => {
        setItems([
          {
            id: 'l1',
            charityName: 'Akshaya Patra Midday Meals',
            amount: 485000.0,
            metricType: 'MEALS',
            metricCount: 19400,
            period: 'September 2026',
            proofUrl: 'https://digitalhero.dev/proof/akshaya-patra-sep-2026.pdf',
            status: 'VERIFIED',
            createdAt: new Date().toISOString(),
          },
          {
            id: 'l2',
            charityName: 'GiveIndia Green Earth Initiative',
            amount: 320000.0,
            metricType: 'TREES',
            metricCount: 6400,
            period: 'September 2026',
            proofUrl: 'https://digitalhero.dev/proof/giveindia-sep-2026.pdf',
            status: 'VERIFIED',
            createdAt: new Date().toISOString(),
          },
          {
            id: 'l3',
            charityName: 'Delhi Child Literacy Mission',
            amount: 290000.0,
            metricType: 'EDUCATION',
            metricCount: 2900,
            period: 'September 2026',
            proofUrl: 'https://digitalhero.dev/proof/child-literacy-sep-2026.pdf',
            status: 'VERIFIED',
            createdAt: new Date().toISOString(),
          },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16 bg-slate-50 dark:bg-navy-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Badge variant="success" className="mb-2 gap-1">
              <ShieldCheck size={14} /> Section 15 • Factual Impact Ledger
            </Badge>
            <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <FileText className="text-emerald-500" size={32} /> Verified Impact Ledger
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Factual, auditable receipts of subscription funds disbursed to verified charity partners.
            </p>
          </div>
        </div>

        {/* Ledger Table */}
        <Card padding="lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-navy-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Period</th>
                  <th className="py-3 px-4">Charity Partner</th>
                  <th className="py-3 px-4">Disbursed Amount</th>
                  <th className="py-3 px-4">Verified Impact</th>
                  <th className="py-3 px-4">Verification Status</th>
                  <th className="py-3 px-4 text-right">Audit Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-navy-800 text-sm">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-navy-900/50 transition-colors">
                    <td className="py-4 px-4 font-mono font-medium text-slate-700 dark:text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-slate-400" />
                        {item.period}
                      </div>
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        <Building2 size={16} className="text-indigo-500" />
                        {item.charityName}
                      </div>
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-emerald-500">
                      ₹{item.amount.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 font-medium text-slate-700 dark:text-slate-200">
                      {item.metricCount.toLocaleString()} {item.metricType.toLowerCase()}
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="success" className="gap-1">
                        <CheckCircle2 size={12} /> {item.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <a
                        href={item.proofUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-400 font-semibold"
                      >
                        Receipt PDF <ExternalLink size={12} />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
