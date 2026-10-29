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
import { Skeleton } from '@/components/ui/skeleton';
import {
  Target, TrendingUp, Heart, Share2, Edit, Archive, Trash2, Loader2,
  Calendar, GraduationCap, Home, BookOpen, CheckCircle2, ExternalLink,
  Copy, Eye, MessageSquare,
} from 'lucide-react';
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
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Badge variant={goal.visibility === 'published' ? 'default' : 'secondary'}>
              {goal.visibility === 'published' ? 'Published' : goal.visibility === 'archived' ? 'Archived' : 'Draft'}
            </Badge>
            <Badge variant="outline">{categoryLabels[goal.category]}</Badge>
            <span className={`text-sm font-medium ${readinessColor(summary.readiness)}`}>
              {readinessLabel(summary.readiness)}
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{goal.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{goal.institution} · {goal.session}</p>
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
