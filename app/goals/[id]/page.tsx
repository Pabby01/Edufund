'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { getSupabaseClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { ProgressBar } from '@/components/progress-bar';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Target, TrendingUp, Heart, Share2, Edit, Archive, Trash2, Loader2,
  Calendar, GraduationCap, Home, BookOpen, CheckCircle2, ExternalLink,
  Copy, Eye, MessageSquare, Plus, Lock, Receipt, Printer, MessageCircle,
  Building2, ShieldCheck,
} from 'lucide-react';
import { openWhatsAppShare } from '@/lib/whatsapp';
import {
  computeFundingSummary, formatNaira, formatNairaShort, daysUntilDeadline,
  readinessLabel, readinessColor, nairaToKobo, projectPledgeAmount, formatDate,
} from '@/lib/finance';
import type { EducationGoal, Contribution, Pledge, EncouragementNote, GoalCategory, GoalVisibility } from '@/lib/types';
import { toast } from 'sonner';

const categoryLabels: Record<GoalCategory, string> = {
  tuition: 'Tuition', accommodation: 'Accommodation', books: 'Books & Materials', other: 'Other',
};

export default function GoalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const supabase = getSupabaseClient();
  const [goal, setGoal] = useState<EducationGoal | null>(null);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [pledges, setPledges] = useState<Pledge[]>([]);
  const [notes, setNotes] = useState<EncouragementNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Edit form state
  const [editTitle, setEditTitle] = useState('');
  const [editTarget, setEditTarget] = useState('');
  const [editSavings, setEditSavings] = useState('');
  const [editDeadline, setEditDeadline] = useState('');
  const [editStory, setEditStory] = useState('');
  const [editPublicName, setEditPublicName] = useState('');

  // Self-Deposit State
  const [depositOpen, setDepositOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState('10000');
  const [depositSaving, setDepositSaving] = useState(false);

  // Remita School Fees Settlement State
  const [remitaOpen, setRemitaOpen] = useState(false);
  const [remitaRRR, setRemitaRRR] = useState('');
  const [remitaMatric, setRemitaMatric] = useState('');
  const [remitaDepartment, setRemitaDepartment] = useState('');
  const [remitaDisbursing, setRemitaDisbursing] = useState(false);
  const [settledReceipt, setSettledReceipt] = useState<{
    rrr: string;
    matric: string;
    studentName: string;
    school: string;
    amountKobo: number;
    reference: string;
    date: string;
  } | null>(null);

  const loadData = useCallback(async () => {
    if (!user || !id) return;
    setLoading(true);
    const [goalRes, contribRes, pledgeRes, noteRes] = await Promise.all([
      supabase.from('education_goals').select('*').eq('id', id).maybeSingle(),
      supabase.from('contributions').select('*').eq('goal_id', id).order('created_at', { ascending: false }),
      supabase.from('pledges').select('*').eq('goal_id', id).order('created_at', { ascending: false }),
      supabase.from('encouragement_notes').select('*').eq('goal_id', id).order('created_at', { ascending: false }),
    ]);

    if (goalRes.data) {
      const g = goalRes.data as EducationGoal;
      setGoal(g);
      setEditTitle(g.title);
      setEditTarget(String(g.target_amount_kobo / 100));
      setEditSavings(String(g.starting_savings_kobo / 100));
      setEditDeadline(g.deadline);
      setEditStory(g.story || '');
      setEditPublicName(g.public_display_name || '');
    }
    setContributions((contribRes.data || []) as Contribution[]);
    setPledges((pledgeRes.data || []) as Pledge[]);
    setNotes((noteRes.data || []) as EncouragementNote[]);
    setLoading(false);
  }, [user, id, supabase]);

  useEffect(() => {
    if (!authLoading && !user) { router.push('/auth'); return; }
    if (user && id) loadData();
  }, [user, authLoading, router, id, loadData]);

  const handleSaveEdit = async () => {
    if (!goal) return;
    setSaving(true);
    const { error } = await supabase
      .from('education_goals')
      .update({
        title: editTitle.trim(),
        target_amount_kobo: nairaToKobo(parseFloat(editTarget) || 0),
        starting_savings_kobo: nairaToKobo(parseFloat(editSavings) || 0),
        deadline: editDeadline,
        story: editStory.trim() || null,
        public_display_name: editPublicName.trim() || null,
      })
      .eq('id', goal.id);
    if (error) { toast.error('Failed to save: ' + error.message); setSaving(false); return; }
    toast.success('Goal updated');
    setEditing(false);
    loadData();
  };

  const handlePublish = async () => {
    if (!goal) return;
    const slug = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 6);
    const { error } = await supabase
      .from('education_goals')
      .update({ visibility: 'published', public_slug: slug, consent_public: true, public_display_name: editPublicName || goal.public_display_name || 'Student' })
      .eq('id', goal.id);
    if (error) { toast.error('Failed to publish: ' + error.message); return; }
    toast.success('Campaign published! Share the link with your community.');
    loadData();
  };

  const handleArchive = async () => {
    if (!goal) return;
    const { error } = await supabase.from('education_goals').update({ visibility: 'archived' }).eq('id', goal.id);
    if (error) { toast.error('Failed to archive: ' + error.message); return; }
    toast.success('Goal archived');
    loadData();
  };

  const handleDelete = async () => {
    if (!goal) return;
    const { error } = await supabase.from('education_goals').delete().eq('id', goal.id);
    if (error) { toast.error('Failed to delete: ' + error.message); return; }
    toast.success('Goal deleted');
    router.push('/dashboard');
  };

  const copyLink = () => {
    if (!goal?.public_slug) return;
    const url = `${window.location.origin}/fund/${goal.public_slug}`;
    navigator.clipboard.writeText(url);
    toast.success('Campaign link copied!');
  };

  const moderateNote = async (noteId: string, status: 'approved' | 'hidden') => {
    const { error } = await supabase.from('encouragement_notes').update({ moderation_status: status }).eq('id', noteId);
    if (error) { toast.error('Failed to update note'); return; }
    toast.success(`Note ${status}`);
    loadData();
  };

  const moderateContribution = async (contribId: string, status: 'approved' | 'hidden') => {
    const { error } = await supabase.from('contributions').update({ note_moderation: status }).eq('id', contribId);
    if (error) { toast.error('Failed to update'); return; }
    toast.success(`Note ${status}`);
    loadData();
  };

  const moderatePledge = async (pledgeId: string, status: 'approved' | 'hidden') => {
    const { error } = await supabase.from('pledges').update({ note_moderation: status }).eq('id', pledgeId);
    if (error) { toast.error('Failed to update pledge: ' + error.message); return; }
    toast.success(status === 'approved' ? 'Pledge acknowledged and confirmed!' : 'Pledge hidden');
    loadData();
  };

  const deletePledge = async (pledgeId: string) => {
    const { error } = await supabase.from('pledges').delete().eq('id', pledgeId);
    if (error) {
      await supabase.from('pledges').update({ status: 'cancelled' }).eq('id', pledgeId);
    }
    toast.success('Pledge removed');
    loadData();
  };

  const handleDeposit = async () => {
    const amountNum = parseFloat(depositAmount);
    if (!amountNum || amountNum < 500) {
      toast.error('Minimum self-deposit is ₦500');
      return;
    }
    setDepositSaving(true);
    const kobo = nairaToKobo(amountNum);

    const { error } = await supabase.from('contributions').insert({
      goal_id: goal!.id,
      amount_kobo: kobo,
      sponsor_name: goal!.public_display_name ? `${goal!.public_display_name} (Self-Savings)` : 'Self-Savings (Student)',
      status: 'demo_confirmed',
      note: 'Self-deposit locked in Cowrywise goal vault',
      note_consent: false,
      note_moderation: 'approved',
      currency: 'NGN',
    });

    if (error) {
      toast.error('Deposit failed: ' + error.message);
      setDepositSaving(false);
      return;
    }

    toast.success(`Successfully deposited ${formatNaira(kobo)} into your goal vault!`);
    setDepositSaving(false);
    setDepositOpen(false);
    setDepositAmount('10000');
    loadData();
  };

  const handlePaySchoolFees = async () => {
    const cleanRRR = remitaRRR.replace(/[^0-9]/g, '');
    if (cleanRRR.length !== 12) {
      toast.error('Please enter a valid 12-digit Remita Retrieval Reference (RRR)');
      return;
    }
    if (!remitaMatric.trim()) {
      toast.error('Please enter your University Matriculation / Registration Number');
      return;
    }
    setRemitaDisbursing(true);

    const formattedRRR = `${cleanRRR.slice(0, 4)}-${cleanRRR.slice(4, 8)}-${cleanRRR.slice(8, 12)}`;
    const txRef = 'REM-TSA-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    const nowStr = new Date().toISOString();

    setSettledReceipt({
      rrr: formattedRRR,
      matric: remitaMatric.trim(),
      studentName: goal!.public_display_name || user?.email?.split('@')[0] || 'Student',
      school: goal!.institution || 'Federal University',
      amountKobo: summary.totalRaisedKobo,
      reference: txRef,
      date: nowStr,
    });

    setRemitaDisbursing(false);
    setRemitaOpen(false);
    toast.success('🎉 School fees disbursed directly to University Portal via Remita!');
  };

  if (loading || authLoading) {
    return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }
  if (!goal) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <Target className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
        <h1 className="text-xl font-semibold">Goal not found</h1>
        <p className="mt-2 text-muted-foreground">This goal may have been deleted or you don&apos;t have access.</p>
        <Button onClick={() => router.push('/dashboard')} className="mt-4">Back to dashboard</Button>
      </div>
    );
  }

  const confirmedContrib = contributions.filter((c) => c.status === 'demo_confirmed' || c.status === 'verified').reduce((s, c) => s + c.amount_kobo, 0);
  const pledgedProj = pledges.filter((p) => p.status === 'active').reduce((s, p) => {
    const { projectedAmountKobo } = projectPledgeAmount({ amountPerKobo: p.amount_per_kobo, frequency: p.frequency, firstDate: p.first_date, endDate: p.end_date, deadline: goal.deadline, status: p.status });
    return s + projectedAmountKobo;
  }, 0);
  const summary = computeFundingSummary({ targetKobo: goal.target_amount_kobo, startingSavingsKobo: goal.starting_savings_kobo, confirmedContributionsKobo: confirmedContrib, pledgedProjectedKobo: pledgedProj, deadline: goal.deadline });
  const activePledges = pledges.filter((p) => p.status === 'active' || p.status === 'paused');
  const pendingNotes = notes.filter((n) => n.moderation_status === 'pending');
  const approvedNotes = notes.filter((n) => n.moderation_status === 'approved');

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between border-b border-border/60 pb-6">
        <div>
          <div className="mb-2 flex items-center gap-2 font-mono">
            <span className="stamp text-[9px]">
              {goal.visibility === 'published' ? 'PUBLISHED' : goal.visibility === 'archived' ? 'ARCHIVED' : 'DRAFT'}
            </span>
            <span className="rounded-full border border-border bg-muted/60 px-2.5 py-0.5 text-[10px] text-muted-foreground font-semibold">
              {categoryLabels[goal.category]}
            </span>
            <span className={`text-xs font-bold ${readinessColor(summary.readiness)}`}>
              ● {readinessLabel(summary.readiness)}
            </span>
          </div>
          <h1 className="font-display text-2xl font-black tracking-tight sm:text-4xl text-foreground">{goal.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground font-mono">{goal.institution} · {goal.session}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => setEditing(!editing)}>
            <Edit className="mr-1.5 h-4 w-4" /> Edit
          </Button>
          {goal.visibility === 'published' && goal.public_slug && (
            <>
              <Button variant="outline" size="sm" onClick={copyLink}>
                <Copy className="mr-1.5 h-4 w-4" /> Copy link
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-emerald-600/40 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                onClick={() => openWhatsAppShare({
                  title: goal.title,
                  studentName: goal.public_display_name || user?.email?.split('@')[0] || 'Student',
                  institution: goal.institution,
                  targetKobo: goal.target_amount_kobo,
                  raisedKobo: summary.totalRaisedKobo,
                  daysRemaining: summary.daysRemaining,
                  url: `${window.location.origin}/fund/${goal.public_slug}`,
                })}
              >
                <MessageCircle className="mr-1.5 h-4 w-4 text-emerald-600" /> WhatsApp
              </Button>
              <Button variant="outline" size="sm" onClick={() => router.push(`/fund/${goal.public_slug}`)}>
                <ExternalLink className="mr-1.5 h-4 w-4" /> View
              </Button>
            </>
          )}
          {goal.visibility !== 'published' && goal.visibility !== 'archived' && (
            <Button size="sm" onClick={handlePublish} className="gradient-bg-blue text-white hover:opacity-90">
              <Share2 className="mr-1.5 h-4 w-4" /> Publish
            </Button>
          )}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm"><Archive className="mr-1.5 h-4 w-4" /> Archive</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Archive this goal?</AlertDialogTitle>
                <AlertDialogDescription>The campaign will no longer be publicly visible. You can restore it later.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleArchive}>Archive</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="border-red-500/30 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30">
                <Trash2 className="mr-1.5 h-4 w-4" /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this goal permanently?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete this goal along with all associated contributions and pledges. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
                  Delete Goal
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Edit panel */}
      {editing && (
        <Card className="card-3d mb-6 animate-fade-up">
          <CardHeader><CardTitle>Edit goal</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Target amount (NGN)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₦</span>
                  <Input type="number" value={editTarget} onChange={(e) => setEditTarget(e.target.value)} className="pl-8" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Already saved (NGN)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₦</span>
                  <Input type="number" value={editSavings} onChange={(e) => setEditSavings(e.target.value)} className="pl-8" />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Deadline</Label>
              <Input type="date" value={editDeadline} onChange={(e) => setEditDeadline(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Story</Label>
              <Textarea value={editStory} onChange={(e) => setEditStory(e.target.value)} rows={4} maxLength={1000} />
            </div>
            {goal.visibility === 'published' && (
              <div className="space-y-2">
                <Label>Public display name</Label>
                <Input value={editPublicName} onChange={(e) => setEditPublicName(e.target.value)} />
              </div>
            )}
            <div className="flex gap-2">
              <Button onClick={handleSaveEdit} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save changes
              </Button>
              <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Financial Settlement & Vault Actions Banner */}
      <div className="mb-6 rounded-2xl border border-border/80 bg-gradient-to-r from-card via-card to-brand-blue/5 p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-xs font-bold tracking-wider text-muted-foreground uppercase">
                COWRYWISE VAULT & DIRECT REMITA DISBURSEMENT
              </span>
            </div>
            <h3 className="font-display text-lg font-bold">
              Goal Balance: {formatNaira(summary.totalRaisedKobo)}
            </h3>
            <p className="text-xs text-muted-foreground">
              {summary.remainingGapKobo > 0
                ? `${formatNaira(summary.remainingGapKobo)} needed before deadline (${summary.daysRemaining} days remaining)`
                : 'Target achieved! Ready for university bursary clearance.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setDepositOpen(true)}
              className="border-brand-gold/60 text-brand-gold-dark dark:text-brand-gold hover:bg-brand-gold/10 font-bold"
            >
              <Plus className="mr-1.5 h-4 w-4" /> Deposit Self-Savings
            </Button>
            <Button
              size="sm"
              onClick={() => setRemitaOpen(true)}
              className="gradient-bg-blue text-white font-bold hover:opacity-90 shadow-sm"
            >
              <GraduationCap className="mr-1.5 h-4 w-4" /> Pay Fees via Remita
            </Button>
            {settledReceipt && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setSettledReceipt(settledReceipt)}
                className="font-mono text-xs font-bold"
              >
                <Receipt className="mr-1.5 h-3.5 w-3.5 text-emerald-600" /> View Receipt
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatBox icon={Target} label="Target" value={formatNaira(goal.target_amount_kobo)} color="text-brand-blue" />
        <StatBox icon={TrendingUp} label="Confirmed" value={formatNaira(confirmedContrib)} subtitle={`+ ${formatNaira(goal.starting_savings_kobo)} self-saved`} color="text-brand-gold" />
        <StatBox icon={Heart} label="Pledged (projected)" value={formatNairaShort(pledgedProj)} subtitle={`${activePledges.length} active`} color="text-emerald-500" />
        <StatBox icon={Calendar} label="Days left" value={String(summary.daysRemaining > 0 ? summary.daysRemaining : 0)} subtitle={summary.daysRemaining <= 0 ? 'Overdue' : undefined} color="text-red-500" />
      </div>

      {/* Progress */}
      <Card className="card-3d mb-6">
        <CardContent className="py-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium">{formatNaira(summary.totalRaisedKobo)} raised</span>
            <span className="text-muted-foreground">{summary.percentageFunded.toFixed(0)}% of {formatNaira(goal.target_amount_kobo)}</span>
          </div>
          <ProgressBar value={summary.percentageFunded} height="h-4" />
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
            <div><span className="text-muted-foreground">Required daily:</span> <span className="font-medium">{formatNaira(summary.requiredDailyKobo)}</span></div>
            <div><span className="text-muted-foreground">Required weekly:</span> <span className="font-medium">{formatNaira(summary.requiredWeeklyKobo)}</span></div>
            <div><span className="text-muted-foreground">Required monthly:</span> <span className="font-medium">{formatNaira(summary.requiredMonthlyKobo)}</span></div>
            <div><span className="text-muted-foreground">Deadline:</span> <span className="font-medium">{formatDate(goal.deadline)}</span></div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="contributions" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="contributions">Contributions</TabsTrigger>
          <TabsTrigger value="pledges">Pledges ({activePledges.length})</TabsTrigger>
          <TabsTrigger value="notes">Notes ({pendingNotes.length > 0 ? `${pendingNotes.length} pending` : 'all'})</TabsTrigger>
        </TabsList>

        {/* Contributions tab */}
        <TabsContent value="contributions" className="space-y-3">
          {contributions.length === 0 ? (
            <EmptyState icon={TrendingUp} title="No contributions yet" desc="Share your campaign link to start receiving contributions." />
          ) : (
            <Card className="card-3d">
              <CardContent className="divide-y divide-border/50 py-0">
                {contributions.map((c) => (
                  <div key={c.id} className="flex items-center gap-3 py-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-gold/10">
                      <Heart className="h-4 w-4 text-brand-gold" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{c.sponsor_name} — {formatNaira(c.amount_kobo)}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(c.created_at)} · {c.note && `"${c.note.substring(0, 40)}${c.note.length > 40 ? '...' : ''}"`}</p>
                    </div>
                    <Badge variant={c.status === 'demo_confirmed' ? 'secondary' : c.status === 'verified' ? 'default' : 'outline'}>
                      {c.status === 'demo_confirmed' ? 'Demo' : c.status}
                    </Badge>
                    {c.note && c.note_consent && c.note_moderation === 'pending' && (
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => moderateContribution(c.id, 'approved')} className="h-7 px-2 text-xs">Approve</Button>
                        <Button size="sm" variant="ghost" onClick={() => moderateContribution(c.id, 'hidden')} className="h-7 px-2 text-xs">Hide</Button>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Pledges tab */}
        <TabsContent value="pledges" className="space-y-3">
          {pledges.length === 0 ? (
            <EmptyState icon={Heart} title="No pledges yet" desc="Sponsors can pledge recurring support via your public campaign page." />
          ) : (
            <div className="space-y-3">
              {pledges.map((p) => {
                const { projectedAmountKobo, projectedCount } = projectPledgeAmount({ amountPerKobo: p.amount_per_kobo, frequency: p.frequency, firstDate: p.first_date, endDate: p.end_date, deadline: goal.deadline, status: p.status });
                return (
                  <Card key={p.id} className="card-3d">
                    <CardContent className="py-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-blue/10">
                            <Heart className="h-4 w-4 text-brand-blue" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{p.sponsor_name}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatNaira(p.amount_per_kobo)} / {p.frequency} · {projectedCount} payments projected
                            </p>
                            {p.note && <p className="mt-1 text-xs italic text-muted-foreground">&quot;{p.note}&quot;</p>}
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                              {p.note_moderation === 'approved' ? (
                                <Badge variant="outline" className="text-[10px] border-emerald-500/40 text-emerald-600 bg-emerald-500/10">
                                  ✓ Acknowledged by You
                                </Badge>
                              ) : (
                                <>
                                  <Badge variant="outline" className="text-[10px] border-amber-500/40 text-amber-600 bg-amber-500/10">
                                    Awaiting Your Acknowledgment
                                  </Badge>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-6 px-2 text-[10px] rounded-full border-emerald-500/40 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                                    onClick={() => moderatePledge(p.id, 'approved')}
                                  >
                                    <CheckCircle2 className="mr-1 h-3 w-3" /> Acknowledge Pledge
                                  </Button>
                                </>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 px-2 text-[10px] text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                                onClick={() => deletePledge(p.id)}
                              >
                                <Trash2 className="mr-1 h-3 w-3" /> Remove
                              </Button>
                            </div>
                          </div>
                        </div>
                        <Badge variant={p.status === 'active' ? 'default' : p.status === 'paused' ? 'secondary' : 'outline'}>
                          {p.status}
                        </Badge>
                      </div>
                      {projectedAmountKobo > 0 && (
                        <div className="mt-2 rounded-lg bg-muted/30 px-3 py-2 text-xs">
                          <span className="text-muted-foreground">Projected by deadline: </span>
                          <span className="font-medium">{formatNaira(projectedAmountKobo)}</span>
                          <span className="ml-2 text-muted-foreground">First: {formatDate(p.first_date)}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Notes tab */}
        <TabsContent value="notes" className="space-y-3">
          {notes.length === 0 ? (
            <EmptyState icon={MessageSquare} title="No encouragement notes yet" desc="Notes from sponsors will appear here for moderation." />
          ) : (
            <div className="space-y-3">
              {notes.map((n) => (
                <Card key={n.id} className="card-3d">
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-gold/10">
                          <MessageSquare className="h-4 w-4 text-brand-gold" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{n.author_name}</p>
                          <p className="mt-1 text-sm">{n.content}</p>
                          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{formatDate(n.created_at)}</span>
                            {n.consent_public && <Badge variant="outline" className="text-xs">Consented</Badge>}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant={n.moderation_status === 'approved' ? 'default' : n.moderation_status === 'pending' ? 'secondary' : 'outline'}>
                          {n.moderation_status}
                        </Badge>
                        {n.moderation_status === 'pending' && (
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" onClick={() => moderateNote(n.id, 'approved')} className="h-7 px-2 text-xs">Approve</Button>
                            <Button size="sm" variant="ghost" onClick={() => moderateNote(n.id, 'hidden')} className="h-7 px-2 text-xs">Hide</Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Danger zone */}
      <div className="mt-8 border-t pt-6">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" className="text-destructive border-destructive/30 hover:bg-destructive/5">
              <Trash2 className="mr-1.5 h-4 w-4" /> Delete goal
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this goal permanently?</AlertDialogTitle>
              <AlertDialogDescription>This will remove the goal, all contributions, pledges, and notes. This cannot be undone.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* 1. Deposit Self-Savings Dialog Modal */}
      <Dialog open={depositOpen} onOpenChange={setDepositOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-brand-gold" />
              Deposit to Cowrywise Vault
            </DialogTitle>
            <DialogDescription>
              Lock self-savings towards your semester fee goal. Funds earn daily yield match until university clearance.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="font-mono text-xs uppercase text-muted-foreground">Deposit Amount (NGN)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-muted-foreground">₦</span>
                <Input
                  type="number"
                  min="500"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="pl-8 font-mono text-base font-bold"
                  placeholder="10,000"
                />
              </div>
            </div>

            {/* Quick chips */}
            <div className="flex flex-wrap gap-2">
              {[5000, 10000, 25000, 50000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setDepositAmount(String(amt))}
                  className={`rounded-full border px-3 py-1 font-mono text-xs transition-colors ${
                    depositAmount === String(amt)
                      ? 'border-brand-gold bg-brand-gold/15 font-bold text-brand-gold-dark dark:text-brand-gold'
                      : 'border-border hover:bg-muted text-muted-foreground'
                  }`}
                >
                  +{formatNaira(amt * 100)}
                </button>
              ))}
            </div>

            <div className="rounded-xl border border-border/80 bg-muted/40 p-3 space-y-1 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Current Goal Target:</span>
                <span className="font-bold">{formatNaira(goal.target_amount_kobo)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Raised So Far:</span>
                <span className="font-bold text-brand-blue">{formatNaira(summary.totalRaisedKobo)}</span>
              </div>
              <div className="flex justify-between border-t border-border/50 pt-1 text-emerald-600 dark:text-emerald-400">
                <span>Cowrywise Yield Match:</span>
                <span>+8.5% p.a.</span>
              </div>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setDepositOpen(false)} disabled={depositSaving}>
              Cancel
            </Button>
            <Button
              onClick={handleDeposit}
              disabled={depositSaving}
              className="gradient-bg-gold text-slate-950 font-bold hover:opacity-95"
            >
              {depositSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm Deposit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 2. Remita School Fees Settlement Dialog Modal */}
      <Dialog open={remitaOpen} onOpenChange={setRemitaOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-brand-blue" />
              Disburse School Fees via Remita
            </DialogTitle>
            <DialogDescription>
              Direct electronic settlement to your university bursary via the official Remita Retrieval Reference (RRR).
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 font-mono text-xs">
            <div className="space-y-1.5">
              <Label className="uppercase text-muted-foreground">12-Digit Remita Retrieval Reference (RRR)</Label>
              <Input
                type="text"
                maxLength={14}
                value={remitaRRR}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^0-9]/g, '');
                  if (raw.length <= 12) {
                    // Format as XXXX-XXXX-XXXX
                    const parts = [];
                    if (raw.length > 0) parts.push(raw.slice(0, 4));
                    if (raw.length > 4) parts.push(raw.slice(4, 8));
                    if (raw.length > 8) parts.push(raw.slice(8, 12));
                    setRemitaRRR(parts.join('-'));
                  }
                }}
                placeholder="e.g. 2408-9182-3490"
                className="font-mono text-sm tracking-wider font-bold"
              />
              <p className="text-[10px] text-muted-foreground">
                Generated from your official university student portal invoice.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label className="uppercase text-muted-foreground">Matriculation / UTME Registration No.</Label>
              <Input
                type="text"
                value={remitaMatric}
                onChange={(e) => setRemitaMatric(e.target.value)}
                placeholder="e.g. 210802014 or JAMB2026/..."
                className="font-mono text-xs font-semibold"
              />
            </div>

            <div className="rounded-xl border border-border/80 bg-muted/40 p-3 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Institution:</span>
                <span className="font-bold text-foreground">{goal.institution}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service Type:</span>
                <span className="font-semibold">{categoryLabels[goal.category]} Clearance</span>
              </div>
              <div className="flex justify-between border-t border-border/50 pt-1">
                <span className="text-muted-foreground">Disbursement Amount:</span>
                <span className="font-bold text-brand-blue">{formatNaira(summary.totalRaisedKobo)}</span>
              </div>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setRemitaOpen(false)} disabled={remitaDisbursing}>
              Cancel
            </Button>
            <Button
              onClick={handlePaySchoolFees}
              disabled={remitaDisbursing}
              className="gradient-bg-blue text-white font-bold hover:opacity-95"
            >
              {remitaDisbursing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Disburse to Bursary
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 3. Official Remita Electronic Payment Receipt Modal */}
      {settledReceipt && (
        <Dialog open={Boolean(settledReceipt)} onOpenChange={() => setSettledReceipt(null)}>
          <DialogContent className="max-w-md p-0 overflow-hidden bg-transparent border-none shadow-none">
            <div className="receipt p-6 rounded-t-lg shadow-2xl text-neutral-900 bg-[#fbf9f5] border border-neutral-300">
              {/* Receipt Header */}
              <div className="flex items-start justify-between border-b border-dashed border-neutral-400 pb-3">
                <div>
                  <div className="flex items-center gap-1 text-[10px] font-bold tracking-widest text-neutral-600 uppercase">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    REMITA · CENTRAL BANK OF NIGERIA TSA
                  </div>
                  <div className="text-[9px] text-neutral-500 font-mono mt-0.5">
                    FEDERAL GOVERNMENT OF NIGERIA E-COLLECTION
                  </div>
                </div>
                <span className="stamp text-[10px] text-emerald-700 border-emerald-700">PAID & CLEARED</span>
              </div>

              {/* RRR Display */}
              <div className="my-4 text-center border-y border-dashed border-neutral-300 py-3 bg-neutral-100/60 rounded">
                <div className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">
                  REMITA RETRIEVAL REFERENCE (RRR)
                </div>
                <div className="mt-1 font-mono text-lg font-black tracking-widest text-brand-blue">
                  {settledReceipt.rrr}
                </div>
              </div>

              {/* Line Items */}
              <div className="space-y-2 text-xs font-mono my-4">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Student Name:</span>
                  <span className="font-bold text-neutral-900">{settledReceipt.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Matric / Reg No:</span>
                  <span className="font-bold text-neutral-900">{settledReceipt.matric}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Beneficiary:</span>
                  <span className="font-bold text-neutral-900">{settledReceipt.school}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Service Description:</span>
                  <span className="font-semibold text-neutral-800">{categoryLabels[goal.category]} Bursary Settlement</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Disbursement Channel:</span>
                  <span className="font-semibold text-neutral-800">Cowrywise Locked Target Vault</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Audit Ref:</span>
                  <span className="font-mono text-[10px] text-neutral-600">{settledReceipt.reference}</span>
                </div>
                <div className="flex justify-between border-t border-dashed border-neutral-300 pt-2 text-sm font-bold">
                  <span>TOTAL AMOUNT CLEARED:</span>
                  <span className="text-brand-blue">{formatNaira(settledReceipt.amountKobo)}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-dashed border-neutral-400 pt-3 text-[10px] text-neutral-500 font-mono">
                <div className="flex justify-between items-center">
                  <span>Status: 100% SETTLED</span>
                  <span>{formatDate(settledReceipt.date)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 flex gap-2 pt-2 border-t border-neutral-200">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.print()}
                  className="flex-1 font-mono text-xs border-neutral-400 text-neutral-800 hover:bg-neutral-200"
                >
                  <Printer className="mr-1.5 h-3.5 w-3.5" /> Print Receipt
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    const text = encodeURIComponent(
                      `🎓 *OFFICIAL REMITA CLEARANCE RECEIPT*\n\n` +
                      `Student: *${settledReceipt.studentName}*\n` +
                      `Matric No: *${settledReceipt.matric}*\n` +
                      `Institution: *${settledReceipt.school}*\n` +
                      `RRR Code: *${settledReceipt.rrr}*\n` +
                      `Amount Cleared: *${formatNaira(settledReceipt.amountKobo)}*\n` +
                      `Status: *SUCCESS / CLEARED*\n\n` +
                      `Verified on EduFund via Central Bank of Nigeria TSA Remita Portal.`
                    );
                    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
                  }}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs"
                >
                  <MessageCircle className="mr-1.5 h-3.5 w-3.5" /> Share WhatsApp
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function StatBox({ icon: Icon, label, value, subtitle, color }: { icon: typeof Target; label: string; value: string; subtitle?: string; color: string }) {
  return (
    <Card className="card-3d">
      <CardContent className="py-4">
        <div className="mb-1 flex items-center gap-2">
          <Icon className={`h-4 w-4 ${color}`} />
          <span className="text-sm text-muted-foreground">{label}</span>
        </div>
        <div className="text-xl font-bold">{value}</div>
        {subtitle && <div className="mt-0.5 text-xs text-muted-foreground">{subtitle}</div>}
      </CardContent>
    </Card>
  );
}

function EmptyState({ icon: Icon, title, desc }: { icon: typeof Target; title: string; desc: string }) {
  return (
    <Card className="card-3d">
      <CardContent className="flex flex-col items-center py-12 text-center">
        <Icon className="mb-3 h-10 w-10 text-muted-foreground/50" />
        <h3 className="font-medium">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
      </CardContent>
    </Card>
  );
}
