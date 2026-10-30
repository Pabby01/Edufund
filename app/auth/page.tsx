'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EduFundLogo } from '@/components/edu-fund-logo';
import {
  Loader2,
  GraduationCap,
  Mail,
  Lock,
  User as UserIcon,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, signUp, user, loading } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const m = searchParams.get('mode');
    if (m === 'signup') setMode('signup');
  }, [searchParams]);

  useEffect(() => {
    if (!loading && user) {
      const redirect = searchParams.get('redirect') || '/dashboard';
      router.push(redirect);
    }
  }, [user, loading, router, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    if (mode === 'signup') {
      if (displayName.trim().length < 2) {
        setError('Please enter your full name (at least 2 characters).');
        setSubmitting(false);
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        setSubmitting(false);
        return;
      }
      const { error } = await signUp(email, password, displayName.trim());
      if (error) {
        setError(error);
        setSubmitting(false);
        return;
      }
      const redirect = searchParams.get('redirect') || '/dashboard';
      router.push(redirect);
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error);
        setSubmitting(false);
        return;
      }
      const redirect = searchParams.get('redirect') || '/dashboard';
      router.push(redirect);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 py-12">
      {/* Background Ambience */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-brand-blue/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-[350px] w-[350px] rounded-full bg-brand-gold/10 blur-[100px]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Monospace Header Eyebrow */}
        <div className="text-center mb-6 space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-brand-gold/30 bg-brand-gold/10 px-3 py-1 font-mono text-[11px] font-bold tracking-widest text-brand-gold-dark dark:text-brand-gold uppercase">
            <ShieldCheck className="h-3 w-3" />
            STUDENT PORTAL ACCESS
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            {mode === 'signin' ? 'Welcome back.' : 'Fund your semester.'}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-sans">
            {mode === 'signin'
              ? 'Access your education goals, Remita invoices, and sponsor pledges.'
              : 'Create your verified student profile and start an education goal in 2 minutes.'}
          </p>
        </div>

        {/* Auth Card with Sawtooth Receipt Perforated Accent */}
        <div className="relative rounded-2xl border border-border/70 bg-card/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          {/* Top Mode Segmented Pill */}
          <div className="grid grid-cols-2 gap-1 rounded-xl bg-muted/60 p-1 mb-6 font-mono text-xs font-semibold">
            <button
              type="button"
              onClick={() => { setMode('signin'); setError(null); }}
              className={`rounded-lg py-2 transition-all ${
                mode === 'signin'
                  ? 'bg-background text-foreground shadow-xs font-bold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              SIGN IN
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setError(null); }}
              className={`rounded-lg py-2 transition-all ${
                mode === 'signup'
                  ? 'bg-background text-foreground shadow-xs font-bold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              CREATE ACCOUNT
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="space-y-1.5">
                <Label htmlFor="displayName" className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Student Full Name
                </Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="displayName"
                    type="text"
                    placeholder="e.g. Amina Bello"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="pl-9 h-11 text-sm bg-background border-border/80 focus:border-brand-blue"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                University or Personal Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@student.unilag.edu.ng"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 h-11 text-sm bg-background border-border/80 focus:border-brand-blue"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 h-11 text-sm bg-background border-border/80 focus:border-brand-blue"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 font-mono text-xs text-red-500 dark:text-red-400">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11 rounded-full gradient-bg-blue text-white font-bold text-sm shadow-md hover:opacity-95 transition-opacity"
              disabled={submitting}
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <ArrowRight className="h-4 w-4 mr-2" />
              )}
              {mode === 'signin' ? 'Sign into Portal' : 'Create Student Profile'}
            </Button>
          </form>

          {/* Footer note inside card */}
          <div className="mt-6 border-t border-border/60 pt-4 font-mono text-[11px] text-muted-foreground text-center space-y-1">
            <p>Direct Remita Settlement · Cowrywise Locked Savings</p>
            <p className="text-[10px] text-muted-foreground/80">Integer kobo precision with 0% drift</p>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Return to public registry
          </Link>
        </div>
      </div>
    </div>
  );
}
