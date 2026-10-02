import React, { useState, useEffect } from 'react';
import { AlertOctagon, CheckCircle2, ShieldAlert, Cpu } from 'lucide-react';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { level4Service, AdminQueueItem } from '../services/level4';
import { useToast } from '../store/toastStore';

export function AdminNeedsAttention() {
  const toast = useToast();
  const [queue, setQueue] = useState<AdminQueueItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQueue = () => {
    setLoading(true);
    level4Service
      .getAdminQueue()
      .then(setQueue)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleResolve = async (id: string) => {
    try {
      await level4Service.resolveAdminQueueItem(id);
      toast.success('Queue Item Resolved', 'Action recorded in audit log.');
      fetchQueue();
    } catch {
      toast.error('Error', 'Could not resolve queue item');
    }
  };

  return (
    <Card padding="lg" className="border-rose-500/30 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
          <AlertOctagon className="text-rose-500" size={22} /> "Needs Attention" Operational Queue
        </h3>
        <Badge variant={queue.length > 0 ? 'error' : 'success'}>
          {queue.length} Pending Action(s)
        </Badge>
      </div>

      <div className="space-y-3">
        {queue.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-400">
            <CheckCircle2 className="text-emerald-400 mx-auto mb-2" size={28} />
            No pending operational issues. System health is GREEN.
          </div>
        ) : (
          queue.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start justify-between flex-wrap gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant={item.severity === 'HIGH' ? 'error' : 'warning'}>
                    SEVERITY: {item.severity}
                  </Badge>
                  <span className="font-mono text-xs text-indigo-400 font-bold">[{item.module}]</span>
                </div>
                <p className="text-sm font-semibold text-white">{item.reason}</p>
                <p className="text-xs text-slate-400">💡 Recommended Action: {item.recommendedAction}</p>
              </div>

              <Button size="sm" onClick={() => handleResolve(item.id)} leftIcon={<CheckCircle2 size={14} />}>
                Mark Resolved
              </Button>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
