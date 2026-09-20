import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Github, Twitter, Linkedin, Heart } from 'lucide-react';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-950 mt-24" aria-label="Footer">
      <div className="aurora-bg absolute inset-0 opacity-30 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                <Star size={16} className="text-white" fill="white" />
              </div>
              <span className="font-display font-bold text-slate-900 dark:text-white text-lg">Digital<span className="gradient-text">Heroes</span></span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">A platform celebrating the builders, innovators, and leaders shaping the digital future. Every hero has a story worth telling.</p>
            <div className="flex gap-3 mt-5">
              {[{ icon: <Github size={16} />, label: 'GitHub' }, { icon: <Twitter size={16} />, label: 'Twitter' }, { icon: <Linkedin size={16} />, label: 'LinkedIn' }].map((s) => (
                <a key={s.label} href="#" aria-label={s.label} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors">{s.icon}</a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Platform</h4>
            <nav className="flex flex-col gap-2.5">
              {[['/', 'Home'], ['/explore', 'Explore'], ['/heroes', 'Heroes'], ['/achievements', 'Achievements']].map(([href, label]) => (
                <Link key={href} to={href} className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{label}</Link>
              ))}
            </nav>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Company</h4>
            <nav className="flex flex-col gap-2.5">
              {[['/about', 'About'], ['/contact', 'Contact'], ['#', 'Privacy Policy'], ['#', 'Terms of Service']].map(([href, label]) => (
                <Link key={label} to={href} className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{label}</Link>
              ))}
            </nav>
          </div>
        </div>
        <div className="pt-8 border-t border-slate-100 dark:border-navy-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400 dark:text-slate-500">© {year} Digital Heroes. All rights reserved.</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">Built with <Heart size={10} className="text-rose-400" fill="currentColor" /> for digital innovators.</p>
        </div>
      </div>
    </footer>
  );
}
