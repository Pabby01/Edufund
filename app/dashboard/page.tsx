'use client';

import { useEffect, useState, useCallback } from 'react';
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
  Clock,
} from 'lucide-react';
import {
  computeFundingSummary, formatNaira, formatNairaShort, daysUntilDeadline,
  readinessLabel, readinessColor, koboToNaira, projectPledgeAmount,
} from '@/lib/finance';
import type { EducationGoal, Contribution, Pledge, GoalCategory } from '@/lib/types';

const categoryIcons: Record<GoalCategory, typeof Target> = {
  tuition: GraduationCap,
  accommodation: Home,
  books: BookOpen,
  other: Target,
};

const categoryLabels: Record<GoalCategory, string> = {
  tuition: 'Tuition',
  accommodation: 'Accommodation',
  books: 'Books & Materials',
  other: 'Other',
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
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {profile?.display_name || user.email?.split('@')[0]}
          </h1>
          <p className="mt-1 text-muted-foreground">
            Here&apos;s your education funding overview.
          </p>
        </div>
        <Link href="/goals/new">
          <Button className="gradient-bg-blue text-white hover:opacity-90">
            <Plus className="mr-2 h-4 w-4" />
            Create a goal
          </Button>
        </Link>
      </div>

      {/* Stats overview */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Target}
          label="Total target"
          value={formatNaira(totalTarget)}
          color="text-brand-blue"
          loading={loading}
        />
        <StatCard
          icon={TrendingUp}
          label="Confirmed contributions"
          value={formatNaira(totalContributions)}
          subtitle={`+ ${formatNaira(totalStartingSavings)} self-saved`}
          color="text-brand-gold"
          loading={loading}
        />
        <StatCard
          icon={AlertCircle}
          label="Funding gap"
          value={formatNaira(totalGap)}
          color="text-red-500"
          loading={loading}
        />
        <StatCard
          icon={Heart}
          label="Active pledges"
          value={`${activePledges.length}`}
          subtitle={`${formatNairaShort(totalPledgedProjected)} projected`}
          color="text-emerald-500"
          loading={loading}
        />
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      ) : activeGoals.length === 0 ? (
        /* Empty state */
        <Card className="card-3d">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-blue/10">
              <Target className="h-8 w-8 text-brand-blue" />
            </div>
            <h3 className="text-lg font-semibold">No education goals yet</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Create your first funding goal to start tracking progress and sharing your campaign with sponsors.
            </p>
            <Link href="/goals/new" className="mt-4">
              <Button className="gradient-bg-blue text-white hover:opacity-90">
                <Plus className="mr-2 h-4 w-4" />
                Create your first goal
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Upcoming deadlines */}
          {upcomingDeadlines.length > 0 && (
            <div>
              <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                <Clock className="h-5 w-5 text-brand-gold" />
                Approaching deadlines
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {upcomingDeadlines.map(({ goal, days }) => {
                  const Icon = categoryIcons[goal.category];
                  return (
                    <Link key={goal.id} href={`/goals/${goal.id}`}>
                      <Card className={`card-3d cursor-pointer ${days <= 14 ? 'border-amber-500/40' : ''}`}>
                        <CardContent className="flex items-center gap-3 py-4">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-blue/10">
                            <Icon className="h-5 w-5 text-brand-blue" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">{goal.title}</p>
                            <p className="text-xs text-muted-foreground">{categoryLabels[goal.category]}</p>
                          </div>
                          <Badge variant={days <= 7 ? 'destructive' : days <= 30 ? 'secondary' : 'outline'}>
                            {days > 0 ? `${days}d left` : 'Overdue'}
                          </Badge>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Goals list */}
          <div>
            <h2 className="mb-3 text-lg font-semibold">Your education goals</h2>
            <div className="grid gap-4 lg:grid-cols-2">
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
                  <Card key={goal.id} className="card-3d">
                    <CardHeader className="flex flex-row items-start justify-between space-y-0">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-blue/10">
                          <Icon className="h-5 w-5 text-brand-blue" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{goal.title}</CardTitle>
                          <CardDescription className="text-xs">
                            {categoryLabels[goal.category]} · {goal.institution || '—'}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant={goal.visibility === 'published' ? 'default' : 'secondary'}>
                        {goal.visibility === 'published' ? 'Live' : goal.visibility === 'archived' ? 'Archived' : 'Draft'}
                      </Badge>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span className="font-medium">{formatNaira(summary.totalRaisedKobo)}</span>
                          <span className="text-muted-foreground">of {formatNaira(goal.target_amount_kobo)}</span>
                        </div>
                        <ProgressBar value={summary.percentageFunded} />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className={readinessColor(summary.readiness)}>
                          {readinessLabel(summary.readiness)}
                        </span>
                        <span className="text-muted-foreground">
                          {summary.daysRemaining > 0 ? `${summary.daysRemaining} days left` : 'Deadline passed'}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/goals/${goal.id}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full">Manage</Button>
                        </Link>
                        {goal.visibility === 'published' && goal.public_slug && (
                          <Link href={`/fund/${goal.public_slug}`} className="flex-1">
                            <Button variant="outline" size="sm" className="w-full">
                              <Share2 className="mr-1.5 h-3.5 w-3.5" />
                              Share
                            </Button>
                          </Link>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Recent contributions */}
          {allContributions.length > 0 && (
            <div>
              <h2 className="mb-3 text-lg font-semibold">Recent contributions</h2>
              <Card className="card-3d">
                <CardContent className="divide-y divide-border/50 py-0">
                  {allContributions.map((contrib) => {
                    const goal = activeGoals.find((g) => g.id === contrib.goal_id);
                    return (
                      <div key={contrib.id} className="flex items-center gap-3 py-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-gold/10">
                          <Heart className="h-4 w-4 text-brand-gold" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {contrib.sponsor_name} gave {formatNaira(contrib.amount_kobo)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {goal?.title || '—'} · {contrib.status === 'demo_confirmed' ? 'Demo' : contrib.status}
                          </p>
                        </div>
                        <Badge variant={contrib.status === 'demo_confirmed' ? 'secondary' : 'outline'}>
                          {contrib.status === 'demo_confirmed' ? 'Demo' : contrib.status}
                        </Badge>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
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
    <Card className="card-3d">
      <CardContent className="py-4">
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-7 w-24" />
          </div>
        ) : (
          <>
            <div className="mb-1.5 flex items-center gap-2">
              <Icon className={`h-4 w-4 ${color}`} />
              <span className="text-sm text-muted-foreground">{label}</span>
            </div>
            <div className="text-xl font-bold">{value}</div>
            {subtitle && <div className="mt-0.5 text-xs text-muted-foreground">{subtitle}</div>}
          </>
        )}
      </CardContent>
    </Card>
  );
}
