'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { EduFundLogo } from '@/components/edu-fund-logo';
import { Loader2, GraduationCap, Mail, Lock, User as UserIcon } from 'lucide-react';
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
        setError('Please enter your name (at least 2 characters).');
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
      router.push('/dashboard');
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error);
        setSubmitting(false);
        return;
      }
      router.push('/dashboard');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-4 py-12">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-brand-blue/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-brand-gold/10 blur-3xl" />
      </div>

      <Card className="glass-card relative w-full max-w-md p-2 shadow-xl">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto">
            <EduFundLogo size={40} />
          </div>
          <CardTitle className="text-2xl">
            {mode === 'signin' ? 'Welcome back' : 'Create your account'}
          </CardTitle>
          <CardDescription>
            {mode === 'signin'
              ? 'Sign in to manage your education goals'
              : 'Start funding your education journey today'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="displayName">Full name</Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="displayName"
                    type="text"
                    placeholder="Ada Okafor"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === 'signin' ? 'Sign in' : 'Create account'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {mode === 'signin' ? (
              <>
                Don&apos;t have an account?{' '}
                <button
                  onClick={() => { setMode('signup'); setError(null); }}
                  className="font-medium text-primary hover:underline"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => { setMode('signin'); setError(null); }}
                  className="font-medium text-primary hover:underline"
                >
                  Sign in
                </button>
              </>
            )}
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <GraduationCap className="h-3.5 w-3.5" />
            <span>Hackathon prototype — no real funds are held</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
