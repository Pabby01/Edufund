'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { getSupabaseClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Shield, Loader2, Target, TrendingUp, Heart, MessageSquare,
  AlertCircle, CheckCircle2, Building2, Activity, Bell,
} from 'lucide-react';
import { formatNaira, formatNairaShort, formatDate, daysUntilDeadline } from '@/lib/finance';
import type { EducationGoal, Contribution, Pledge, EncouragementNote } from '@/lib/types';
import { toast } from 'sonner';

export default function AdminPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const supabase = getSupabaseClient();
  const [goals, setGoals] = useState<EducationGoal[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [pledges, setPledges] = useState<Pledge[]>([]);
  const [notes, setNotes] = useState<EncouragementNote[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    // Admin can see all data via their authenticated session
    // RLS policies allow owners to see their own data; for a true admin
    // view, we'd need a SECURITY DEFINER function or service_role.
    // For this demo, we query all public goals + their related data.
    const { data: goalData } = await supabase
      .from('education_goals')
      .select('*')
      .order('created_at', { ascending: false });

    setGoals((goalData || []) as EducationGoal[]);

    if (goalData && goalData.length > 0) {
      const goalIds = goalData.map((g) => g.id);
      const [cRes, pRes, nRes] = await Promise.all([
        supabase.from('contributions').select('*').in('goal_id', goalIds).order('created_at', { ascending: false }),
        supabase.from('pledges').select('*').in('goal_id', goalIds).order('created_at', { ascending: false }),
        supabase.from('encouragement_notes').select('*').in('goal_id', goalIds).order('created_at', { ascending: false }),
      ]);
      setContributions((cRes.data || []) as Contribution[]);
      setPledges((pRes.data || []) as Pledge[]);
      setNotes((nRes.data || []) as EncouragementNote[]);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    if (!authLoading && !user) { router.push('/auth'); return; }
    if (!authLoading && user && !profile?.is_admin) { router.push('/dashboard'); return; }
    if (user && profile?.is_admin) loadData();
  }, [user, profile, authLoading, router, loadData]);

  const moderateNote = async (noteId: string, status: 'approved' | 'hidden') => {
    const { error } = await supabase.from('encouragement_notes').update({ moderation_status: status }).eq('id', noteId);
    if (error) { toast.error('Failed to update'); return; }
    toast.success(`Note ${status}`);
    loadData();
  };

  if (authLoading || (user && !profile)) {
    return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }
  if (!user || !profile?.is_admin) return null;

  const publishedGoals = goals.filter((g) => g.visibility === 'published');
  const draftGoals = goals.filter((g) => g.visibility === 'draft');
  const archivedGoals = goals.filter((g) => g.visibility === 'archived');

  const demoContribs = contributions.filter((c) => c.status === 'demo_confirmed');
  const verifiedContribs = contributions.filter((c) => c.status === 'verified');
  const pendingContribs = contributions.filter((c) => c.status === 'pending');

  const activePledges = pledges.filter((p) => p.status === 'active');
  const pausedPledges = pledges.filter((p) => p.status === 'paused');
  const cancelledPledges = pledges.filter((p) => p.status === 'cancelled');

  const pendingNotes = notes.filter((n) => n.moderation_status === 'pending');
  const approvedNotes = notes.filter((n) => n.moderation_status === 'approved');
  const hiddenNotes = notes.filter((n) => n.moderation_status === 'hidden');

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Top Header */}
      <div className="mb-8 border-b border-border/60 pb-6">
        <div className="eyebrow mb-2">
          SYSTEM AUDIT & MODERATION
        </div>
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-brand-blue" />
          <h1 className="display-md text-foreground">Admin & Verification Registry</h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground font-mono">
          Demo operator overview — campaigns, Remita disbursements, sponsor pledges, and message moderation.
        </p>
      </div>

      {/* Overview stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStat icon={Target} label="Total campaigns" value={String(goals.length)} sub={`${publishedGoals.length} live, ${draftGoals.length} draft`} color="text-brand-blue" loading={loading} />
        <AdminStat icon={TrendingUp} label="Contributions" value={String(contributions.length)} sub={`${demoContribs.length} demo, ${verifiedContribs.length} verified`} color="text-brand-gold" loading={loading} />
        <AdminStat icon={Heart} label="Pledges" value={String(pledges.length)} sub={`${activePledges.length} active`} color="text-emerald-500" loading={loading} />
        <AdminStat icon={MessageSquare} label="Pending notes" value={String(pendingNotes.length)} sub={`${approvedNotes.length} approved`} color="text-amber-500" loading={loading} />
      </div>

      {/* Demo vs Real indicator */}
      <Card className="card-3d mb-6">
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Demo</Badge>
              <span className="text-muted-foreground">{demoContribs.length} simulated contributions</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Verified</Badge>
              <span className="text-muted-foreground">{verifiedContribs.length} real contributions</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Pending</Badge>
              <span className="text-muted-foreground">{pendingContribs.length} pending</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="campaigns">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="contributions">Contributions</TabsTrigger>
          <TabsTrigger value="pledges">Pledges</TabsTrigger>
          <TabsTrigger value="moderation">Moderation ({pendingNotes.length})</TabsTrigger>
        </TabsList>

        {/* Campaigns tab */}
        <TabsContent value="campaigns" className="space-y-3">
          {loading ? <Skeleton className="h-64 w-full rounded-xl" /> : (
            <Card className="card-3d">
              <CardContent className="py-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead className="hidden sm:table-cell">Category</TableHead>
                      <TableHead>Target</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden sm:table-cell">Deadline</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {goals.map((g) => (
                      <TableRow key={g.id}>
                        <TableCell className="font-medium">{g.title}</TableCell>
                        <TableCell className="hidden sm:table-cell capitalize">{g.category}</TableCell>
                        <TableCell>{formatNairaShort(g.target_amount_kobo)}</TableCell>
                        <TableCell>
                          <Badge variant={g.visibility === 'published' ? 'default' : g.visibility === 'archived' ? 'secondary' : 'outline'}>
                            {g.visibility}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <span className={daysUntilDeadline(g.deadline) <= 14 ? 'text-amber-500' : ''}>
                            {formatDate(g.deadline)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Contributions tab */}
        <TabsContent value="contributions" className="space-y-3">
          {loading ? <Skeleton className="h-64 w-full rounded-xl" /> : (
            <Card className="card-3d">
              <CardContent className="py-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sponsor</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden sm:table-cell">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contributions.slice(0, 20).map((c) => (
                      <TableRow key={c.id}>
                        <TableCell className="font-medium">{c.sponsor_name}</TableCell>
                        <TableCell>{formatNaira(c.amount_kobo)}</TableCell>
                        <TableCell>
                          <Badge variant={c.status === 'demo_confirmed' ? 'secondary' : c.status === 'verified' ? 'default' : 'outline'}>
                            {c.status === 'demo_confirmed' ? 'Demo' : c.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-muted-foreground">{formatDate(c.created_at)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Pledges tab */}
        <TabsContent value="pledges" className="space-y-3">
          {loading ? <Skeleton className="h-64 w-full rounded-xl" /> : (
            <Card className="card-3d">
              <CardContent className="py-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sponsor</TableHead>
                      <TableHead>Amount/freq</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden sm:table-cell">First date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pledges.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.sponsor_name}</TableCell>
                        <TableCell>{formatNairaShort(p.amount_per_kobo)}/{p.frequency}</TableCell>
                        <TableCell>
                          <Badge variant={p.status === 'active' ? 'default' : 'secondary'}>{p.status}</Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-muted-foreground">{formatDate(p.first_date)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Moderation tab */}
        <TabsContent value="moderation" className="space-y-3">
          {loading ? <Skeleton className="h-64 w-full rounded-xl" /> : pendingNotes.length === 0 ? (
            <Card className="card-3d">
              <CardContent className="flex flex-col items-center py-12 text-center">
                <CheckCircle2 className="mb-3 h-10 w-10 text-emerald-500" />
                <h3 className="font-medium">All caught up!</h3>
                <p className="mt-1 text-sm text-muted-foreground">No pending notes to moderate.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {pendingNotes.map((n) => (
                <Card key={n.id} className="card-3d">
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-500/10">
                          <MessageSquare className="h-4 w-4 text-amber-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{n.author_name}</p>
                          <p className="mt-1 text-sm">{n.content}</p>
                          <p className="mt-1 text-xs text-muted-foreground">{formatDate(n.created_at)}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" onClick={() => moderateNote(n.id, 'approved')} className="h-7 px-2 text-xs">Approve</Button>
                        <Button size="sm" variant="ghost" onClick={() => moderateNote(n.id, 'hidden')} className="h-7 px-2 text-xs text-destructive">Hide</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Integration health */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Card className="card-3d">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="h-4 w-4 text-brand-blue" />
              Cowrywise integration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Pending access</Badge>
              <span className="text-sm text-muted-foreground">No credentials configured</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              The provider adapter is implemented but credentials are not available.
              All savings/investment flows show an honest &quot;integration pending&quot; state.
              No fake API responses are presented.
            </p>
          </CardContent>
        </Card>

        <Card className="card-3d">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="h-4 w-4 text-brand-gold" />
              Reminder system
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Demo preview</Badge>
              <span className="text-sm text-muted-foreground">Email delivery not configured</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Reminder schedules are generated and stored. Events are shown as
              manual previews. No reminder is marked as sent unless delivery is confirmed.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Security note */}
      <Card className="card-3d mt-6">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
            <div>
              <h3 className="text-sm font-semibold">Admin access notice</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Admin access is controlled by the <code className="rounded bg-muted px-1">is_admin</code> flag on the profile.
                In production, this should be enforced server-side via role claims in JWT metadata
                (<code className="rounded bg-muted px-1">raw_app_meta_data</code>), not client-side checks.
                Use the Supabase admin SQL to set: <code className="rounded bg-muted px-1">UPDATE profiles SET is_admin = true WHERE id = &apos;UUID&apos;;</code>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AdminStat({ icon: Icon, label, value, sub, color, loading }: {
  icon: typeof Target; label: string; value: string; sub?: string; color: string; loading?: boolean;
}) {
  return (
    <Card className="card-3d">
      <CardContent className="py-4">
        {loading ? <div className="space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-7 w-16" /></div> : (
          <>
            <div className="mb-1 flex items-center gap-2">
              <Icon className={`h-4 w-4 ${color}`} />
              <span className="text-sm text-muted-foreground">{label}</span>
            </div>
            <div className="text-xl font-bold">{value}</div>
            {sub && <div className="mt-0.5 text-xs text-muted-foreground">{sub}</div>}
          </>
        )}
      </CardContent>
    </Card>
  );
}
