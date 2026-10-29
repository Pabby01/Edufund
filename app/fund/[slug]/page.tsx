'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { getSupabaseClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProgressBar } from '@/components/progress-bar';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { EduFundLogo } from '@/components/edu-fund-logo';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Heart, Share2, Copy, Calendar, TrendingUp, Target, Loader2,
  CheckCircle2, GraduationCap, Home, BookOpen, MessageSquare,
  ShieldCheck, Clock, AlertCircle, Users,
} from 'lucide-react';
import {
  computeFundingSummary, formatNaira, formatNairaShort, daysUntilDeadline,
  readinessLabel, readinessColor, nairaToKobo, projectPledgeAmount, formatDate,
} from '@/lib/finance';
import type { EducationGoal, Contribution, Pledge, EncouragementNote, GoalCategory, PledgeFrequency } from '@/lib/types';
import { toast } from 'sonner';

const categoryIcons: Record<GoalCategory, typeof Target> = {
  tuition: GraduationCap, accommodation: Home, books: BookOpen, other: Target,
};
const categoryLabels: Record<GoalCategory, string> = {
  tuition: 'Tuition', accommodation: 'Accommodation', books: 'Books & Materials', other: 'Other',
};

const presetAmounts = [5000, 10000, 25000, 50000];

