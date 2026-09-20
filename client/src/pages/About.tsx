import React from 'react';
import { motion } from 'framer-motion';
import { Star, Zap, Users, Trophy, Heart, Code2 } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function About() {
  const valuesRef = useScrollReveal();
  const teamRef = useScrollReveal();

  const values = [
    { icon: <Heart size={24} className="text-rose-500" />, title: 'Human-Centered', desc: 'Every feature is designed with real people in mind.' },
    { icon: <Zap size={24} className="text-amber-500" />, title: 'Impact-Driven', desc: 'We measure success by the positive change heroes create.' },
    { icon: <Users size={24} className="text-indigo-500" />, title: 'Community First', desc: 'The community is at the heart of everything we build.' },
    { icon: <Code2 size={24} className="text-emerald-500" />, title: 'Craft Excellence', desc: 'We believe in building with care, precision, and pride.' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="aurora-bg absolute inset-0" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Badge variant="primary" className="mb-4">Our Story</Badge>
            <h1 className="font-display text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Building the future of <span className="gradient-text">digital recognition</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
              Digital Heroes was born from a simple belief: the people building our digital world deserve to be seen, celebrated, and connected.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-white dark:bg-navy-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -32 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <h2 className="font-display text-4xl font-bold text-slate-900 dark:text-white mb-6">Our Mission</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                We're on a mission to create a world where every developer, designer, and digital innovator has a place to showcase their journey, achievements, and impact.
              </p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Too often, the work of talented individuals goes unrecognized. Digital Heroes changes that — by creating a community where effort, growth, and impact are measured and celebrated.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
              className="relative">
              <div className="rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-700 p-10 text-white text-center shadow-glow-indigo">
                <Star size={48} className="mx-auto mb-4 text-indigo-100" fill="currentColor" />
                <p className="text-2xl font-bold font-display mb-2">"Every hero has a story worth telling."</p>
                <p className="text-indigo-200 text-sm">The Digital Heroes Manifesto</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section ref={valuesRef.ref as React.RefObject<HTMLElement>} className="py-20 bg-slate-50 dark:bg-navy-900/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={valuesRef.isVisible ? { opacity: 1, y: 0 } : {}} className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold text-slate-900 dark:text-white">Our <span className="gradient-text">Values</span></h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((v, i) => (
              <motion.div key={v.title} initial={{ opacity: 0, y: 24 }} animate={valuesRef.isVisible ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.1 }}>
                <Card hover padding="lg">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-navy-800 flex items-center justify-center mb-4">{v.icon}</div>
                  <h3 className="font-display text-xl font-semibold text-slate-900 dark:text-white mb-2">{v.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400">{v.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
