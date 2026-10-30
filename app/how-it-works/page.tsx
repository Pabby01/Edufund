'use client';

import React from 'react';
import Link from 'next/link';
import {
  FileText,
  Lock,
  Users,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Heart,
  HelpCircle,
} from 'lucide-react';
import { PillButton } from '@/components/landing/primitives';

const steps = [
  {
    step: '01',
    title: 'Student Goal & Remita RRR Verification',
    subtitle: 'Takes less than 2 minutes',
    desc: 'The student selects their academic track (Tuition, Hostel, STEM, or Finalist), enters their university and matriculation details, and uploads the verified Remita Retrieval Reference (RRR) generated on their university bursary portal.',
    icon: FileText,
    badge: 'STAGE 1: VERIFICATION',
  },
  {
    step: '02',
    title: 'Cowrywise Automated Locked Vault Provisioning',
    subtitle: 'Zero withdrawal temptation',
    desc: 'EduFund provisions a dedicated Cowrywise locked savings vault for the campaign. Funds remain locked until the university semester deadline or target completion, earning up to 14% annual yield that reduces the final student target.',
    icon: Lock,
    badge: 'STAGE 2: ESCROW LOCK',
  },
  {
    step: '03',
    title: 'Pledge Circle & Community Micro-Funding',
    subtitle: 'Transparent digital receipt trail',
    desc: 'Students share their verified campaign link with alumni, family, mentors, and corporate sponsors. Sponsors can make instant one-off contributions via card or commit to monthly micro-pledges with automated email reminders.',
    icon: Users,
    badge: 'STAGE 3: COLLECTIVE PLEDGES',
  },
  {
    step: '04',
    title: 'Real-time Integer Kobo Ledger & Tracking',
    subtitle: 'Zero floating-point rounding drift',
    desc: 'Every naira is tracked to the exact kobo. As sponsors contribute, real-time perforated digital receipts are generated. Donors can leave verified notes of encouragement that appear on the student public campaign wall.',
    icon: TrendingUp,
    badge: 'STAGE 4: AUDIT LEDGER',
  },
  {
    step: '05',
    title: 'Direct University Bursary TSA Settlement',
    subtitle: '100% tuition assurance',
    desc: 'When the deadline arrives, the accumulated funds are disbursed directly to the official university Treasury Single Account (TSA) via Remita. The student portal status is updated to "Paid & Cleared", and official Remita receipts are emailed to all donors.',
    icon: ShieldCheck,
    badge: 'STAGE 5: SETTLEMENT',
  },
];

const comparisons = [
  {
    feature: 'Tuition Disbursement Destination',
    traditional: 'Personal student bank accounts (risk of diversion)',
    edufund: 'Direct University Bursary Portal via Remita RRR',
    highlight: true,
  },
  {
    feature: 'Platform Transaction Commission',
    traditional: '5% to 10% platform fee taken from donations',
    edufund: '0% Platform Commission — 100% reaches the school',
    highlight: true,
  },
  {
    feature: 'Intermediate Escrow Security',
    traditional: 'Unregulated wallet or delayed wire transfers',
    edufund: 'Regulated Cowrywise Locked Vault with 14% yield',
    highlight: true,
  },
  {
    feature: 'Accounting Precision',
    traditional: 'Floating point numbers with potential rounding drift',
    edufund: 'Integer kobo precision (1 NGN = 100 kobo)',
    highlight: false,
  },
  {
    feature: 'Document Verification',
    traditional: 'Self-reported claims with no invoice validation',
    edufund: 'Remita invoice verification against university records',
    highlight: false,
  },
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Breadcrumb Header */}
      <div className="mb-8 flex items-center gap-2 font-mono text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors flex items-center gap-1">
          <ArrowLeft className="h-3 w-3" />
          <span>Home</span>
        </Link>
        <span>/</span>
        <span className="text-foreground">How it works</span>
      </div>

      {/* Main Title Banner */}
      <div className="space-y-4 border-b border-border/60 pb-10 mb-14">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-brand-blue/30 bg-brand-blue/10 px-3.5 py-1 font-mono text-xs font-bold tracking-widest text-brand-blue uppercase">
          <Sparkles className="h-3.5 w-3.5" />
          THE EDUFUND BLUEPRINT · 100% AUDITED
        </div>
        <h1 className="font-display text-4xl sm:text-6xl font-black tracking-tight text-foreground">
          How collective semester funding works.
        </h1>
        <p className="max-w-3xl text-sm sm:text-base text-muted-foreground leading-relaxed">
          From verified Remita RRR generation to Cowrywise locked savings vaults and direct bursary payout.
          Engineered to ensure complete trust, zero fund diversion, and timely university clearance.
        </p>
      </div>

      {/* 5 Stage Roadmap Cards */}
      <div className="space-y-6 mb-20">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={s.step}
              className="group rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm hover:shadow-xl hover:border-brand-gold/60 transition-all duration-300"
            >
              <div className="grid gap-6 md:grid-cols-12 items-center">
                <div className="md:col-span-2 flex flex-col items-start md:items-center">
                  <span className="font-display text-5xl sm:text-6xl font-black text-muted-foreground/30 group-hover:text-brand-blue transition-colors">
                    {s.step}
                  </span>
                  <div className="mt-2 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                <div className="md:col-span-10 space-y-2">
                  <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-3 py-0.5 font-mono text-[10px] font-bold text-brand-gold-dark dark:text-brand-gold">
                    {s.badge}
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground">
                    {s.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparison Matrix Table */}
      <div className="mb-20 rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-lg space-y-6">
        <div>
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-brand-gold">
            WHY EDUFUND IS DIFFERENT
          </span>
          <h3 className="font-display text-2xl sm:text-3xl font-black text-foreground mt-1">
            Traditional Crowdfunding vs. EduFund Remita Architecture
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-border/80 font-mono text-[11px] text-muted-foreground uppercase">
                <th className="pb-3 pr-4">Feature / Protocol</th>
                <th className="pb-3 pr-4 text-red-500">Traditional Platforms</th>
                <th className="pb-3 text-emerald-500 font-bold">EduFund Standard</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {comparisons.map((c, i) => (
                <tr key={i} className={c.highlight ? 'bg-muted/20' : ''}>
                  <td className="py-3.5 pr-4 font-bold text-foreground font-mono text-xs">{c.feature}</td>
                  <td className="py-3.5 pr-4 text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                      <span>{c.traditional}</span>
                    </div>
                  </td>
                  <td className="py-3.5 font-semibold text-foreground">
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>{c.edufund}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Closing CTA */}
      <div className="rounded-3xl gradient-bg-blue p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="font-display text-2xl sm:text-3xl font-black">Ready to get your semester funded?</h3>
          <p className="text-sm text-white/80 max-w-xl">
            Join thousands of Nigerian students who fund tuition with zero debt and complete transparency.
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <PillButton href="/auth?mode=signup" variant="gold" icon={ArrowRight}>
            Create an Education Goal
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