export default function PublicCampaignPage() {
  const { slug } = useParams<{ slug: string }>();
  const supabase = getSupabaseClient();
  const [goal, setGoal] = useState<EducationGoal | null>(null);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [pledges, setPledges] = useState<Pledge[]>([]);
  const [notes, setNotes] = useState<EncouragementNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [giveOpen, setGiveOpen] = useState(false);
  const [pledgeOpen, setPledgeOpen] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    const { data: goalData } = await supabase
      .from('education_goals')
      .select('*')
      .eq('public_slug', slug)
      .eq('visibility', 'published')
      .maybeSingle();

    if (!goalData) { setLoading(false); return; }
    setGoal(goalData as EducationGoal);

    const [contribRes, pledgeRes, noteRes] = await Promise.all([
      supabase.from('contributions').select('*').eq('goal_id', goalData.id).order('created_at', { ascending: false }),
      supabase.from('pledges').select('*').eq('goal_id', goalData.id).eq('status', 'active').order('created_at', { ascending: false }),
      supabase.from('encouragement_notes').select('*').eq('goal_id', goalData.id).eq('moderation_status', 'approved').eq('consent_public', true).order('created_at', { ascending: false }).limit(10),
    ]);

    setContributions((contribRes.data || []) as Contribution[]);
    setPledges((pledgeRes.data || []) as Pledge[]);
    setNotes((noteRes.data || []) as EncouragementNote[]);
    setLoading(false);
  }, [slug, supabase]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: `Support ${goal?.public_display_name || 'this student'}`, url }); } catch {}
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied!');
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Skeleton className="mb-6 h-48 w-full rounded-2xl" />
        <Skeleton className="mb-4 h-32 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (!goal) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <AlertCircle className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
        <h1 className="text-xl font-semibold">Campaign not found</h1>
        <p className="mt-2 text-muted-foreground">This campaign may have been archived or the link is incorrect.</p>
        <Button onClick={() => window.location.href = '/'} className="mt-4">Go home</Button>
      </div>
    );
  }

  const confirmedContrib = contributions.filter((c) => c.status === 'demo_confirmed' || c.status === 'verified').reduce((s, c) => s + c.amount_kobo, 0);
  const pledgedProj = pledges.reduce((s, p) => {
    const { projectedAmountKobo } = projectPledgeAmount({ amountPerKobo: p.amount_per_kobo, frequency: p.frequency, firstDate: p.first_date, endDate: p.end_date, deadline: goal.deadline, status: p.status });
    return s + projectedAmountKobo;
  }, 0);
  const summary = computeFundingSummary({ targetKobo: goal.target_amount_kobo, startingSavingsKobo: goal.starting_savings_kobo, confirmedContributionsKobo: confirmedContrib, pledgedProjectedKobo: pledgedProj, deadline: goal.deadline });
  const publicContributions = contributions.filter((c) => c.note_consent && c.note_moderation === 'approved').slice(0, 5);
  const Icon = categoryIcons[goal.category];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Status badge */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant={summary.daysRemaining > 0 ? 'default' : 'destructive'}>
            {summary.daysRemaining > 0 ? `${summary.daysRemaining} days left` : 'Deadline passed'}
          </Badge>
          <Badge variant="outline">{categoryLabels[goal.category]}</Badge>
          <span className={`text-sm font-medium ${readinessColor(summary.readiness)}`}>
            {readinessLabel(summary.readiness)}
          </span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="mr-1.5 h-4 w-4" /> Share
          </Button>
          <Button variant="ghost" size="sm" onClick={copyLink}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Cover + title */}
      {goal.cover_image_url && (
        <div className="mb-6 overflow-hidden rounded-2xl">
          <img src={goal.cover_image_url} alt={goal.title} className="h-48 w-full object-cover sm:h-64" />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Student info */}
          <Card className="card-3d">
            <CardContent className="py-6">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-blue/10">
                  <GraduationCap className="h-8 w-8 text-brand-blue" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{goal.public_display_name || 'Student'}</h1>
                  <p className="text-sm text-muted-foreground">{goal.institution} · {goal.session}</p>
                </div>
              </div>
              <h2 className="mt-4 text-lg font-semibold">{goal.title}</h2>
              {goal.story && <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{goal.story}</p>}
            </CardContent>
          </Card>

          {/* Progress card */}
          <Card className="card-3d">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-brand-blue" />
                Funding progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between text-lg">
                  <span className="font-bold">{formatNaira(summary.totalRaisedKobo)}</span>
                  <span className="text-muted-foreground">of {formatNaira(goal.target_amount_kobo)}</span>
                </div>
                <ProgressBar value={summary.percentageFunded} height="h-5" showLabel />
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-lg bg-muted/30 p-3">
                  <p className="text-xs text-muted-foreground">Target</p>
                  <p className="font-semibold text-sm">{formatNairaShort(goal.target_amount_kobo)}</p>
                </div>
                <div className="rounded-lg bg-muted/30 p-3">
                  <p className="text-xs text-muted-foreground">Confirmed</p>
                  <p className="font-semibold text-sm">{formatNairaShort(confirmedContrib)}</p>
                </div>
                <div className="rounded-lg bg-muted/30 p-3">
                  <p className="text-xs text-muted-foreground">Self-saved</p>
                  <p className="font-semibold text-sm">{formatNairaShort(goal.starting_savings_kobo)}</p>
                </div>
                <div className="rounded-lg bg-muted/30 p-3">
                  <p className="text-xs text-muted-foreground">Gap</p>
                  <p className="font-semibold text-sm text-red-500">{formatNairaShort(summary.remainingGapKobo)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Deadline: </span>
                <span className="font-medium">{formatDate(goal.deadline)}</span>
              </div>
            </CardContent>
          </Card>

          {/* CTA buttons */}
          <div className="grid gap-3 sm:grid-cols-2">
            <Button size="lg" onClick={() => setGiveOpen(true)} className="gradient-bg-blue text-white hover:opacity-90 h-14 text-base">
              <Heart className="mr-2 h-5 w-5" />
              Give to this student
            </Button>
            <Button size="lg" onClick={() => setPledgeOpen(true)} variant="outline" className="h-14 text-base border-brand-gold/40 hover:bg-brand-gold/5">
              <Users className="mr-2 h-5 w-5 text-brand-gold" />
              Pledge future support
            </Button>
          </div>

          {/* Disclosure */}
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-xs text-muted-foreground">
            <strong className="text-amber-600 dark:text-amber-400">Demo notice:</strong> EduFund is a hackathon prototype.
            Contributions on this page are simulated and do not represent real money transferred.
            A pledge is a commitment, not a completed payment.
          </div>

          {/* Recent contributions */}
          {publicContributions.length > 0 && (
            <Card className="card-3d">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Heart className="h-5 w-5 text-brand-gold" />
                  Recent contributions
                </CardTitle>
              </CardHeader>
              <CardContent className="divide-y divide-border/50 py-0">
                {publicContributions.map((c) => (
                  <div key={c.id} className="py-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{c.sponsor_name}</span>
                      <span className="text-sm font-semibold">{formatNaira(c.amount_kobo)}</span>
                    </div>
                    {c.note && <p className="mt-1 text-xs italic text-muted-foreground">&quot;{c.note}&quot;</p>}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Encouragement notes */}
          {notes.length > 0 && (
            <Card className="card-3d">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MessageSquare className="h-5 w-5 text-brand-gold" />
                  Encouragement messages
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {notes.map((n) => (
                  <div key={n.id} className="rounded-lg border bg-card p-3">
                    <p className="text-sm">{n.content}</p>
                    <p className="mt-2 text-xs text-muted-foreground">— {n.author_name}, {formatDate(n.created_at)}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card className="card-3d sticky top-20">
            <CardHeader>
              <CardTitle className="text-base">At a glance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Percentage funded</span><span className="font-bold">{summary.percentageFunded.toFixed(0)}%</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Days remaining</span><span className="font-bold">{summary.daysRemaining > 0 ? summary.daysRemaining : 0}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Active pledges</span><span className="font-bold">{pledges.length}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Pledged (projected)</span><span className="font-bold">{formatNairaShort(pledgedProj)}</span></div>
              <div className="border-t pt-2">
                <div className="flex justify-between"><span className="text-muted-foreground">Required daily</span><span className="font-medium">{formatNaira(summary.requiredDailyKobo)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Required weekly</span><span className="font-medium">{formatNaira(summary.requiredWeeklyKobo)}</span></div>
              </div>
              <div className="border-t pt-2 text-xs text-muted-foreground">
                <Clock className="mr-1 inline h-3 w-3" />
                Last updated: {formatDate(new Date())}
              </div>
            </CardContent>
          </Card>

          <Card className="card-3d">
            <CardContent className="py-4">
              <div className="flex items-start gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <span>Private information is never shown on this page. Only details you consented to share are visible.</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Give modal */}
      <GiveModal open={giveOpen} onOpenChange={setGiveOpen} goal={goal} summary={summary} onSuccess={loadData} />

      {/* Pledge modal */}
      <PledgeModal open={pledgeOpen} onOpenChange={setPledgeOpen} goal={goal} summary={summary} onSuccess={loadData} />
    </div>
  );
}

// ============================================================
// Give Modal
// ============================================================
function GiveModal({ open, onOpenChange, goal, summary, onSuccess }: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  goal: EducationGoal;
  summary: ReturnType<typeof computeFundingSummary>;
  onSuccess: () => void;
}) {
  const supabase = getSupabaseClient();
  const [amount, setAmount] = useState('');
  const [sponsorName, setSponsorName] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [note, setNote] = useState('');
  const [noteConsent, setNoteConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) { toast.error('Please enter a valid amount'); return; }
    if (amt > 10000000) { toast.error('Amount too large (max ₦10,000,000)'); return; }
    if (!anonymous && sponsorName.trim().length < 2) { toast.error('Please enter your name or check anonymous'); return; }

    setSubmitting(true);
    const { error } = await supabase.from('contributions').insert({
      goal_id: goal.id,
      sponsor_name: anonymous ? 'Anonymous' : sponsorName.trim(),
      amount_kobo: nairaToKobo(amt),
      status: 'demo_confirmed',
      note: note.trim() || null,
      note_consent: noteConsent,
      note_moderation: noteConsent ? 'pending' : 'hidden',
    });

    if (error) { toast.error('Failed to process: ' + error.message); setSubmitting(false); return; }

    // Also create an encouragement note if consented
    if (note.trim() && noteConsent) {
      await supabase.from('encouragement_notes').insert({
        goal_id: goal.id,
        author_name: anonymous ? 'Anonymous' : sponsorName.trim(),
        content: note.trim(),
        consent_public: true,
        moderation_status: 'pending',
      });
    }

    setSubmitting(false);
    setSuccess(true);
  };

  const handleClose = () => {
    onOpenChange(false);
    if (success) {
      setSuccess(false);
      setAmount(''); setSponsorName(''); setNote(''); setNoteConsent(false); setAnonymous(false);
      onSuccess();
    }
  };

  if (success) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <div className="flex flex-col items-center py-6 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
              <CheckCircle2 className="h-8 w-8 text-emerald-500" />
            </div>
            <h2 className="text-xl font-bold">Thank you!</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Your demo contribution of {formatNaira(nairaToKobo(parseFloat(amount) || 0))} has been recorded.
              The campaign progress has been updated.
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              This is a simulated contribution for the hackathon prototype. No real money was transferred.
            </p>
            <Button onClick={handleClose} className="mt-4">Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-brand-gold" />
            Give to {goal.public_display_name || 'this student'}
          </DialogTitle>
          <DialogDescription>
            Remaining gap: {formatNaira(summary.remainingGapKobo)} · {summary.daysRemaining} days left
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Preset amounts */}
          <div className="grid grid-cols-4 gap-2">
            {presetAmounts.map((amt) => (
              <Button key={amt} variant={amount === String(amt) ? 'default' : 'outline'} size="sm" onClick={() => setAmount(String(amt))}>
                ₦{amt >= 1000 ? `${amt / 1000}K` : amt}
              </Button>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="giveAmount">Custom amount (NGN)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₦</span>
              <Input id="giveAmount" type="number" placeholder="15000" value={amount} onChange={(e) => setAmount(e.target.value)} className="pl-8" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="giveName">Your name</Label>
            <Input id="giveName" placeholder="Your name" value={sponsorName} onChange={(e) => setSponsorName(e.target.value)} disabled={anonymous} />
            <div className="flex items-center gap-2">
              <Checkbox id="anon" checked={anonymous} onCheckedChange={(v) => setAnonymous(v === true)} />
              <Label htmlFor="anon" className="cursor-pointer text-sm">Give anonymously</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="giveNote">Encouragement note (optional)</Label>
            <Textarea id="giveNote" placeholder="A short message of support..." value={note} onChange={(e) => setNote(e.target.value)} rows={3} maxLength={500} />
            <p className="text-xs text-muted-foreground">{note.length}/500 characters</p>
            <div className="flex items-start gap-2">
              <Checkbox id="giveConsent" checked={noteConsent} onCheckedChange={(v) => setNoteConsent(v === true)} />
              <Label htmlFor="giveConsent" className="cursor-pointer text-sm">
                I consent to my name and note being displayed publicly on this campaign.
              </Label>
            </div>
          </div>

          <div className="rounded-lg bg-amber-500/5 px-3 py-2 text-xs text-muted-foreground">
            <strong>Demo:</strong> This is a simulated contribution. No real payment is processed.
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={submitting} className="gradient-bg-blue text-white hover:opacity-90">
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Give {amount && `₦${parseFloat(amount).toLocaleString()}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================
// Pledge Modal
// ============================================================
function PledgeModal({ open, onOpenChange, goal, summary, onSuccess }: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  goal: EducationGoal;
  summary: ReturnType<typeof computeFundingSummary>;
  onSuccess: () => void;
}) {
  const supabase = getSupabaseClient();
  const [sponsorName, setSponsorName] = useState('');
  const [sponsorEmail, setSponsorEmail] = useState('');
  const [amountPer, setAmountPer] = useState('');
  const [frequency, setFrequency] = useState<PledgeFrequency>('monthly');
  const [firstDate, setFirstDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [note, setNote] = useState('');
  const [noteConsent, setNoteConsent] = useState(false);
  const [reminderConsent, setReminderConsent] = useState(false);
  const [reminderFreq, setReminderFreq] = useState<PledgeFrequency>('weekly');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Compute projection
  const amtPer = parseFloat(amountPer) || 0;
  const projection = amtPer > 0 && firstDate ? projectPledgeAmount({
    amountPerKobo: nairaToKobo(amtPer),
    frequency,
    firstDate,
    endDate: endDate || null,
    deadline: goal.deadline,
    status: 'active',
  }) : null;

  const handleSubmit = async () => {
    if (sponsorName.trim().length < 2) { toast.error('Please enter your name'); return; }
    if (amtPer <= 0) { toast.error('Please enter a valid pledge amount'); return; }
    if (!firstDate) { toast.error('Please select a first contribution date'); return; }

    setSubmitting(true);
    const { error } = await supabase.from('pledges').insert({
      goal_id: goal.id,
      sponsor_name: sponsorName.trim(),
      sponsor_email: sponsorEmail.trim() || null,
      amount_per_kobo: nairaToKobo(amtPer),
      frequency,
      first_date: firstDate,
      end_date: endDate || null,
      note: note.trim() || null,
      note_consent: noteConsent,
      note_moderation: noteConsent ? 'pending' : 'hidden',
      status: 'active',
      reminder_consent: reminderConsent,
      reminder_frequency: reminderConsent ? reminderFreq : null,
    });

    if (error) { toast.error('Failed to create pledge: ' + error.message); setSubmitting(false); return; }

    // Create encouragement note if consented
    if (note.trim() && noteConsent) {
      await supabase.from('encouragement_notes').insert({
        goal_id: goal.id,
        author_name: sponsorName.trim(),
        content: note.trim(),
        consent_public: true,
        moderation_status: 'pending',
      });
    }

    // Create reminder preference if consented
    if (reminderConsent && sponsorEmail) {
      const { data: pledgeData } = await supabase.from('pledges').select('id').eq('goal_id', goal.id).order('created_at', { ascending: false }).limit(1).single();
      if (pledgeData) {
        await supabase.from('reminder_preferences').insert({
          pledge_id: pledgeData.id,
          reminder_frequency: reminderFreq,
          consent: true,
          opted_out: false,
        });
      }
    }

    setSubmitting(false);
    setSuccess(true);
  };

  const handleClose = () => {
    onOpenChange(false);
    if (success) {
      setSuccess(false);
      setSponsorName(''); setSponsorEmail(''); setAmountPer(''); setFirstDate(''); setEndDate(''); setNote(''); setNoteConsent(false); setReminderConsent(false);
      onSuccess();
    }
  };

  if (success) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <div className="flex flex-col items-center py-6 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-blue/10">
              <CheckCircle2 className="h-8 w-8 text-brand-blue" />
            </div>
            <h2 className="text-xl font-bold">Pledge confirmed!</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              You pledged {formatNaira(nairaToKobo(amtPer))} {frequency} to {goal.public_display_name || 'this student'}.
              {projection && ` That projects to ${formatNaira(projection.projectedAmountKobo)} by the deadline.`}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              A pledge is a commitment, not a payment. No money has been charged.
            </p>
            <Button onClick={handleClose} className="mt-4">Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-brand-gold" />
            Pledge future support
          </DialogTitle>
          <DialogDescription>
            Commit to recurring contributions. A pledge is a promise, not a payment.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Campaign context */}
          <div className="rounded-lg bg-muted/30 p-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Funding gap</span><span className="font-medium">{formatNaira(summary.remainingGapKobo)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Deadline</span><span className="font-medium">{formatDate(goal.deadline)}</span></div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="pledgeName">Your name</Label>
              <Input id="pledgeName" placeholder="Your name" value={sponsorName} onChange={(e) => setSponsorName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pledgeEmail">Email (optional, for reminders)</Label>
              <Input id="pledgeEmail" type="email" placeholder="you@example.com" value={sponsorEmail} onChange={(e) => setSponsorEmail(e.target.value)} />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="pledgeAmount">Amount per contribution (NGN)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₦</span>
                <Input id="pledgeAmount" type="number" placeholder="5000" value={amountPer} onChange={(e) => setAmountPer(e.target.value)} className="pl-8" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Frequency</Label>
              <Select value={frequency} onValueChange={(v) => setFrequency(v as PledgeFrequency)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="pledgeFirst">First intended date</Label>
              <Input id="pledgeFirst" type="date" value={firstDate} onChange={(e) => setFirstDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pledgeEnd">End date (optional)</Label>
              <Input id="pledgeEnd" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>

          {/* Projection */}
          {projection && projection.projectedCount > 0 && (
            <div className="rounded-lg border bg-muted/30 p-3 text-sm">
              <p className="font-medium">Projection by deadline</p>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between"><span className="text-muted-foreground">Payments</span><span>{projection.projectedCount}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Total pledged</span><span className="font-bold">{formatNaira(projection.projectedAmountKobo)}</span></div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">vs. gap</span>
                  <span className={projection.projectedAmountKobo >= summary.remainingGapKobo ? 'text-emerald-500 font-medium' : 'text-amber-500 font-medium'}>
                    {projection.projectedAmountKobo >= summary.remainingGapKobo ? 'Covers the gap!' : `${formatNairaShort(summary.remainingGapKobo - projection.projectedAmountKobo)} short`}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="pledgeNote">Encouragement note (optional)</Label>
            <Textarea id="pledgeNote" placeholder="A message of support..." value={note} onChange={(e) => setNote(e.target.value)} rows={2} maxLength={500} />
            <div className="flex items-start gap-2">
              <Checkbox id="pledgeNoteConsent" checked={noteConsent} onCheckedChange={(v) => setNoteConsent(v === true)} />
              <Label htmlFor="pledgeNoteConsent" className="cursor-pointer text-sm">I consent to my note being displayed publicly.</Label>
            </div>
          </div>

          {/* Reminders */}
          {sponsorEmail && (
            <div className="space-y-3 rounded-lg border p-3">
              <div className="flex items-start gap-2">
                <Checkbox id="reminderConsent" checked={reminderConsent} onCheckedChange={(v) => setReminderConsent(v === true)} />
                <Label htmlFor="reminderConsent" className="cursor-pointer text-sm">
                  Send me reminders before each intended contribution date
                </Label>
              </div>
              {reminderConsent && (
                <div className="space-y-2">
                  <Label>Reminder frequency</Label>
                  <Select value={reminderFreq} onValueChange={(v) => setReminderFreq(v as PledgeFrequency)}>
                    <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}

          <div className="rounded-lg bg-amber-500/5 px-3 py-2 text-xs text-muted-foreground">
            <strong>Pledge notice:</strong> A pledge is a commitment, not a payment. No money will be charged. You can pause or cancel at any time.
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={submitting} className="gradient-bg-blue text-white hover:opacity-90">
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm pledge
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
