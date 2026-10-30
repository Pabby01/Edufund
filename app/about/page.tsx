'use client';

import React from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  ShieldCheck,
  Heart,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Award,
  Users,
  Target,
} from 'lucide-react';
import { PillButton } from '@/components/landing/primitives';

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Breadcrumb Header */}
      <div className="mb-8 flex items-center gap-2 font-mono text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors flex items-center gap-1">
          <ArrowLeft className="h-3 w-3" />
          <span>Home</span>
        </Link>
        <span>/</span>
        <span className="text-foreground">About EduFund</span>
      </div>

      {/* Hero Header */}
      <div className="space-y-4 border-b border-border/60 pb-10 mb-14">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-brand-gold/30 bg-brand-gold/10 px-3.5 py-1 font-mono text-xs font-bold tracking-widest text-brand-gold-dark dark:text-brand-gold uppercase">
          <Award className="h-3.5 w-3.5" />
          COWRYWISE AMBASSADORS INNOVATION CHALLENGE 2026
        </div>
        <h1 className="font-display text-4xl sm:text-6xl font-black tracking-tight text-foreground">
          Built to ensure no Nigerian student drops out over fees.
        </h1>
        <p className="max-w-3xl text-sm sm:text-base text-muted-foreground leading-relaxed">
          EduFund was engineered to solve a systemic crisis in Nigerian tertiary education:
          sudden tuition increases, unforgiving payment portal deadlines, and the complete lack of
          transparent, debt-free student financing.
        </p>
      </div>

      {/* The Origin Story & Problem */}
      <div className="space-y-12 mb-16">
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-sm space-y-4">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-brand-blue">
            THE REALITY ON CAMPUS
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-black text-foreground">
            Why indigent students face deregistration
          </h2>
          <div className="space-y-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
            <p>
              In recent academic sessions, federal and state universities across Nigeria increased undergraduate
              school fees by 150% to 300%. For thousands of indigent students whose parents earn minimum wage or
              who support themselves through petty campus businesses, paying ₦200,000 to ₦450,000 before the senate
              portal closes is an insurmountable wall.
            </p>
            <p>
              Traditional crowdfunding platforms are plagued by skepticism, 5% to 10% platform cuts, and the
              fear that funds deposited into personal accounts might be diverted. Students are forced to either
              take high-interest predatory loan app credits or drop out entirely in their final semesters.
            </p>
          </div>
        </div>

        {/* The 4 Core Pillars */}
        <div>
          <div className="mb-6 space-y-1">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-brand-gold">
              OUR GUIDING PILLARS
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-foreground">
              Built on trust, auditability, and student dignity
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-3xl border border-border bg-card p-6 space-y-3 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-foreground">Direct Remita Settlement</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                We never pay tuition into personal bank accounts. Every school fee goal is settled directly into
                the official University Treasury Single Account via Remita RRR invoices.
              </p>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 space-y-3 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gold/15 text-brand-gold">
                <Award className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-foreground">Cowrywise Locked Escrow</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Pledges are safeguarded in automated Cowrywise locked savings vaults. They earn up to 14% p.a.
                locked yield, reducing the student’s gap while preventing premature withdrawals.
              </p>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 space-y-3 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
                <Heart className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-foreground">0% Platform Fee</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                EduFund charges zero commission on student donations. 100% of every sponsor contribution
                goes straight toward the verified academic invoice.
              </p>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 space-y-3 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                <Target className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-foreground">Integer Kobo Arithmetic</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                All financial calculations are computed with integer kobo precision (100 kobo = 1 NGN).
                Zero floating-point rounding errors or drift across all ledgers.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Hackathon Statement */}
      <div className="rounded-3xl border border-dashed border-border bg-muted/30 p-8 font-mono text-xs text-muted-foreground space-y-2 mb-16">
        <p className="font-bold text-foreground uppercase tracking-wider">
          Cowrywise Ambassadors Innovation Challenge 2026 Declaration
        </p>
        <p className="leading-relaxed">
          EduFund is a prototype developed for the Cowrywise Ambassadors Innovation Challenge 2026.
          It demonstrates how modern fintech APIs (Cowrywise locked savings, Remita e-collection, and Paystack checkout)
          can be combined to eliminate education inequality across Nigerian universities.
        </p>
      </div>

      {/* Closing Call to Action */}
      <div className="rounded-3xl gradient-bg-blue p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="font-display text-2xl sm:text-3xl font-black">Support a Nigerian student today.</h3>
          <p className="text-sm text-white/80 max-w-xl">
            Explore verified campaigns or start an education goal for your upcoming semester.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 shrink-0">
          <PillButton href="/explore" variant="gold" icon={ArrowRight}>
            Explore Active Registry
          </PillButton>
        </div>
      </div>

      {/* Back button */}
      <div className="mt-14 pt-8 border-t border-border/60">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-brand-blue hover:underline uppercase tracking-wider"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Homepage</span>
        </Link>
      </div>
    </div>
  );
}

