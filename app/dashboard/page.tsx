'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { getSupabaseClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProgressBar } from '@/components/progress-bar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Target, TrendingUp, CalendarClock, Heart, Plus, Share2,
  AlertCircle, CheckCircle2, Loader2, ArrowRight, BookOpen, Home, GraduationCap,
  Clock, Sparkles, ShieldCheck, ArrowUpRight,
} from 'lucide-react';
import {
  computeFundingSummary, formatNaira, formatNairaShort, daysUntilDeadline,
  readinessLabel, readinessColor, projectPledgeAmount,
} from '@/lib/finance';
import type { EducationGoal, Contribution, Pledge, GoalCategory } from '@/lib/types';
import { PillButton } from '@/components/landing/primitives';

const categoryIcons: Record<GoalCategory, typeof Target> = {
  tuition: GraduationCap,
  accommodation: Home,
  books: BookOpen,
  other: Target,
};

const categoryLabels: Record<GoalCategory, string> = {
  tuition: 'Tuition & Fees',
  accommodation: 'Hostel & Housing',
  books: 'Books & STEM Gear',
  other: 'Finalist Clearance',
};

interface GoalWithStats extends EducationGoal {
  contributions: Contribution[];
  pledges: Pledge[];
}

export default function DashboardPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const supabase = getSupabaseClient();
  const [goals, setGoals] = useState<GoalWithStats[]>([]);
  const [loading, setLoading] = useState(true);

  const loadGoals = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data: goalData } = await supabase
      .from('education_goals')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!goalData) {
      setLoading(false);
      return;
    }

    const goalIds = goalData.map((g) => g.id);
    if (goalIds.length === 0) {
      setGoals([]);
      setLoading(false);
      return;
    }

    const [contribRes, pledgeRes] = await Promise.all([
      supabase.from('contributions').select('*').in('goal_id', goalIds).order('created_at', { ascending: false }),
      supabase.from('pledges').select('*').in('goal_id', goalIds).order('created_at', { ascending: false }),
    ]);

    const goalsWithStats: GoalWithStats[] = goalData.map((g) => ({
      ...g,
      contributions: (contribRes.data || []).filter((c) => c.goal_id === g.id),
      pledges: (pledgeRes.data || []).filter((p) => p.goal_id === g.id),
    }));

    setGoals(goalsWithStats);
    setLoading(false);
  }, [user, supabase]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
      return;
    }
    if (user) loadGoals();
  }, [user, authLoading, router, loadGoals]);

  if (authLoading || (!user && authLoading)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
      </div>
    );
  }

  if (!user) return null;

  // Compute aggregate stats
  const activeGoals = goals.filter((g) => g.visibility !== 'archived');
  const totalTarget = activeGoals.reduce((sum, g) => sum + g.target_amount_kobo, 0);
  const totalContributions = activeGoals.reduce(
    (sum, g) => sum + g.contributions.filter((c) => c.status === 'demo_confirmed' || c.status === 'verified').reduce((s, c) => s + c.amount_kobo, 0),
    0
  );
  const totalStartingSavings = activeGoals.reduce((sum, g) => sum + g.starting_savings_kobo, 0);
  const totalRaised = totalContributions + totalStartingSavings;
  const totalGap = Math.max(0, totalTarget - totalRaised);

  const activePledges = activeGoals.flatMap((g) => g.pledges.filter((p) => p.status === 'active' || p.status === 'paused'));
  const totalPledgedProjected = activeGoals.reduce((sum, g) => {
    return sum + g.pledges
      .filter((p) => p.status === 'active')
      .reduce((s, p) => {
        const { projectedAmountKobo } = projectPledgeAmount({
          amountPerKobo: p.amount_per_kobo,
          frequency: p.frequency,
          firstDate: p.first_date,
          endDate: p.end_date,
          deadline: g.deadline,
          status: p.status,
        });
        return s + projectedAmountKobo;
      }, 0);
  }, 0);

  const allContributions = activeGoals.flatMap((g) => g.contributions).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);

  const upcomingDeadlines = activeGoals
    .map((g) => ({ goal: g, days: daysUntilDeadline(g.deadline) }))
    .sort((a, b) => a.days - b.days)
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Top Header */}
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-border/60 pb-8">
        <div>
          <div className="eyebrow mb-2">
            STUDENT REGISTRY DASHBOARD
          </div>
          <h1 className="display-md text-neutral-950 dark:text-white">
            Welcome, {profile?.display_name || user.email?.split('@')[0]}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground font-mono">
            {profile?.institution || 'Nigerian University Student'} · Cowrywise Savings Linked
          </p>
        </div>
        <div>
          <PillButton href="/goals/new" variant="primary" icon={Plus}>
            Create new goal
          </PillButton>
        </div>
      </div>

      {/* Stats overview cards */}
      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 font-mono">
        <StatCard
          icon={Target}
          label="TOTAL TARGET"
          value={formatNaira(totalTarget)}
          color="text-brand-blue"
          loading={loading}
        />
        <StatCard
          icon={TrendingUp}
          label="CONFIRMED FUNDED"
          value={formatNaira(totalContributions)}
          subtitle={`+ ${formatNaira(totalStartingSavings)} self-saved`}
          color="text-brand-gold"
          loading={loading}
        />
        <StatCard
          icon={AlertCircle}
          label="REMAINING GAP"
          value={formatNaira(totalGap)}
          color="text-red-500"
          loading={loading}
        />
        <StatCard
          icon={Heart}
          label="ACTIVE PLEDGES"
          value={`${activePledges.length} Pledges`}
          subtitle={`${formatNairaShort(totalPledgedProjected)} projected`}
          color="text-emerald-500"
          loading={loading}
        />
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      ) : activeGoals.length === 0 ? (
        /* Empty state */
        <div className="rounded-3xl border border-dashed border-border/80 bg-card p-12 text-center max-w-2xl mx-auto shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-blue/10">
            <Target className="h-8 w-8 text-brand-blue" />
          </div>
          <h3 className="text-xl font-bold">No active education goals yet</h3>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            Create your first semester tuition, hostel, or clearance goal to start tracking progress,
            setting automated daily savings targets, and inviting sponsors.
          </p>
          <div className="mt-6 flex justify-center">
            <PillButton href="/goals/new" variant="primary" icon={Plus}>
              Create your first goal
            </PillButton>
          </div>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Upcoming deadlines strip */}
          {upcomingDeadlines.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-brand-gold">
                <Clock className="h-4 w-4" />
                <span>APPROACHING DEADLINES</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {upcomingDeadlines.map(({ goal, days }) => {
                  const Icon = categoryIcons[goal.category];
                  return (
                    <Link key={goal.id} href={`/goals/${goal.id}`}>
                      <div className="rounded-2xl border border-border bg-card p-4 hover:border-brand-gold/60 transition-colors shadow-sm cursor-pointer flex items-center justify-between">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-blue/10">
                            <Icon className="h-5 w-5 text-brand-blue" />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-neutral-900 dark:text-white">{goal.title}</p>
                            <p className="text-[11px] text-muted-foreground font-mono">{categoryLabels[goal.category]}</p>
                          </div>
                        </div>
                        <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-mono font-bold ${
                          days <= 7 ? 'bg-red-500/10 text-red-500 border border-red-500/30' : 'bg-muted text-foreground'
                        }`}>
                          {days > 0 ? `${days}d left` : 'Overdue'}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Goals list */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">Your education goals</h2>
              <span className="font-mono text-xs text-muted-foreground">{activeGoals.length} ACTIVE</span>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {activeGoals.map((goal) => {
                const Icon = categoryIcons[goal.category];
                const confirmedContrib = goal.contributions
                  .filter((c) => c.status === 'demo_confirmed' || c.status === 'verified')
                  .reduce((s, c) => s + c.amount_kobo, 0);
                const pledgedProj = goal.pledges
                  .filter((p) => p.status === 'active')
                  .reduce((s, p) => {
                    const { projectedAmountKobo } = projectPledgeAmount({
                      amountPerKobo: p.amount_per_kobo,
                      frequency: p.frequency,
                      firstDate: p.first_date,
                      endDate: p.end_date,
                      deadline: goal.deadline,
                      status: p.status,
                    });
                    return s + projectedAmountKobo;
                  }, 0);
                const summary = computeFundingSummary({
                  targetKobo: goal.target_amount_kobo,
                  startingSavingsKobo: goal.starting_savings_kobo,
                  confirmedContributionsKobo: confirmedContrib,
                  pledgedProjectedKobo: pledgedProj,
                  deadline: goal.deadline,
                });

                return (
                  <div
                    key={goal.id}
                    className="rounded-3xl border border-border bg-card p-6 shadow-md hover:shadow-xl transition-all space-y-5"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-blue/10">
                          <Icon className="h-6 w-6 text-brand-blue" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold leading-tight">{goal.title}</h3>
                          <p className="text-xs text-muted-foreground font-mono mt-0.5">
                            {categoryLabels[goal.category]} · {goal.institution || 'University'}
                          </p>
                        </div>
                      </div>
                      <span className="stamp text-[9px]">
                        {goal.visibility === 'published' ? 'LIVE' : 'DRAFT'}
                      </span>
                    </div>

                    {/* Progress breakdown */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="font-bold text-neutral-900 dark:text-white">
                          {formatNaira(summary.totalRaisedKobo)}
                        </span>
                        <span className="text-muted-foreground">
                          Target: {formatNaira(goal.target_amount_kobo)} ({summary.percentageFunded.toFixed(0)}%)
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full gradient-bg-blue transition-all duration-500"
                          style={{ width: `${summary.percentageFunded}%` }}
                        />
                      </div>
                    </div>

                    {/* Readiness & Countdown */}
                    <div className="flex items-center justify-between text-xs font-mono pt-1">
                      <span className={readinessColor(summary.readiness)}>
                        ● {readinessLabel(summary.readiness)}
                      </span>
                      <span className="text-muted-foreground">
                        {summary.daysRemaining > 0 ? `${summary.daysRemaining} days left` : 'Deadline passed'}
                      </span>
                    </div>

                    {/* Card Actions */}
                    <div className="flex items-center gap-2 pt-2 border-t border-border/60">
                      <Link href={`/goals/${goal.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full rounded-full font-mono text-xs h-9">
                          Manage goal
                        </Button>
                      </Link>
                      {goal.visibility === 'published' && goal.public_slug && (
                        <Link href={`/fund/${goal.public_slug}`} className="flex-1">
                          <Button size="sm" className="w-full rounded-full gradient-bg-blue text-white font-mono text-xs h-9">
                            <Share2 className="mr-1.5 h-3.5 w-3.5 text-brand-gold" />
                            Public campaign
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent contributions receipt strip */}
          {allContributions.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">Recent sponsor contributions</h2>
              <div className="rounded-2xl border border-border bg-card p-4 divide-y divide-border/60">
                {allContributions.map((contrib) => {
                  const goal = activeGoals.find((g) => g.id === contrib.goal_id);
                  return (
                    <div key={contrib.id} className="flex items-center justify-between py-3 font-mono text-xs">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-gold/15">
                          <Heart className="h-4 w-4 text-brand-gold" />
                        </div>
                        <div>
                          <p className="font-bold text-neutral-900 dark:text-white">
                            {contrib.sponsor_name}
                          </p>
                          <p className="text-[10px] text-muted-foreground font-sans">
                            {goal?.title || 'Education Goal'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-foreground">
                          {formatNaira(contrib.amount_kobo)}
                        </div>
                        <span className="text-[9px] text-emerald-500 uppercase font-bold">
                          VERIFIED
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  subtitle,
  color,
  loading,
}: {
  icon: typeof Target;
  label: string;
  value: string;
  subtitle?: string;
  color: string;
  loading?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-6 w-24" />
        </div>
      ) : (
        <>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
            <Icon className={`h-4 w-4 ${color}`} />
          </div>
          <div className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">{value}</div>
          {subtitle && <div className="mt-1 text-[10px] text-muted-foreground font-sans">{subtitle}</div>}
        </>
      )}
    </div>
  );
}
