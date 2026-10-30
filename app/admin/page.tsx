'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
  Users, Plus, Trash2, ExternalLink,
} from 'lucide-react';
import { formatNaira, formatNairaShort, formatDate, daysUntilDeadline, nairaToKobo } from '@/lib/finance';
import type { EducationGoal, Contribution, Pledge, EncouragementNote, AlumniSquad } from '@/lib/types';
import { fetchAllSquads, createSquad, deleteSquad } from '@/lib/squads';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

export default function AdminPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const supabase = getSupabaseClient();

  const [goals, setGoals] = useState<EducationGoal[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [pledges, setPledges] = useState<Pledge[]>([]);
  const [notes, setNotes] = useState<EncouragementNote[]>([]);
  const [squads, setSquads] = useState<AlumniSquad[]>([]);
  const [loading, setLoading] = useState(true);

  // Create squad modal state
  const [createSquadOpen, setCreateSquadOpen] = useState(false);
  const [squadCreating, setSquadCreating] = useState(false);
  const [newSquadName, setNewSquadName] = useState('');
  const [newSquadUni, setNewSquadUni] = useState('');
  const [newSquadFaculty, setNewSquadFaculty] = useState('');
  const [newSquadYear, setNewSquadYear] = useState('');
  const [newSquadTarget, setNewSquadTarget] = useState('2000000');
  const [newSquadCoord, setNewSquadCoord] = useState('');
  const [newSquadCoordContact, setNewSquadCoordContact] = useState('');
  const [newSquadDesc, setNewSquadDesc] = useState('');

  const loadSquads = useCallback(async () => {
    const data = await fetchAllSquads();
    setSquads(data);
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    await loadSquads();

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
  }, [supabase, loadSquads]);

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

  const handleCreateSquad = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSquadName.trim() || !newSquadUni.trim() || !newSquadFaculty.trim() || !newSquadCoord.trim()) {
      toast.error('Please fill in all required squad fields');
      return;
    }

    const targetKobo = nairaToKobo(parseFloat(newSquadTarget) || 1000000);
    setSquadCreating(true);

    const { error } = await createSquad({
      name: newSquadName.trim(),
      university: newSquadUni.trim(),
      faculty: newSquadFaculty.trim(),
      class_year: newSquadYear.trim() || 'Alumni Set',
      target_amount_kobo: targetKobo,
      coordinator_name: newSquadCoord.trim(),
      coordinator_contact: newSquadCoordContact.trim() || undefined,
      description: newSquadDesc.trim() || `Alumni squad pooling funds for indigent scholars in ${newSquadFaculty.trim()}.`,
    });

    setSquadCreating(false);
    if (error) {
      toast.error('Failed to create squad: ' + error);
      return;
    }

    toast.success(`🎉 Squad "${newSquadName}" created successfully!`);
    setCreateSquadOpen(false);
    setNewSquadName('');
    setNewSquadUni('');
    setNewSquadFaculty('');
    setNewSquadYear('');
    setNewSquadTarget('2000000');
    setNewSquadCoord('');
    setNewSquadCoordContact('');
    setNewSquadDesc('');
    loadSquads();
  };

  const handleDeleteSquad = async (idOrSlug: string) => {
    await deleteSquad(idOrSlug);
    toast.success('Squad deleted successfully');
    loadSquads();
  };

  if (authLoading || (user && !profile)) {
    return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }
  if (!user || !profile?.is_admin) return null;

  const publishedGoals = goals.filter((g) => g.visibility === 'published');
  const draftGoals = goals.filter((g) => g.visibility === 'draft');

  const demoContribs = contributions.filter((c) => c.status === 'demo_confirmed');
  const verifiedContribs = contributions.filter((c) => c.status === 'verified');
  const pendingContribs = contributions.filter((c) => c.status === 'pending');

  const activePledges = pledges.filter((p) => p.status === 'active');
  const pendingNotes = notes.filter((n) => n.moderation_status === 'pending');
  const approvedNotes = notes.filter((n) => n.moderation_status === 'approved');

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
          Operator overview — campaigns, Remita disbursements, sponsor pledges, alumni squads, and message moderation.
        </p>
      </div>

      {/* Overview stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStat icon={Target} label="Total campaigns" value={String(goals.length)} sub={`${publishedGoals.length} live, ${draftGoals.length} draft`} color="text-brand-blue" loading={loading} />
        <AdminStat icon={TrendingUp} label="Contributions" value={String(contributions.length)} sub={`${demoContribs.length} demo, ${verifiedContribs.length} verified`} color="text-brand-gold" loading={loading} />
        <AdminStat icon={Heart} label="Pledges" value={String(pledges.length)} sub={`${activePledges.length} active`} color="text-emerald-500" loading={loading} />
        <AdminStat icon={Users} label="Alumni Squads" value={String(squads.length)} sub="Class challenge pools" color="text-purple-500" loading={loading} />
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
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="contributions">Contributions</TabsTrigger>
          <TabsTrigger value="pledges">Pledges</TabsTrigger>
          <TabsTrigger value="squads">Alumni Squads ({squads.length})</TabsTrigger>
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
                      <TableHead>Commitment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden sm:table-cell">Reminders</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pledges.slice(0, 20).map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.sponsor_name}</TableCell>
                        <TableCell>{formatNaira(p.amount_per_kobo)} / {p.frequency}</TableCell>
                        <TableCell>
                          <Badge variant={p.status === 'active' ? 'default' : 'secondary'}>{p.status}</Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-muted-foreground">
                          {p.reminder_consent ? `${p.reminder_frequency} (opted in)` : 'None'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Squads tab */}
        <TabsContent value="squads" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold">Alumni & Departmental Squads</h3>
              <p className="text-xs text-muted-foreground font-mono">
                Class sets and alumni circles pooling funds for indigent scholars in their alma mater.
              </p>
            </div>
            <Button
              onClick={() => setCreateSquadOpen(true)}
              className="rounded-full gradient-bg-blue text-white font-mono text-xs h-9 px-4 shadow-sm"
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" /> Create New Squad
            </Button>
          </div>

          <Card className="card-3d">
            <CardContent className="py-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Squad Name</TableHead>
                    <TableHead>University / Faculty</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Raised</TableHead>
                    <TableHead className="hidden sm:table-cell">Members</TableHead>
                    <TableHead className="hidden sm:table-cell">Coordinator</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {squads.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-xs text-muted-foreground">
                        No squads registered yet. Click &quot;Create New Squad&quot; above to add one.
                      </TableCell>
                    </TableRow>
                  ) : (
                    squads.map((sq) => {
                      const p = Math.min(100, Math.round(((sq.raised_amount_kobo || 0) / (sq.target_amount_kobo || 1)) * 100));
                      return (
                        <TableRow key={sq.id || sq.slug}>
                          <TableCell className="font-medium">
                            <div>
                              <span>{sq.name}</span>
                              <div className="text-[10px] text-muted-foreground font-mono">{sq.class_year || 'Alumni Set'}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs">
                            <div>{sq.university}</div>
                            <div className="text-[10px] text-muted-foreground">{sq.faculty}</div>
                          </TableCell>
                          <TableCell className="font-mono text-xs">{formatNairaShort(sq.target_amount_kobo)}</TableCell>
                          <TableCell className="font-mono text-xs">
                            <div className="flex items-center gap-2">
                              <span>{formatNairaShort(sq.raised_amount_kobo || 0)}</span>
                              <Badge variant="outline" className="text-[9px] px-1 py-0">{p}%</Badge>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell font-mono text-xs">{sq.members_count || 1}</TableCell>
                          <TableCell className="hidden sm:table-cell text-xs">{sq.coordinator_name}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <Link href={`/squads/${sq.slug || sq.id}`} target="_blank">
                                <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" title="View Public Squad">
                                  <ExternalLink className="h-3.5 w-3.5 text-brand-blue" />
                                </Button>
                              </Link>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button size="sm" variant="ghost" className="h-7 px-2 text-xs text-red-500 hover:text-red-600 hover:bg-red-50" title="Delete Squad">
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete squad &quot;{sq.name}&quot;?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will permanently remove the squad pool from the alumni registry. This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteSquad(sq.slug || sq.id)} className="bg-red-600 hover:bg-red-700 text-white">
                                      Delete Squad
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
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

      {/* Create Squad Dialog Modal */}
      <Dialog open={createSquadOpen} onOpenChange={setCreateSquadOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-brand-blue" />
              Create Alumni / Departmental Squad
            </DialogTitle>
            <DialogDescription>
              Set up a collective alumni challenge pool to fund indigent scholars in this university department.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSquad} className="space-y-4 pt-2">
            <div className="space-y-1.5 font-mono text-xs">
              <Label className="uppercase font-bold">Squad Name</Label>
              <Input
                placeholder="e.g. UNILAG Computer Science '20 Alumni Squad"
                value={newSquadName}
                onChange={(e) => setNewSquadName(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5 font-mono text-xs">
                <Label className="uppercase font-bold">University / Institution</Label>
                <Input
                  placeholder="e.g. University of Lagos (UNILAG)"
                  value={newSquadUni}
                  onChange={(e) => setNewSquadUni(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5 font-mono text-xs">
                <Label className="uppercase font-bold">Faculty / Department</Label>
                <Input
                  placeholder="e.g. Department of Computer Sciences"
                  value={newSquadFaculty}
                  onChange={(e) => setNewSquadFaculty(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5 font-mono text-xs">
                <Label className="uppercase font-bold">Class Set / Year</Label>
                <Input
                  placeholder="e.g. Class of 2020"
                  value={newSquadYear}
                  onChange={(e) => setNewSquadYear(e.target.value)}
                />
              </div>
              <div className="space-y-1.5 font-mono text-xs">
                <Label className="uppercase font-bold">Target Pool Amount (NGN)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono">₦</span>
                  <Input
                    type="number"
                    min="100000"
                    step="50000"
                    placeholder="2000000"
                    value={newSquadTarget}
                    onChange={(e) => setNewSquadTarget(e.target.value)}
                    className="pl-8"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5 font-mono text-xs">
                <Label className="uppercase font-bold">Coordinator Name</Label>
                <Input
                  placeholder="e.g. Engr. Dapo Alabi"
                  value={newSquadCoord}
                  onChange={(e) => setNewSquadCoord(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5 font-mono text-xs">
                <Label className="uppercase font-bold">Coordinator Contact (Email/Phone)</Label>
                <Input
                  placeholder="e.g. dapo@alumni.unilag.edu.ng"
                  value={newSquadCoordContact}
                  onChange={(e) => setNewSquadCoordContact(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5 font-mono text-xs">
              <Label className="uppercase font-bold">Mission / Description</Label>
              <Textarea
                placeholder="Describe how this squad supports indigent classmates and clears their tuition before deadline..."
                value={newSquadDesc}
                onChange={(e) => setNewSquadDesc(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                type="submit"
                disabled={squadCreating}
                className="flex-1 gradient-bg-blue text-white font-mono text-xs font-bold h-10"
              >
                {squadCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registering Squad...
                  </>
                ) : (
                  'Create Alumni Squad'
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateSquadOpen(false)}
                className="font-mono text-xs h-10"
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
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
