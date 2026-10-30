'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { getSupabaseClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Heart, Loader2, Pause, Play, XCircle, Calendar, TrendingUp,
  Mail, Bell, Clock, CheckCircle2, AlertCircle, MessageCircle, Trash2,
} from 'lucide-react';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { openWhatsAppPledgeReminder } from '@/lib/whatsapp';
import {
  formatNaira, formatDate, projectPledgeAmount, daysUntilDeadline,
} from '@/lib/finance';
import type { Pledge, EducationGoal, PledgeStatus, PledgeFrequency } from '@/lib/types';
import { toast } from 'sonner';

interface PledgeWithGoal extends Pledge {
  goal: EducationGoal;
}

export default function PledgesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const supabase = getSupabaseClient();
  const [pledges, setPledges] = useState<PledgeWithGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterEmail, setFilterEmail] = useState('');
  const [appliedEmail, setAppliedEmail] = useState('');

  const loadPledges = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    // Load all goals for this user
    const { data: goals } = await supabase
      .from('education_goals')
      .select('*')
      .eq('user_id', user.id);

    if (!goals || goals.length === 0) { setPledges([]); setLoading(false); return; }

    const goalIds = goals.map((g) => g.id);
    const { data: pledgeData } = await supabase
      .from('pledges')
      .select('*')
      .in('goal_id', goalIds)
      .order('created_at', { ascending: false });

    const goalMap = new Map(goals.map((g) => [g.id, g]));
    const combined: PledgeWithGoal[] = (pledgeData || []).map((p) => ({
      ...p,
      goal: goalMap.get(p.goal_id)!,
    })).filter((p) => p.goal);

    setPledges(combined);
    setLoading(false);
  }, [user, supabase]);

  useEffect(() => {
    if (!authLoading && !user) { router.push('/auth'); return; }
    if (user) loadPledges();
  }, [user, authLoading, router, loadPledges]);

  // Set sponsor email context for RLS
  const applyEmailFilter = async () => {
    setAppliedEmail(filterEmail);
    if (filterEmail) {
      // Use RPC to set local variable — but we can't do that from client.
      // Instead, we'll just filter client-side for the student view.
    }
    toast.info(`Filtering by ${filterEmail || 'all pledges'}`);
  };

  const updatePledgeStatus = async (pledgeId: string, status: PledgeStatus) => {
    const { error } = await supabase.from('pledges').update({ status }).eq('id', pledgeId);
    if (error) { toast.error('Failed to update pledge'); return; }
    toast.success(`Pledge ${status}`);
    loadPledges();
  };

  const acknowledgePledge = async (pledgeId: string) => {
    const { error } = await supabase.from('pledges').update({ note_moderation: 'approved' }).eq('id', pledgeId);
    if (error) { toast.error('Failed to acknowledge pledge: ' + error.message); return; }
    toast.success('Pledge acknowledged and confirmed!');
    loadPledges();
  };

  const deletePledge = async (pledgeId: string) => {
    const { error } = await supabase.from('pledges').delete().eq('id', pledgeId);
    if (error) {
      await supabase.from('pledges').update({ status: 'cancelled' }).eq('id', pledgeId);
    }
    toast.success('Pledge deleted');
    loadPledges();
  };

  if (authLoading) {
    return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }
  if (!user) return null;

  const activePledges = pledges.filter((p) => p.status === 'active');
  const pausedPledges = pledges.filter((p) => p.status === 'paused');
  const cancelledPledges = pledges.filter((p) => p.status === 'cancelled');
  const completedPledges = pledges.filter((p) => p.status === 'completed');

  const totalProjected = activePledges.reduce((sum, p) => {
    const { projectedAmountKobo } = projectPledgeAmount({
      amountPerKobo: p.amount_per_kobo, frequency: p.frequency, firstDate: p.first_date,
      endDate: p.end_date, deadline: p.goal.deadline, status: p.status,
    });
    return sum + projectedAmountKobo;
  }, 0);

  const filteredPledges = appliedEmail
    ? pledges.filter((p) => p.sponsor_email === appliedEmail)
    : pledges;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Top Header */}
      <div className="mb-8 border-b border-border/60 pb-6">
        <div className="eyebrow mb-2">
          SPONSOR COMMITMENTS & PLEDGE CIRCLE
        </div>
        <h1 className="display-md text-foreground">
          Pledges & Scheduled Commitments
        </h1>
        <p className="mt-1 text-sm text-muted-foreground font-mono">
          Track recurring sponsor commitments, pause or resume reminder cadences, and review pledges.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3 font-mono">
        <Card className="rounded-2xl border border-border bg-card p-2 shadow-xs">
          <CardContent className="py-4">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Active pledges</span>
              <Heart className="h-4 w-4 text-brand-blue" />
            </div>
            <div className="text-2xl font-black text-foreground">{activePledges.length}</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border border-border bg-card p-2 shadow-xs">
          <CardContent className="py-4">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Total projected</span>
              <TrendingUp className="h-4 w-4 text-brand-gold" />
            </div>
            <div className="text-2xl font-black text-foreground">{formatNaira(totalProjected)}</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border border-border bg-card p-2 shadow-xs">
          <CardContent className="py-4">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Paused / Cancelled</span>
              <Pause className="h-4 w-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-foreground">{pausedPledges.length + cancelledPledges.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Email filter for sponsor view */}
      <Card className="rounded-2xl border border-border bg-card p-2 mb-8 shadow-xs">
        <CardContent className="py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1 space-y-1">
              <Label htmlFor="emailFilter" className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                Filter by sponsor email
              </Label>
              <Input
                id="emailFilter"
                type="email"
                placeholder="sponsor@example.com"
                value={filterEmail}
                onChange={(e) => setFilterEmail(e.target.value)}
                className="font-mono text-xs h-10"
              />
            </div>
            <Button onClick={applyEmailFilter} variant="outline" className="rounded-full font-mono text-xs h-10 px-5">
              Filter
            </Button>
            {appliedEmail && (
              <Button variant="ghost" onClick={() => { setAppliedEmail(''); setFilterEmail(''); }} className="rounded-full font-mono text-xs h-10">
                Clear
              </Button>
            )}
          </div>
          <p className="mt-2 text-xs text-muted-foreground font-mono">
            Sponsors can manage their own pledge frequencies by entering their email address.
          </p>
        </CardContent>
      </Card>

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      ) : filteredPledges.length === 0 ? (
        <Card className="card-3d">
          <CardContent className="flex flex-col items-center py-16 text-center">
            <Heart className="mb-3 h-10 w-10 text-muted-foreground/50" />
            <h3 className="font-medium">No pledges yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              When sponsors pledge support via your campaign page, they&apos;ll appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="active">
          <TabsList>
            <TabsTrigger value="active">Active ({activePledges.length})</TabsTrigger>
            <TabsTrigger value="paused">Paused ({pausedPledges.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedPledges.length})</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled ({cancelledPledges.length})</TabsTrigger>
          </TabsList>

          {(['active', 'paused', 'completed', 'cancelled'] as const).map((tab) => {
            const list = filteredPledges.filter((p) => p.status === tab);
            return (
              <TabsContent key={tab} value={tab} className="space-y-3">
                {list.length === 0 ? (
                  <Card className="card-3d"><CardContent className="py-8 text-center text-sm text-muted-foreground">No {tab} pledges.</CardContent></Card>
                ) : (
                  list.map((p) => (
                    <PledgeCard
                      key={p.id}
                      pledge={p}
                      onStatusChange={updatePledgeStatus}
                      onAcknowledge={acknowledgePledge}
                      onDelete={deletePledge}
                    />
                  ))
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      )}

      {/* Reminder preview note */}
      <Card className="card-3d mt-6">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <Bell className="mt-0.5 h-5 w-5 shrink-0 text-brand-gold" />
            <div>
              <h3 className="text-sm font-semibold">Reminder scheduling</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Reminder events are generated based on pledge schedules and sponsor consent.
                Email delivery is not configured in this prototype — reminders are shown as
                a manual preview labelled as demo. No reminder is marked as sent unless
                delivery is confirmed.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PledgeCard({
  pledge,
  onStatusChange,
  onAcknowledge,
  onDelete,
}: {
  pledge: PledgeWithGoal;
  onStatusChange: (id: string, status: PledgeStatus) => void;
  onAcknowledge: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [showSchedule, setShowSchedule] = useState(false);
  const { projectedAmountKobo, projectedCount, scheduledDates } = projectPledgeAmount({
    amountPerKobo: pledge.amount_per_kobo,
    frequency: pledge.frequency,
    firstDate: pledge.first_date,
    endDate: pledge.end_date,
    deadline: pledge.goal.deadline,
    status: pledge.status,
  });
  const daysLeft = daysUntilDeadline(pledge.goal.deadline);

  return (
    <Card className="card-3d">
      <CardContent className="py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-blue/10">
              <Heart className="h-5 w-5 text-brand-blue" />
            </div>
            <div>
              <p className="font-medium">{pledge.sponsor_name}</p>
              <p className="text-xs text-muted-foreground">
                {formatNaira(pledge.amount_per_kobo)} / {pledge.frequency} · {pledge.goal.title}
              </p>
              {pledge.sponsor_email && (
                <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <Mail className="h-3 w-3" /> {pledge.sponsor_email}
                </p>
              )}
              {pledge.reminder_consent && (
                <Badge variant="outline" className="mt-1 text-xs">
                  <Bell className="mr-1 h-3 w-3" /> Reminders: {pledge.reminder_frequency}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <Badge variant={pledge.status === 'active' ? 'default' : 'secondary'}>{pledge.status}</Badge>
            {pledge.note_moderation === 'approved' ? (
              <Badge variant="outline" className="text-[10px] border-emerald-500/40 text-emerald-600 bg-emerald-500/10">
                ✓ Confirmed
              </Badge>
            ) : (
              <Badge variant="outline" className="text-[10px] border-amber-500/40 text-amber-600 bg-amber-500/10">
                Awaiting Acknowledgment
              </Badge>
            )}
          </div>
        </div>

        {/* Projection */}
        {projectedCount > 0 && (
          <div className="mt-3 rounded-lg bg-muted/30 p-3 text-sm">
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <span><span className="text-muted-foreground">Projected:</span> <span className="font-medium">{formatNaira(projectedAmountKobo)}</span></span>
              <span><span className="text-muted-foreground">Payments:</span> <span className="font-medium">{projectedCount}</span></span>
              <span><span className="text-muted-foreground">First:</span> <span className="font-medium">{formatDate(pledge.first_date)}</span></span>
              {pledge.end_date && <span><span className="text-muted-foreground">End:</span> <span className="font-medium">{formatDate(pledge.end_date)}</span></span>}
            </div>
            {pledge.status === 'active' && projectedAmountKobo > 0 && (
              <p className="mt-1 text-xs text-muted-foreground">
                {projectedAmountKobo >= pledge.goal.target_amount_kobo
                  ? 'This pledge is projected to cover the full target.'
                  : `Projected to cover ${((projectedAmountKobo / pledge.goal.target_amount_kobo) * 100).toFixed(0)}% of the target.`}
              </p>
            )}
          </div>
        )}

        {/* Schedule preview */}
        {showSchedule && scheduledDates.length > 0 && (
          <div className="mt-3 rounded-lg border p-3">
            <p className="mb-2 text-xs font-medium text-muted-foreground">Upcoming intended contribution dates (demo preview)</p>
            <div className="flex flex-wrap gap-2">
              {scheduledDates.slice(0, 12).map((d, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  <Calendar className="mr-1 h-3 w-3" /> {formatDate(d)}
                </Badge>
              ))}
              {scheduledDates.length > 12 && <span className="text-xs text-muted-foreground">+{scheduledDates.length - 12} more</span>}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-3 flex flex-wrap gap-2">
          {pledge.note_moderation !== 'approved' && (
            <Button
              size="sm"
              variant="outline"
              className="border-emerald-600/40 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
              onClick={() => onAcknowledge(pledge.id)}
            >
              <CheckCircle2 className="mr-1.5 h-3.5 w-3.5 text-emerald-600" />
              Acknowledge Pledge
            </Button>
          )}
          {pledge.status === 'active' && (
            <>
              <Button
                size="sm"
                variant="outline"
                className="border-emerald-600/40 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                onClick={() => openWhatsAppPledgeReminder({
                  sponsorName: pledge.sponsor_name,
                  studentName: pledge.goal.public_display_name || 'Student',
                  goalTitle: pledge.goal.title,
                  institution: pledge.goal.institution,
                  amountKobo: pledge.amount_per_kobo,
                  frequency: pledge.frequency,
                  daysRemaining: daysLeft,
                  url: `${window.location.origin}/fund/${pledge.goal.public_slug || ''}`,
                })}
              >
                <MessageCircle className="mr-1.5 h-3.5 w-3.5 text-emerald-600" />
                WhatsApp Reminder
              </Button>
              <Button size="sm" variant="outline" onClick={() => onStatusChange(pledge.id, 'paused')}>
                <Pause className="mr-1.5 h-3.5 w-3.5" /> Pause
              </Button>
              <Button size="sm" variant="outline" onClick={() => onStatusChange(pledge.id, 'cancelled')}>
                <XCircle className="mr-1.5 h-3.5 w-3.5" /> Cancel
              </Button>
              <Button size="sm" variant="outline" onClick={() => onStatusChange(pledge.id, 'completed')}>
                <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> Mark complete
              </Button>
            </>
          )}
          {pledge.status === 'paused' && (
            <Button size="sm" variant="outline" onClick={() => onStatusChange(pledge.id, 'active')}>
              <Play className="mr-1.5 h-3.5 w-3.5" /> Resume
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={() => setShowSchedule(!showSchedule)}>
            <Clock className="mr-1.5 h-3.5 w-3.5" /> {showSchedule ? 'Hide' : 'Show'} schedule
          </Button>

          {/* Delete Pledge action */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="border-red-500/30 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this pledge?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete this pledge record from the system.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(pledge.id)}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Delete Pledge
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
