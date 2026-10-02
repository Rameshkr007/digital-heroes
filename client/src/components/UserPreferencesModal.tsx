import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, Shield, Trash2, CheckCircle2, RefreshCw } from 'lucide-react';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { useToast } from '../store/toastStore';
import { level3Service, UserPreferences } from '../services/level3';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserPreferencesModal({ isOpen, onClose }: ModalProps) {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [prefs, setPrefs] = useState<UserPreferences | null>(null);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      level3Service
        .getPreferences()
        .then(setPrefs)
        .catch(() => {
          setPrefs({
            dashboardLayout: 'ADAPTIVE',
            emailNotifs: true,
            inAppNotifs: true,
            preferredCharity: 'Akshaya Patra Midday Meals',
            isPublicProfile: true,
            aiMemory: { preferredView: 'Performance Overview', theme: 'dark' },
          });
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  const handleSave = async () => {
    if (!prefs) return;
    try {
      setSaving(true);
      await level3Service.updatePreferences(prefs);
      toast.success('Preferences Saved', 'Your privacy & AI memory settings were updated.');
      onClose();
    } catch (err: any) {
      toast.error('Error', 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleClearMemory = async () => {
    try {
      await level3Service.clearMemory();
      toast.info('AI Memory Cleared', 'Personalized assistant memory has been wiped.');
      setPrefs((prev) => (prev ? { ...prev, aiMemory: {} } : null));
    } catch (err) {
      toast.error('Error', 'Failed to clear AI memory');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-lg bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-700 shadow-2xl overflow-hidden z-10 p-6 space-y-6"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-navy-800 pb-4">
              <div className="flex items-center gap-2">
                <Settings className="text-indigo-500" size={22} />
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">AI Memory & Privacy Settings</h3>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
                <X size={20} />
              </button>
            </div>

            {loading ? (
              <div className="py-8 text-center text-slate-400 flex items-center justify-center gap-2">
                <RefreshCw size={18} className="animate-spin" /> Loading preferences...
              </div>
            ) : prefs ? (
              <div className="space-y-6">
                {/* Toggles */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">Adaptive Dashboard</p>
                      <p className="text-xs text-slate-400">Layout adapts dynamically based on your progress.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={prefs.dashboardLayout === 'ADAPTIVE'}
                      onChange={(e) =>
                        setPrefs({ ...prefs, dashboardLayout: e.target.checked ? 'ADAPTIVE' : 'STANDARD' })
                      }
                      className="w-4 h-4 accent-indigo-600 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">Public Achievement Profile</p>
                      <p className="text-xs text-slate-400">Allow community to view non-sensitive achievements.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={prefs.isPublicProfile}
                      onChange={(e) => setPrefs({ ...prefs, isPublicProfile: e.target.checked })}
                      className="w-4 h-4 accent-indigo-600 rounded"
                    />
                  </div>
                </div>

                {/* AI Memory View & Clear Section */}
                <div className="p-4 rounded-xl bg-slate-100 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-indigo-400 font-bold text-xs">
                      <Shield size={14} /> AI Personalization Memory Store
                    </div>
                    <Button variant="danger" size="sm" onClick={handleClearMemory} leftIcon={<Trash2 size={12} />}>
                      Clear AI Memory
                    </Button>
                  </div>
                  <pre className="text-[11px] font-mono text-slate-600 dark:text-slate-300 bg-white dark:bg-navy-900 p-3 rounded-lg overflow-x-auto max-h-32">
                    {JSON.stringify(prefs.aiMemory, null, 2)}
                  </pre>
                  <p className="text-[10px] text-slate-400">
                    No financial, password, or sensitive contact data is stored in AI memory.
                  </p>
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-3 pt-2">
                  <Button variant="ghost" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} isLoading={saving} leftIcon={<CheckCircle2 size={16} />}>
                    Save Settings
                  </Button>
                </div>
              </div>
            ) : null}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
