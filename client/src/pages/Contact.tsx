import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setSent(true);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <Badge variant="primary" className="mb-4">Get in Touch</Badge>
          <h1 className="font-display text-5xl font-bold text-slate-900 dark:text-white mb-4">Contact <span className="gradient-text">Us</span></h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto">Have a question, idea, or just want to say hello? We'd love to hear from you.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-4">
            {[{ icon: <Mail size={20} className="text-indigo-500" />, title: 'Email', value: 'hello@digitalhero.dev' }, { icon: <MessageSquare size={20} className="text-violet-500" />, title: 'Response Time', value: 'Within 24 hours' }].map((item) => (
              <div key={item.title} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-navy-900/60 border border-slate-200 dark:border-navy-700">
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-navy-800 flex items-center justify-center shrink-0 shadow-sm">{item.icon}</div>
                <div><p className="text-xs text-slate-500">{item.title}</p><p className="font-medium text-slate-900 dark:text-white text-sm">{item.value}</p></div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-2">
            {sent ? (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-12 text-center">
                <CheckCircle2 size={48} className="text-emerald-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Message sent!</h3>
                <p className="text-slate-600 dark:text-slate-400">We'll get back to you within 24 hours.</p>
                <Button className="mt-6" onClick={() => setSent(false)} variant="outline">Send Another</Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Name" placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                  <Input label="Email" type="email" placeholder="your@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                </div>
                <Input label="Subject" placeholder="What's this about?" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Message <span className="text-rose-500">*</span></label>
                  <textarea
                    rows={5}
                    placeholder="Your message..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-900/60 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all text-sm resize-none"
                  />
                </div>
                <Button type="submit" size="lg" className="w-full" isLoading={loading} leftIcon={<Send size={16} />}>Send Message</Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
