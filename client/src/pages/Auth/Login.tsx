import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Star, Eye, EyeOff, ArrowRight, Zap } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { authService } from '../../services/auth';
import { useToast } from '../../store/toastStore';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});
type FormData = z.infer<typeof schema>;

export default function Login() {
  const navigate = useNavigate();
  const toast = useToast();
  const [showPw, setShowPw] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await authService.login(data);
      toast.success('Welcome back, Hero!', 'You have successfully signed in.');
      navigate('/dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed. Please try again.';
      const axiosErr = err as { response?: { data?: { message?: string } } };
      toast.error('Sign in failed', axiosErr.response?.data?.message || msg);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-navy-900 via-indigo-950 to-navy-950 relative overflow-hidden flex-col items-center justify-center p-12">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(99,102,241,0.2) 0%, transparent 70%)' }} />
        <div className="relative text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mx-auto mb-8 shadow-glow-indigo">
            <Star size={32} className="text-white" fill="white" />
          </div>
          <h2 className="font-display text-4xl font-bold text-white mb-4">Welcome back, <span className="gradient-text-hero">Hero</span></h2>
          <p className="text-slate-300 text-lg leading-relaxed max-w-xs">
            Sign in to track your progress, explore achievements, and connect with the community.
          </p>
          <div className="mt-10 flex flex-col gap-3 text-left">
            {['Track your hero journey', 'Earn XP and level up', 'Connect with innovators'].map((item) => (
              <div key={item} className="flex items-center gap-3 text-slate-300">
                <div className="w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center shrink-0">
                  <Zap size={10} className="text-indigo-400" />
                </div>
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-4 py-16 bg-white dark:bg-navy-950">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Star size={16} className="text-white" fill="white" />
            </div>
            <span className="font-display font-bold text-xl text-slate-900 dark:text-white">Digital<span className="gradient-text">Heroes</span></span>
          </div>
          <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white mb-2">Sign in</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">Don't have an account? <Link to="/register" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">Join Heroes</Link></p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <Input label="Email" type="email" placeholder="hero@example.com" error={errors.email?.message} required autoComplete="email" {...register('email')} />
            <Input label="Password" type={showPw ? 'text' : 'password'} placeholder="Your password" error={errors.password?.message} required autoComplete="current-password"
              rightElement={<button type="button" onClick={() => setShowPw(!showPw)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">{showPw ? <EyeOff size={16} /> : <Eye size={16} />}</button>}
              {...register('password')} />
            <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting} rightIcon={<ArrowRight size={16} />}>
              Sign In
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-navy-800">
            <p className="text-xs text-slate-400 dark:text-slate-500 text-center">Demo: <code className="bg-slate-100 dark:bg-navy-800 px-1 rounded">demo@digitalhero.dev</code> / <code className="bg-slate-100 dark:bg-navy-800 px-1 rounded">Demo@1234</code></p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
