import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Star, Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { authService } from '../../services/auth';
import { useToast } from '../../store/toastStore';

const schema = z.object({
  displayName: z.string().min(2, 'At least 2 characters').max(50),
  username: z.string().min(3, 'At least 3 characters').max(30).regex(/^[a-zA-Z0-9_-]+$/, 'Letters, numbers, _ and - only'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'At least 8 characters').regex(/[A-Z]/, 'One uppercase letter').regex(/[0-9]/, 'One number'),
});
type FormData = z.infer<typeof schema>;

export default function Register() {
  const navigate = useNavigate();
  const toast = useToast();
  const [showPw, setShowPw] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await authService.register(data);
      toast.success('Welcome to Digital Heroes! 🎉', 'Your hero journey begins now.');
      navigate('/dashboard');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      toast.error('Registration failed', axiosErr.response?.data?.message || 'Please try again.');
    }
  };

  const perks = ['Personalized hero profile', 'Achievement tracking system', 'XP & leveling system', 'Community recognition'];

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-navy-900 via-violet-950 to-navy-950 relative overflow-hidden flex-col items-center justify-center p-12">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(139,92,246,0.2) 0%, transparent 70%)' }} />
        <div className="relative text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center mx-auto mb-8 shadow-glow-violet">
            <Star size={32} className="text-white" fill="white" />
          </div>
          <h2 className="font-display text-3xl font-bold text-white mb-4">Start your <span className="gradient-text-hero">hero journey</span></h2>
          <p className="text-slate-300 mb-8 max-w-xs">Join the community of digital heroes building tomorrow's world.</p>
          <div className="flex flex-col gap-3 text-left">
            {perks.map((perk) => (
              <div key={perk} className="flex items-center gap-3 text-slate-300">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span className="text-sm">{perk}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-16 bg-white dark:bg-navy-950">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Star size={16} className="text-white" fill="white" />
            </div>
            <span className="font-display font-bold text-xl text-slate-900 dark:text-white">Digital<span className="gradient-text">Heroes</span></span>
          </div>
          <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white mb-2">Create account</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">Already a hero? <Link to="/login" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">Sign in</Link></p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Display Name" placeholder="Alex Chen" error={errors.displayName?.message} required {...register('displayName')} />
              <Input label="Username" placeholder="alex_chen" error={errors.username?.message} required {...register('username')} />
            </div>
            <Input label="Email" type="email" placeholder="hero@example.com" error={errors.email?.message} required autoComplete="email" {...register('email')} />
            <Input label="Password" type={showPw ? 'text' : 'password'} placeholder="Min 8 chars, 1 uppercase, 1 number" error={errors.password?.message} required
              rightElement={<button type="button" onClick={() => setShowPw(!showPw)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">{showPw ? <EyeOff size={16} /> : <Eye size={16} />}</button>}
              {...register('password')} />
            <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting} rightIcon={<ArrowRight size={16} />}>
              Create Hero Account
            </Button>
          </form>
          <p className="text-xs text-slate-400 dark:text-slate-500 text-center mt-6">By joining, you agree to our Terms of Service and Privacy Policy.</p>
        </motion.div>
      </div>
    </div>
  );
}
