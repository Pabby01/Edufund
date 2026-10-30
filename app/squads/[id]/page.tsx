'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Users,
  ArrowLeft,
  ShieldCheck,
  Heart,
  TrendingUp,
  CheckCircle2,
  Lock,
  Share2,
  Sparkles,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getSupabaseClient } from '@/lib/supabase/client';
import { fetchSquadBySlug, pledgeToSquad } from '@/lib/squads';
import type { AlumniSquad } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { formatNaira, nairaToKobo } from '@/lib/finance';
import { toast } from 'sonner';

export default function SquadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const idOrSlug = (params?.id as string) || '';

  const [squad, setSquad] = useState<AlumniSquad | null>(null);
  const [loading, setLoading] = useState(true);
  const [pledgeOpen, setPledgeOpen] = useState(false);
  const [amount, setAmount] = useState('25000');
  const [donorName, setDonorName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [dbScholars, setDbScholars] = useState<any[]>([]);

  useEffect(() => {
    async function loadSquadAndScholars() {
      setLoading(true);
      const squadData = await fetchSquadBySlug(idOrSlug);
      setSquad(squadData);

      // Fetch real published student goals from this institution or generally
      const supabase = getSupabaseClient();
      let query = supabase.from('education_goals').select('*').eq('visibility', 'published').limit(6);
      if (squadData?.university) {
        query = query.ilike('institution', `%${squadData.university.split(' ')[0]}%`);
      }
      const { data } = await query;
      if (data && data.length > 0) {
        setDbScholars(
          data.map((g) => ({
            name: g.public_display_name || 'Verified Scholar',
            level: `${g.category.toUpperCase()} · ${g.institution || 'University'}`,
            targetKobo: g.target_amount_kobo,
            raisedKobo: g.starting_savings_kobo,
            slug: g.public_slug,
          }))
        );
      } else {
        // Fallback to any published goals in the DB
        const { data: generalGoals } = await supabase.from('education_goals').select('*').eq('visibility', 'published').limit(6);
        if (generalGoals) {
          setDbScholars(
            generalGoals.map((g) => ({
              name: g.public_display_name || 'Verified Scholar',
              level: `${g.category.toUpperCase()} · ${g.institution || 'University'}`,
              targetKobo: g.target_amount_kobo,
              raisedKobo: g.starting_savings_kobo,
              slug: g.public_slug,
            }))
          );
        }
      }
      setLoading(false);
    }

    if (idOrSlug) {
      loadSquadAndScholars();
    }
  }, [idOrSlug]);

  const handlePledgeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseInt(amount);
    if (!parsedAmount || parsedAmount < 1000) {
      toast.error('Minimum squad pledge is ₦1,000');
      return;
    }

    setSubmitting(true);
    const kobo = nairaToKobo(parsedAmount);

    await pledgeToSquad(squad?.slug || idOrSlug, kobo);

    // Update local view
    if (squad) {
      setSquad({
        ...squad,
        raised_amount_kobo: (squad.raised_amount_kobo || 0) + kobo,
        members_count: (squad.members_count || 1) + 1,
      });
    }

    setSubmitting(false);
    setPledgeOpen(false);
    toast.success(`🎉 Thank you ${donorName || 'Alumnus'}! Your ₦${parsedAmount.toLocaleString()} pledge was locked in the squad vault.`);
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
      </div>
    );
  }

  if (!squad) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center space-y-4">
        <Users className="mx-auto h-12 w-12 text-muted-foreground/40" />
        <h2 className="font-display text-2xl font-bold">Squad Not Found</h2>
        <p className="text-sm text-muted-foreground">
          The requested alumni squad could not be found or has not yet been registered.
        </p>
        <Link href="/squads" className="inline-block pt-2">
          <Button variant="outline" className="rounded-full font-mono text-xs">
            <ArrowLeft className="mr-2 h-4 w-4" /> Browse All Squads
          </Button>
        </Link>
      </div>
    );
  }

  const percent = Math.min(
    100,
    Math.round(((squad.raised_amount_kobo || 0) / (squad.target_amount_kobo || 1)) * 100)
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 space-y-10">
      {/* Breadcrumb Header */}
      <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span>/</span>
        <Link href="/squads" className="hover:text-foreground">Squads</Link>
        <span>/</span>
        <span className="text-foreground">{squad.name}</span>
      </div>

      {/* Main Squad Hero */}
      <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-10 shadow-lg space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-blue/30 bg-brand-blue/10 px-3 py-1 font-mono text-xs font-bold text-brand-blue uppercase">
              <Users className="h-3.5 w-3.5" />
              {squad.class_year || 'ALUMNI CLASS CHALLENGE'}
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-black text-foreground">
              {squad.name}
            </h1>
            <p className="font-mono text-xs text-muted-foreground">
              {squad.university} · {squad.faculty}
            </p>
          </div>

          <Button
            onClick={() => setPledgeOpen(true)}
            className="rounded-full gradient-bg-blue text-white font-mono text-xs font-bold px-6 h-10 shadow-md"
          >
            <Heart className="mr-1.5 h-4 w-4 text-brand-gold" />
            Contribute to Squad Pool
          </Button>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
          {squad.description}
        </p>

        {/* Progress Bar & Stats */}
        <div className="rounded-2xl border border-border/60 bg-muted/30 p-5 space-y-3 font-mono">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-base text-foreground">{formatNaira(squad.raised_amount_kobo || 0)} Pooled</span>
            <span className="text-muted-foreground">
              Target: {formatNaira(squad.target_amount_kobo)} ({percent}%)
            </span>
          </div>
          <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full gradient-bg-blue transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
          <div className="flex flex-wrap justify-between items-center text-[11px] text-muted-foreground pt-1">
            <span>{squad.members_count || 1} Contributing Classmates</span>
            <span className="text-emerald-500 font-bold">● Cowrywise Locked Vault</span>
            <span>Direct Remita Settlement</span>
          </div>
        </div>

        {/* Coordinator Info */}
        <div className="flex flex-wrap items-center justify-between text-xs font-mono border-t border-border/60 pt-4 text-muted-foreground">
          <span>Coordinator: <strong className="text-foreground">{squad.coordinator_name}</strong></span>
          {squad.coordinator_contact && (
            <span>Contact: <strong className="text-foreground">{squad.coordinator_contact}</strong></span>
          )}
        </div>
      </div>

      {/* Indigent Scholars Supported */}
      <div className="space-y-4">
        <h3 className="font-display text-2xl font-bold text-foreground">
          Indigent Scholars Supported by this Squad
        </h3>
        <p className="text-xs text-muted-foreground font-mono">
          Funds from this alumni pool are disbursed directly to university bursaries via Remita to settle tuition for verified scholars.
        </p>

        {dbScholars.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-xs font-mono text-muted-foreground">
            No scholars currently registered for this department. As students create verified goals, they will automatically appear here.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {dbScholars.map((sch, i) => {
              const p = Math.min(100, Math.round(((sch.raisedKobo || 0) / (sch.targetKobo || 1)) * 100));
              return (
                <div key={i} className="rounded-2xl border border-border bg-card p-5 space-y-3 shadow-xs font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">{sch.name}</span>
                    <span className="rounded bg-muted px-2 py-0.5 text-[10px] text-muted-foreground font-semibold">
                      {sch.level}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-muted-foreground">
                      <span>{formatNaira(sch.raisedKobo || 0)}</span>
                      <span>{p}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: `${p}%` }} />
                    </div>
                  </div>
                  {sch.slug && (
                    <Link
                      href={`/fund/${sch.slug}`}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-blue hover:text-brand-gold pt-1"
                    >
                      <span>View Full Campaign</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Contribute Modal */}
      <Dialog open={pledgeOpen} onOpenChange={setPledgeOpen}>
        <DialogContent className="max-w-md p-6">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold">
              Contribute to {squad.name}
            </DialogTitle>
            <DialogDescription className="font-mono text-xs">
              Your contribution is locked in the squad Cowrywise vault and disbursed via Remita to verified students in this department.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handlePledgeSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5 font-mono text-xs">
              <label className="text-muted-foreground uppercase font-bold">Your Name / Set Moniker</label>
              <input
                type="text"
                placeholder="e.g. Dapo (Tech Alumnus)"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm focus:outline-hidden focus:ring-1 focus:ring-brand-blue"
                required
              />
            </div>

            <div className="space-y-1.5 font-mono text-xs">
              <label className="text-muted-foreground uppercase font-bold">Pledge Amount (NGN)</label>
              <div className="grid grid-cols-4 gap-2 mb-2">
                {['10000', '25000', '50000', '100000'].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmount(amt)}
                    className={`rounded-lg py-1.5 font-bold transition-all ${
                      amount === amt
                        ? 'gradient-bg-blue text-white'
                        : 'border border-border bg-muted/60 text-muted-foreground'
                    }`}
                  >
                    ₦{(parseInt(amt) / 1000)}k
                  </button>
                ))}
              </div>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm focus:outline-hidden focus:ring-1 focus:ring-brand-blue"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full gradient-bg-blue text-white font-mono text-xs font-bold h-11"
            >
              {submitting ? 'Confirming with Cowrywise Vault...' : `Pledge ₦${parseInt(amount || '0').toLocaleString()} to Squad Pool`}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
