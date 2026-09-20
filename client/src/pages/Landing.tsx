import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Zap, Users, Trophy, TrendingUp, Star, Code2, Palette, Brain, Shield, Rocket, ChevronDown, Play, Github } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Card } from '../components/ui/Card';
import { ProgressRing } from '../components/ui/ProgressRing';
import { HeroCardSkeleton } from '../components/ui/Skeleton';
import { heroesService, HeroCard } from '../services/heroes';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { formatNumber, getLevelTitle } from '../utils/helpers';

// ==================== HeroCore Canvas Animation ====================
function HeroCore() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;
    let mx = 0, my = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    const unsubX = smoothX.on('change', (v) => { mx = v; });
    const unsubY = smoothY.on('change', (v) => { my = v; });

    const orbitals = [
      { angle: 0, radius: 110, size: 8, color: '#6366f1', speed: 0.008, label: 'Skills' },
      { angle: 1.2, radius: 130, size: 6, color: '#8b5cf6', speed: -0.006, label: 'Impact' },
      { angle: 2.4, radius: 120, size: 7, color: '#06b6d4', speed: 0.010, label: 'Growth' },
      { angle: 3.6, radius: 140, size: 5, color: '#a78bfa', speed: -0.007, label: 'Community' },
      { angle: 4.8, radius: 115, size: 9, color: '#22d3ee', speed: 0.009, label: 'Achievements' },
      { angle: 0.6, radius: 135, size: 6, color: '#818cf8', speed: -0.005, label: 'Progress' },
    ];

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const cx = w / 2 + mx * 0.03;
      const cy = h / 2 + my * 0.03;
      t += 0.016;

      ctx.clearRect(0, 0, w, h);

      // Outer glow ring
      const grd = ctx.createRadialGradient(cx, cy, 40, cx, cy, 160);
      grd.addColorStop(0, 'rgba(99,102,241,0.15)');
      grd.addColorStop(0.5, 'rgba(139,92,246,0.08)');
      grd.addColorStop(1, 'rgba(6,182,212,0)');
      ctx.beginPath();
      ctx.arc(cx, cy, 160, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();

      // Orbit rings
      [110, 130, 150].forEach((r, i) => {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(99,102,241,${0.08 - i * 0.02})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 8]);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Orbitals
      orbitals.forEach((orb) => {
        orb.angle += orb.speed;
        const ox = cx + Math.cos(orb.angle) * orb.radius;
        const oy = cy + Math.sin(orb.angle) * orb.radius;

        // Connection line
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(ox, oy);
        ctx.strokeStyle = `${orb.color}22`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Dot glow
        const dotGrd = ctx.createRadialGradient(ox, oy, 0, ox, oy, orb.size * 2);
        dotGrd.addColorStop(0, orb.color + 'cc');
        dotGrd.addColorStop(1, orb.color + '00');
        ctx.beginPath();
        ctx.arc(ox, oy, orb.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = dotGrd;
        ctx.fill();

        // Dot
        ctx.beginPath();
        ctx.arc(ox, oy, orb.size, 0, Math.PI * 2);
        ctx.fillStyle = orb.color;
        ctx.fill();
      });

      // Core shape - pulsing star
      const pulse = 1 + Math.sin(t * 2) * 0.06;
      const coreGrd = ctx.createRadialGradient(cx, cy, 0, cx, cy, 45 * pulse);
      coreGrd.addColorStop(0, '#fff');
      coreGrd.addColorStop(0.3, '#a5b4fc');
      coreGrd.addColorStop(0.7, '#6366f1');
      coreGrd.addColorStop(1, '#4338ca00');
      ctx.beginPath();
      ctx.arc(cx, cy, 45 * pulse, 0, Math.PI * 2);
      ctx.fillStyle = coreGrd;
      ctx.fill();

      // Star icon in center
      ctx.fillStyle = 'white';
      ctx.font = `bold ${20 * pulse}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('★', cx, cy);

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      unsubX();
      unsubY();
    };
  }, [smoothX, smoothY]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  return (
    <div className="relative w-full h-full" onMouseMove={handleMouseMove}>
      <canvas ref={canvasRef} className="w-full h-full" />
      {/* Floating labels */}
      {[
        { label: 'Innovation', icon: <Zap size={12} />, x: '75%', y: '20%' },
        { label: 'Community', icon: <Users size={12} />, x: '80%', y: '60%' },
        { label: 'Impact', icon: <TrendingUp size={12} />, x: '15%', y: '30%' },
        { label: 'Skills', icon: <Code2 size={12} />, x: '10%', y: '65%' },
        { label: 'Achievement', icon: <Trophy size={12} />, x: '50%', y: '85%' },
      ].map((item) => (
        <motion.div
          key={item.label}
          className="absolute flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/10 dark:bg-navy-800/60 backdrop-blur-sm border border-white/20 dark:border-navy-600/50 text-xs font-medium text-white/80 dark:text-slate-300 shadow-glass pointer-events-none"
          style={{ left: item.x, top: item.y, transform: 'translate(-50%, -50%)' }}
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, ease: 'easeInOut', delay: Math.random() * 2 }}
        >
          {item.icon}
          {item.label}
        </motion.div>
      ))}
    </div>
  );
}

// ==================== Animated counter ====================
function Counter({ end, suffix = '', duration = 2 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const { ref, isVisible } = useScrollReveal(0.3);

  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const step = end / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [isVisible, end, duration]);

  return <span ref={ref as React.RefObject<HTMLSpanElement>}>{formatNumber(count)}{suffix}</span>;
}

// ==================== MAIN COMPONENT ====================
export default function Landing() {
  const navigate = useNavigate();
  const [topHeroes, setTopHeroes] = useState<HeroCard[]>([]);
  const [heroesLoading, setHeroesLoading] = useState(true);
  const [stats, setStats] = useState({ heroCount: 0, achievementCount: 0, totalXp: 0, impactScore: 0 });

  const featuresRef = useScrollReveal();
  const statsRef = useScrollReveal();
  const heroesRef = useScrollReveal();
  const ctaRef = useScrollReveal();

  useEffect(() => {
    heroesService.getTopHeroes().then(setTopHeroes).catch(() => {}).finally(() => setHeroesLoading(false));
    heroesService.getStats().then(setStats).catch(() => {});
  }, []);

  const features = [
    { icon: <Trophy className="text-indigo-500" size={24} />, title: 'Achievement System', desc: 'Track and celebrate meaningful accomplishments with verified badges and XP rewards.', color: 'from-indigo-500/10 to-violet-500/10' },
    { icon: <Users className="text-violet-500" size={24} />, title: 'Hero Community', desc: 'Connect with builders, designers, and innovators who are shaping the digital future.', color: 'from-violet-500/10 to-purple-500/10' },
    { icon: <TrendingUp className="text-cyan-500" size={24} />, title: 'Impact Tracking', desc: 'Visualize your real-world impact and see how your contributions ripple outward.', color: 'from-cyan-500/10 to-blue-500/10' },
    { icon: <Zap className="text-amber-500" size={24} />, title: 'XP & Levels', desc: 'Earn experience points for every contribution and rise through hero levels.', color: 'from-amber-500/10 to-orange-500/10' },
    { icon: <Star className="text-emerald-500" size={24} />, title: 'Skill Growth', desc: 'Track your skill progression with endorsements from the community.', color: 'from-emerald-500/10 to-teal-500/10' },
    { icon: <Rocket className="text-rose-500" size={24} />, title: 'Project Showcase', desc: 'Display your best work and get recognized for the projects that matter.', color: 'from-rose-500/10 to-pink-500/10' },
  ];

  return (
    <div className="overflow-hidden">
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-screen flex items-center pt-20 pb-10 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-indigo-950 dark:from-navy-950 dark:via-navy-900 dark:to-indigo-950" />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 30% 20%, rgba(99,102,241,0.2) 0%, transparent 60%), radial-gradient(ellipse at 80% 70%, rgba(139,92,246,0.15) 0%, transparent 60%)' }} />
        {/* Noise texture overlay */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: '256px 256px' }} />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[80vh]">
            {/* Left Content */}
            <div className="flex flex-col justify-center">
              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <Badge variant="primary" className="mb-6 bg-indigo-500/20 text-indigo-300 border-indigo-500/30">
                  <Zap size={12} fill="currentColor" /> Welcome to the Future of Recognition
                </Badge>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
                className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-white mb-6"
              >
                Celebrate the <span className="gradient-text-hero">Digital Heroes</span> of Tomorrow
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg text-slate-300 leading-relaxed mb-8 max-w-lg"
              >
                A premium platform for discovering, celebrating, and connecting with the builders, innovators, and impact-makers shaping the digital world.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 mb-10"
              >
                <Button size="xl" onClick={() => navigate('/register')} rightIcon={<ArrowRight size={18} />}
                  className="shadow-glow-indigo">
                  Become a Hero
                </Button>
                <Button size="xl" variant="outline" onClick={() => navigate('/explore')}
                  className="border-white/20 text-white hover:bg-white/10 hover:border-white/40"
                  leftIcon={<Play size={16} />}>
                  Explore Heroes
                </Button>
              </motion.div>

              {/* Social proof */}
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                className="flex items-center gap-4"
              >
                <div className="flex -space-x-2">
                  {['alexchen', 'sarah', 'marcus', 'zara'].map((seed) => (
                    <img key={seed} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4`}
                      className="w-8 h-8 rounded-full border-2 border-navy-900" alt="hero" />
                  ))}
                </div>
                <p className="text-sm text-slate-400">
                  <span className="text-white font-semibold">{stats.heroCount > 0 ? formatNumber(stats.heroCount) : '1k'}+</span> heroes already building the future
                </p>
              </motion.div>
            </div>

            {/* Right — HeroCore visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }}
              className="relative w-full aspect-square max-w-lg mx-auto"
            >
              <HeroCore />
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-400"
            animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-xs">Scroll to explore</span>
            <ChevronDown size={18} />
          </motion.div>
        </div>
      </section>

      {/* ===== STATS SECTION ===== */}
      <section ref={statsRef.ref as React.RefObject<HTMLElement>} className="py-20 bg-white dark:bg-navy-950 relative">
        <div className="aurora-bg absolute inset-0 opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 32 }} animate={statsRef.isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              { value: stats.heroCount || 1200, suffix: '+', label: 'Digital Heroes', icon: <Users size={20} className="text-indigo-500" /> },
              { value: stats.achievementCount || 8400, suffix: '+', label: 'Achievements Earned', icon: <Trophy size={20} className="text-violet-500" /> },
              { value: stats.totalXp || 2500000, suffix: '', label: 'Total XP Gained', icon: <Zap size={20} className="text-cyan-500" /> },
              { value: stats.impactScore || 95000, suffix: '+', label: 'Impact Score', icon: <TrendingUp size={20} className="text-emerald-500" /> },
            ].map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 24 }} animate={statsRef.isVisible ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 dark:bg-navy-900/60 border border-slate-200 dark:border-navy-700">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-navy-800 dark:to-navy-700 flex items-center justify-center mb-3">
                  {stat.icon}
                </div>
                <p className="text-3xl font-bold font-display gradient-text mb-1">
                  <Counter end={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section ref={featuresRef.ref as React.RefObject<HTMLElement>} className="py-24 bg-slate-50 dark:bg-navy-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 32 }} animate={featuresRef.isVisible ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
            className="text-center mb-16">
            <Badge variant="primary" className="mb-4">Platform Features</Badge>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Everything you need to <span className="gradient-text">shine</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Digital Heroes is built for recognition, growth, and community — designed with care for every detail.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 32 }} animate={featuresRef.isVisible ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.1, duration: 0.5 }}>
                <Card hover gradient className="h-full">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4`}>
                    {f.icon}
                  </div>
                  <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{f.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TOP HEROES SECTION ===== */}
      <section ref={heroesRef.ref as React.RefObject<HTMLElement>} className="py-24 bg-white dark:bg-navy-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 32 }} animate={heroesRef.isVisible ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
            className="flex items-end justify-between mb-12">
            <div>
              <Badge variant="primary" className="mb-4">Top Heroes</Badge>
              <h2 className="font-display text-4xl font-bold text-slate-900 dark:text-white">
                Meet our <span className="gradient-text">Rising Stars</span>
              </h2>
            </div>
            <Button variant="outline" onClick={() => navigate('/heroes')} rightIcon={<ArrowRight size={14} />} className="hidden md:flex">View All</Button>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {heroesLoading ? (
              Array.from({ length: 6 }).map((_, i) => <HeroCardSkeleton key={i} />)
            ) : topHeroes.slice(0, 6).map((hero, i) => (
              <motion.div key={hero.id} initial={{ opacity: 0, y: 32 }} animate={heroesRef.isVisible ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.08, duration: 0.5 }}>
                <Card hover padding="md" onClick={() => navigate(`/heroes/${hero.user.username}`)} className="group">
                  <div className="flex items-start gap-4 mb-4">
                    <Avatar src={hero.avatarUrl} alt={hero.displayName} size="lg" level={hero.level} />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{hero.displayName}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{hero.title}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Zap size={11} className="text-amber-500" />
                        <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">{getLevelTitle(hero.level)}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <ProgressRing percentage={((hero.xp % 1000) / 10)} size={44} strokeWidth={4} color="#6366f1">
                        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{hero.level}</span>
                      </ProgressRing>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4">{hero.bio}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {hero.skills?.slice(0, 3).map((s) => (
                        <Badge key={s.skill.name} variant="default" size="sm">{s.skill.name}</Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <Trophy size={12} className="text-amber-400" />
                      <span>{hero._count?.achievements}</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button variant="outline" onClick={() => navigate('/heroes')} size="lg" rightIcon={<ArrowRight size={16} />}>View All Heroes</Button>
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section ref={ctaRef.ref as React.RefObject<HTMLElement>} className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={ctaRef.isVisible ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-800 p-12 text-center shadow-glow-indigo">
            <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.3) 0%, transparent 70%)' }} />
            <div className="relative">
              <Badge className="mb-6 bg-white/20 text-white border-white/30">Ready to start?</Badge>
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
                Your hero journey begins today
              </h2>
              <p className="text-indigo-100 text-lg mb-8 max-w-xl mx-auto">
                Join thousands of digital heroes who are already building their legacy. Your story deserves to be told.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="xl" onClick={() => navigate('/register')}
                  className="bg-white text-indigo-600 hover:bg-indigo-50 border-0 shadow-lg"
                  rightIcon={<ArrowRight size={18} />}>
                  Join Digital Heroes
                </Button>
                <Button size="xl" variant="ghost" onClick={() => navigate('/explore')}
                  className="text-white hover:bg-white/10 border border-white/30">
                  Explore First
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
