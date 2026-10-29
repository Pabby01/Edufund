'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { formatNaira, formatNairaShort } from '@/lib/finance';
import { WordReveal, PillButton, EASE_OUT } from './primitives';
import {
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Heart,
  TrendingUp,
  Clock,
  Sparkles,
} from 'lucide-react';

export function SpotlightSection() {
  const targetKobo = 65000000;
  const raisedKobo = 48000000;
  const percent = Math.round((raisedKobo / targetKobo) * 100);
  const remainingKobo = targetKobo - raisedKobo;

  return (
    <section className="relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8 border-b border-border/40 bg-card/40">
      <div className="relative mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="max-w-2xl space-y-3 mb-16">
          <div className="eyebrow">
            THIS WEEK IN THE SPOTLIGHT
          </div>
          <WordReveal
            lines={[
              'The featured',
              'student campaign.',
            ]}
            className="display-lg text-neutral-950 dark:text-white"
          />
          <p className="text-base text-muted-foreground">
            One student facing imminent portal closure receives community priority each week.
            Direct verification ensures every kobo credits their official school account.
          </p>
        </div>

        {/* Spotlight Showcase Grid */}
        <div className="grid gap-10 lg:grid-cols-12 items-center rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-2xl">
          {/* Left Column: Student Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/20">
              <img
                src="https://images.pexels.com/photos/38451631/pexels-photo-38451631.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Amina Bello - Medical Student"
                className="h-80 sm:h-96 w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

              {/* Floating Top Badge */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="rounded-full bg-red-500/90 text-white font-mono text-[10px] font-bold px-3 py-1 shadow">
                  12 DAYS REMAINING
                </span>
                <span className="rounded-full bg-black/60 text-white backdrop-blur text-[10px] font-bold px-3 py-1 border border-white/20">
                  MATRIC NO: 219804
                </span>
              </div>

              {/* Bottom Student Metadata */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-center gap-1.5 text-xs text-brand-gold font-bold uppercase tracking-wider mb-1">
                  <ShieldCheck className="h-4 w-4" />
                  HOD & FACULTY VERIFIED
                </div>
                <h3 className="text-2xl font-bold leading-tight">
                  Amina Bello
                </h3>
                <p className="text-xs text-white/80">
                  400L Clinical Medicine · University of Ibadan (UI)
                </p>

                {/* Progress bar */}
                <div className="mt-4 pt-3 border-t border-white/20">
                  <div className="flex justify-between text-xs font-bold font-mono mb-1.5">
                    <span>{formatNaira(raisedKobo)} raised</span>
                    <span className="text-brand-gold">{percent}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/20 overflow-hidden">
                    <div className="h-full bg-brand-gold" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: What is inside the funding goal */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-mono text-xs font-bold tracking-widest text-brand-gold uppercase">
                <span>GOAL BREAKDOWN</span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                What is inside the goal before you sponsor
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                EduFund campaigns publish transparent line items with zero hidden markups.
                Sponsors know exactly what invoice is being settled.
              </p>
            </div>

            {/* Line items table */}
            <div className="divide-y divide-border/60 border-y border-border/60 text-xs sm:text-sm font-mono py-1">
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-muted-foreground">Tuition & Clinical Registration</span>
                <span className="font-bold">₦380,000 (Remita Verified)</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-muted-foreground">UCH Teaching Hospital Hostel</span>
                <span className="font-bold">₦180,000 (Session Lodge)</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-muted-foreground">Clinical Diagnostic Kit & Manuals</span>
                <span className="font-bold">₦90,000 (Ward Tools)</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-muted-foreground">Cowrywise Locked Match</span>
                <span className="font-bold text-emerald-500">Active (+8.5% p.a. offset)</span>
              </div>
              <div className="py-2.5 flex justify-between items-center font-bold text-base">
                <span>Remaining Funding Gap</span>
                <span className="text-red-500 font-extrabold">{formatNaira(remainingKobo)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <PillButton href="/fund/ui-clinical-medicine" variant="primary" icon={Heart}>
                Sponsor Amina&apos;s semester
              </PillButton>
              <Link
                href="/fund/ui-clinical-medicine"
                className="text-xs font-mono font-bold tracking-wider uppercase text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
              >
                VIEW FULL CAMPAIGN
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

