'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getSupabaseClient } from '@/lib/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { formatNaira } from '@/lib/finance';
import { toast } from 'sonner';

export default function SquadDetailPage() {
  const params = useParams();
  const id = (params?.id as string) || 'unilag-cs-18';
  const [pledgeOpen, setPledgeOpen] = useState(false);
  const [amount, setAmount] = useState('25000');
  const [donorName, setDonorName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [dbScholars, setDbScholars] = useState<any[]>([]);

  useEffect(() => {
    async function loadScholars() {
      const supabase = getSupabaseClient();
      const { data } = await supabase
        .from('education_goals')
        .select('*')
        .eq('visibility', 'published')
        .limit(6);
      if (data && data.length > 0) {
        setDbScholars(
          data.map((g) => ({
            name: g.public_display_name || 'Scholar',
            level: `${g.category.toUpperCase()} · ${g.institution?.split('(')[0] || 'Uni'}`,
            targetKobo: g.target_amount_kobo,
            raisedKobo: g.starting_savings_kobo,
            slug: g.public_slug,
          }))
        );
      }
    }
    loadScholars();
  }, []);

  // In production, sync with Supabase
  const squad = {
    id,
    name: "UNILAG Computer Science '18 Alumni Squad",
    university: 'University of Lagos (UNILAG)',
    faculty: 'Department of Computer Sciences',
    targetKobo: 250000000,
    raisedKobo: 185000000,
    membersCount: 28,
    coordinator: 'Engr. Dapo Alabi',
    description:
      'We are the UNILAG Computer Science graduating class of 2018. We pool monthly alumni micro-pledges to clear school fees and laboratory charges for indigent undergraduates before portal closure.',
    scholars: [
      { name: 'Amina Bello', level: '400L CS', targetKobo: 38000000, raisedKobo: 26000000, slug: 'amina-bello-unilag-cs' },
      { name: 'Femi Adekunle', level: '300L CS', targetKobo: 18000000, raisedKobo: 18000000, slug: 'femi-adekunle-unilag' },
      { name: 'Blessing Okafor', level: '200L CS', targetKobo: 19500000, raisedKobo: 14500000, slug: 'blessing-okafor-unilag' },
    ],
  };

  const handlePledgeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setPledgeOpen(false);
      toast.success(`Thank you ${donorName || 'Alumnus'}! Your ₦${parseInt(amount).toLocaleString()} pledge was added to the squad pool.`);
    }, 600);
  };

  const percent = Math.min(100, Math.round((squad.raisedKobo / squad.targetKobo) * 100));

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
              ALUMNI CLASS CHALLENGE
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
            <span className="font-bold text-base text-foreground">{formatNaira(squad.raisedKobo)} Pooled</span>
            <span className="text-muted-foreground">
              Target: {formatNaira(squad.targetKobo)} ({percent}%)
            </span>
          </div>
          <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full gradient-bg-blue transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
          <div className="flex flex-wrap justify-between items-center text-[11px] text-muted-foreground pt-1">
            <span>28 Contributing Classmates</span>
            <span className="text-emerald-500 font-bold">● Cowrywise Locked Vault</span>
            <span>Direct Remita Settlement</span>
          </div>
        </div>
      </div>

      {/* Indigent Scholars Supported */}
      <div className="space-y-4">
        <h3 className="font-display text-2xl font-bold text-foreground">
          Indigent Scholars Supported by this Squad
        </h3>
        <p className="text-xs text-muted-foreground font-mono">
          Funds from this alumni pool are disbursed directly to university bursaries to settle tuition for these verified scholars.
        </p>

        <div className="grid gap-4 md:grid-cols-3">
          {(dbScholars.length > 0 ? dbScholars : squad.scholars).map((sch, i) => {
            const p = Math.min(100, Math.round((sch.raisedKobo / sch.targetKobo) * 100));
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
                    <span>{formatNaira(sch.raisedKobo)}</span>
                    <span>{p}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${p}%` }} />
                  </div>
                </div>
                <Link
                  href={`/fund/${sch.slug}`}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-blue hover:text-brand-gold pt-1"
                >
                  <span>View Full Campaign</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            );
          })}
        </div>
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
