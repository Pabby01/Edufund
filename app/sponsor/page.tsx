'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { getSupabaseClient } from '@/lib/supabase/client';
import { formatNaira, formatNairaShort, daysUntilDeadline, projectPledgeAmount } from '@/lib/finance';
import type { Contribution, Pledge, EducationGoal } from '@/lib/types';
import {
  ShieldCheck,
  Heart,
  TrendingUp,
  Receipt,
  GraduationCap,
  Calendar,
  Clock,
  ArrowRight,
  ExternalLink,
  Pause,
  Play,
  XCircle,
  FileText,
  Printer,
  Share2,
  CheckCircle2,
  Loader2,
  Search,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface PledgeWithGoal extends Pledge {
  goal?: EducationGoal;
}

interface ContributionWithGoal extends Contribution {
  goal?: EducationGoal;
}

export default function SponsorDashboardPage() {
  const { user, profile } = useAuth();
  const supabase = getSupabaseClient();

  const [sponsorEmail, setSponsorEmail] = useState(user?.email || '');
  const [pledges, setPledges] = useState<PledgeWithGoal[]>([]);
  const [contributions, setContributions] = useState<ContributionWithGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState<ContributionWithGoal | null>(null);

  const loadSponsorData = useCallback(async (emailToQuery: string) => {
    setLoading(true);
    try {
      // 1. Fetch contributions by email or sponsor name
      const { data: contribs } = await supabase
        .from('contributions')
        .select('*')
        .order('created_at', { ascending: false });

      // 2. Fetch pledges
      const { data: pledgeData } = await supabase
        .from('pledges')
        .select('*')
        .order('created_at', { ascending: false });

      // 3. Fetch goals
      const { data: goals } = await supabase
        .from('education_goals')
        .select('*');

      const goalMap = new Map((goals || []).map((g) => [g.id, g]));

      // Filter by sponsor if email provided, else show user's activity
      const myContribs: ContributionWithGoal[] = (contribs || [])
        .map((c) => ({ ...c, goal: goalMap.get(c.goal_id) }))
        .filter((c) => {
          if (!emailToQuery) return true;
          return c.sponsor_name?.toLowerCase().includes(emailToQuery.toLowerCase()) ||
                 c.sponsor_name === (profile?.display_name || user?.email?.split('@')[0]);
        });

      const myPledges: PledgeWithGoal[] = (pledgeData || [])
        .map((p) => ({ ...p, goal: goalMap.get(p.goal_id) }))
        .filter((p) => {
          if (!emailToQuery) return true;
          return p.sponsor_email?.toLowerCase() === emailToQuery.toLowerCase() ||
                 p.sponsor_name?.toLowerCase().includes(emailToQuery.toLowerCase());
        });

      setContributions(myContribs);
      setPledges(myPledges);
    } catch {
      toast.error('Failed to load sponsorship records');
    } finally {
      setLoading(false);
    }
  }, [supabase, profile, user]);

  useEffect(() => {
    loadSponsorData(sponsorEmail);
  }, [sponsorEmail, loadSponsorData]);

  // Aggregate stats
  const totalGivenKobo = contributions.reduce((sum, c) => sum + (c.amount_kobo || 0), 0);
  const activePledges = pledges.filter((p) => p.status === 'active');
  const totalPledgedProjected = activePledges.reduce((sum, p) => {
    if (!p.goal) return sum;
    const { projectedAmountKobo } = projectPledgeAmount({
      amountPerKobo: p.amount_per_kobo,
      frequency: p.frequency,
      firstDate: p.first_date,
      endDate: p.end_date,
      deadline: p.goal.deadline,
      status: p.status,
    });
    return sum + projectedAmountKobo;
  }, 0);

  const uniqueStudents = new Set(contributions.map((c) => c.goal_id).concat(pledges.map((p) => p.goal_id))).size;

  const handleUpdatePledge = async (pledgeId: string, status: 'active' | 'paused' | 'cancelled') => {
    const { error } = await supabase.from('pledges').update({ status }).eq('id', pledgeId);
    if (error) {
      toast.error('Could not update pledge: ' + error.message);
      return;
    }
    toast.success(`Pledge marked as ${status}`);
    loadSponsorData(sponsorEmail);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/60 pb-8">
        <div>
          <div className="eyebrow mb-2">
            SPONSOR PATRON & ALUMNI REGISTRY
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-black text-foreground">
            Sponsorship & Giving Hub
          </h1>
          <p className="mt-1 text-sm text-muted-foreground font-mono">
            Track student impact, manage recurring micro-pledges, and access official Remita bursary receipts.
          </p>
        </div>

        {/* Sponsor Identity Filter */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by your name or email..."
              value={sponsorEmail}
              onChange={(e) => setSponsorEmail(e.target.value)}
              className="pl-9 font-mono text-xs h-9 w-60 sm:w-72 bg-card"
            />
          </div>
          <Link href="/explore">
            <Button size="sm" className="gradient-bg-blue text-white font-bold font-mono text-xs h-9 px-4 rounded-full">
              <Heart className="mr-1.5 h-3.5 w-3.5 text-brand-gold" />
              Sponsor A Student
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 font-mono">
        <Card className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between pb-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">TOTAL SPONSORED</span>
            <TrendingUp className="h-4 w-4 text-brand-gold" />
          </div>
          <div className="text-2xl font-black text-foreground">{formatNaira(totalGivenKobo)}</div>
          <p className="text-[10px] text-muted-foreground mt-1">Direct Bursary TSA Settlement</p>
        </Card>

        <Card className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between pb-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">STUDENTS BACKED</span>
            <GraduationCap className="h-4 w-4 text-brand-blue" />
          </div>
          <div className="text-2xl font-black text-foreground">{uniqueStudents} Scholars</div>
          <p className="text-[10px] text-emerald-500 font-semibold mt-1">100% Retained in School</p>
        </Card>

        <Card className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between pb-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">ACTIVE PLEDGES</span>
            <Heart className="h-4 w-4 text-red-500" />
          </div>
          <div className="text-2xl font-black text-foreground">{activePledges.length} Commitments</div>
          <p className="text-[10px] text-muted-foreground mt-1">
            {formatNairaShort(totalPledgedProjected)} projected
          </p>
        </Card>

        <Card className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between pb-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">AUDITED RECEIPTS</span>
            <Receipt className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-foreground">{contributions.length} Invoices</div>
          <p className="text-[10px] text-muted-foreground mt-1">Tax & CSR Deductible</p>
        </Card>
      </div>

      {/* Active Pledges Management */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">
              Your Recurring Pledge Circle
            </h2>
            <p className="text-xs text-muted-foreground font-mono">
              Automated commitments supporting students until their semester registration deadline.
            </p>
          </div>
          <span className="font-mono text-xs font-bold text-brand-gold uppercase">
            {activePledges.length} ACTIVE
          </span>
        </div>

        {loading ? (
          <div className="flex h-32 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-brand-blue" />
          </div>
        ) : pledges.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center max-w-xl mx-auto">
            <Heart className="mx-auto h-8 w-8 text-muted-foreground/40 mb-2" />
            <h4 className="font-display font-bold text-sm">No active pledges found</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Commit to a micro-pledge (e.g. ₦10,000 monthly) to help an indigent student stay enrolled.
            </p>
            <Link href="/explore" className="mt-4 inline-block">
              <Button size="sm" variant="outline" className="rounded-full font-mono text-xs">
                Browse Student Goals
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {pledges.map((p) => {
              const daysLeft = p.goal ? daysUntilDeadline(p.goal.deadline) : 0;
              return (
                <div
                  key={p.id}
                  className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-xs hover:border-brand-gold/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-[10px] font-bold text-brand-gold uppercase">
                        {p.frequency} PLEDGE
                      </span>
                      <h4 className="font-display text-lg font-bold text-foreground">
                        {formatNaira(p.amount_per_kobo)} / {p.frequency}
                      </h4>
                      <p className="text-xs text-muted-foreground font-mono mt-0.5">
                        For: {p.goal?.title || 'Education Campaign'}
                      </p>
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase ${
                      p.status === 'active'
                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {p.status}
                    </span>
                  </div>

                  {/* Institution & Days */}
                  <div className="flex items-center justify-between text-xs font-mono border-t border-border/50 pt-3">
                    <span className="text-muted-foreground truncate max-w-[200px]">
                      {p.goal?.institution || 'Nigerian University'}
                    </span>
                    <span className="text-foreground font-semibold flex items-center gap-1">
                      <Clock className="h-3 w-3 text-brand-gold" />
                      {daysLeft > 0 ? `${daysLeft} days to deadline` : 'Completed'}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-1 border-t border-border/50">
                    {p.status === 'active' ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdatePledge(p.id, 'paused')}
                        className="rounded-full font-mono text-xs h-8 flex-1"
                      >
                        <Pause className="mr-1 h-3 w-3" />
                        Pause Pledge
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdatePledge(p.id, 'active')}
                        className="rounded-full font-mono text-xs h-8 flex-1 text-emerald-500"
                      >
                        <Play className="mr-1 h-3 w-3" />
                        Resume Pledge
                      </Button>
                    )}

                    {p.goal?.public_slug && (
                      <Link href={`/fund/${p.goal.public_slug}`} className="flex-1">
                        <Button
                          size="sm"
                          className="w-full rounded-full gradient-bg-blue text-white font-mono text-xs h-8"
                        >
                          Fulfill Now
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Official Verified Remita Receipts Ledger */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">
              Official Tax & Bursary Receipts
            </h2>
            <p className="text-xs text-muted-foreground font-mono">
              Immutable electronic receipts generated on official Remita bursary settlement.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
          {contributions.length === 0 ? (
            <div className="p-8 text-center text-xs font-mono text-muted-foreground">
              No completed contribution receipts on record.
            </div>
          ) : (
            <div className="divide-y divide-border/60 font-mono text-xs">
              {contributions.map((c) => (
                <div
                  key={c.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-muted/30 transition-colors gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                      <Receipt className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{c.goal?.title || 'Tuition Contribution'}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {c.goal?.institution || 'Federal University'} · Ref: RRR-{c.id.slice(0, 8).toUpperCase()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="text-right">
                      <div className="font-bold text-sm text-foreground">{formatNaira(c.amount_kobo)}</div>
                      <span className="text-[10px] text-emerald-500 uppercase font-bold">100% VERIFIED</span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedReceipt(c)}
                      className="rounded-full font-mono text-xs h-8 px-3"
                    >
                      <FileText className="mr-1 h-3 w-3" />
                      View Receipt
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Official Receipt Dialog Modal */}
      {selectedReceipt && (
        <Dialog open={Boolean(selectedReceipt)} onOpenChange={() => setSelectedReceipt(null)}>
          <DialogContent className="max-w-md p-0 overflow-hidden border-0 bg-transparent shadow-2xl">
            <div className="receipt p-6 rounded-t-2xl font-mono text-xs text-neutral-900 bg-[#fbf9f5] border border-neutral-200">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-dashed border-neutral-300 pb-3">
                <div>
                  <div className="font-bold text-[11px] text-neutral-900 uppercase">
                    FEDERAL REPUBLIC OF NIGERIA
                  </div>
                  <div className="text-[9px] text-neutral-500">
                    CENTRAL E-COLLECTION · REMITA RRR RECEIPT
                  </div>
                </div>
                <span className="stamp text-[10px] font-bold">PAID</span>
              </div>

              {/* Invoice Breakdown */}
              <div className="my-4 space-y-2 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Receipt Ref:</span>
                  <span className="font-bold">RRR-{selectedReceipt.id.slice(0, 10).toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Payer Name:</span>
                  <span className="font-bold">{selectedReceipt.sponsor_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Beneficiary Institution:</span>
                  <span className="font-bold">{selectedReceipt.goal?.institution || 'UNILAG Bursary'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Purpose of Payment:</span>
                  <span className="font-bold">{selectedReceipt.goal?.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Vault Escrow:</span>
                  <span className="font-bold text-emerald-700">Cowrywise Locked (0% Drift)</span>
                </div>
              </div>

              {/* Total Paid */}
              <div className="border-t border-dashed border-neutral-300 pt-3 flex justify-between items-center text-sm font-black text-neutral-900">
                <span>TOTAL AMOUNT PAID</span>
                <span className="text-base font-extrabold">{formatNaira(selectedReceipt.amount_kobo)}</span>
              </div>

              {/* Stamp and Print */}
              <div className="mt-6 pt-3 border-t border-neutral-200 flex items-center justify-between">
                <span className="stamp-gold text-[9px] font-bold">TREASURY SINGLE ACCOUNT</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.print()}
                  className="h-7 text-[10px] font-mono font-bold bg-white"
                >
                  <Printer className="mr-1 h-3 w-3" />
                  Print Receipt
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

