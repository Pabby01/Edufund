'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Layers,
  ArrowLeft,
  ArrowRight,
  Heart,
  CheckCircle2,
  Sparkles,
  Calculator,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { PillButton } from '@/components/landing/primitives';
import { formatNaira } from '@/lib/finance';

interface StackPackage {
  id: string;
  name: string;
  targetLevel: string;
  tagline: string;
  colorClass: string;
  items: { name: string; amount: number; description: string }[];
  subtotal: number;
  cowrywiseMatch: number;
  finalTarget: number;
  summary: string;
}

const stacks: StackPackage[] = [
  {
    id: 'freshman',
    name: 'The Freshman Launch Stack',
    targetLevel: '100L Undergraduate Entry',
    tagline: 'Year 1 Matriculation Assurance',
    colorClass: 'border-blue-500/30 bg-[#0c2340] text-white',
    summary:
      'Everything an indigent 100L student needs to matriculate without fear of deregistration or hostel eviction during their critical first year.',
    items: [
      { name: '100L Tuition & Registration (UNILAG)', amount: 18000000, description: 'Direct Remita bursary TSA settlement' },
      { name: 'Off-Campus Lodge Security Deposit', amount: 14000000, description: 'Accredited student landlord tenancy escrow' },
      { name: 'Faculty & Departmental Levies', amount: 2500000, description: 'Mandatory faculty clearance dues' },
    ],
    subtotal: 34500000,
    cowrywiseMatch: 1500000,
    finalTarget: 33000000,
  },
  {
    id: 'clinical',
    name: 'The Clinical Medicine Stack',
    targetLevel: '400L - 600L Medicine & Dentistry',
    tagline: 'Teaching Hospital Clinical Years',
    colorClass: 'border-indigo-400/40 bg-[#3239c7] text-white',
    summary:
      'College of Medicine & Dentistry packages covering teaching hospital school fees, dedicated clinical hostels, and essential diagnostic ward instruments.',
    items: [
      { name: 'Clinical Year Tuition (UI College of Med)', amount: 26000000, description: 'University College Hospital bursary settlement' },
      { name: 'Teaching Hospital Ward Accommodation', amount: 15000000, description: 'Resident clinical hall bedspace' },
      { name: 'Diagnostic Kit & Clinical Ward Manuals', amount: 4500000, description: 'Stethoscope, sphygmomanometer, tendon hammer' },
    ],
    subtotal: 45500000,
    cowrywiseMatch: 2500000,
    finalTarget: 43000000,
  },
  {
    id: 'finalist',
    name: 'The Finalist Capstone Stack',
    targetLevel: 'Final Year Graduating Students',
    tagline: 'Zero Dropout in Final Semester',
    colorClass: 'border-emerald-400/40 bg-[#164e40] text-white',
    summary:
      'Ensuring that students who have completed 4 to 6 years of coursework are not prevented from graduating due to project binding and senate transcript fees.',
    items: [
      { name: 'Final Semester Tuition & Exam Fees', amount: 12000000, description: 'Direct university portal bursary RRR' },
      { name: 'Research Project Fieldwork & Printing', amount: 6500000, description: 'Questionnaire survey & 4 hardcover copies' },
      { name: 'Senate Graduation & Transcript Clearance', amount: 3500000, description: 'Senate registry & NYSC mobilization clearance' },
    ],
    subtotal: 22000000,
    cowrywiseMatch: 1200000,
    finalTarget: 20800000,
  },
];

export default function StacksPage() {
  const [selectedPledge, setSelectedPledge] = useState(25000); // ₦25,000

  // Yield computation (simulated Cowrywise 14% annual locked yield over 4 months)
  const projectedInterest = Math.round((selectedPledge * 0.14 * 4) / 12);
  const totalPower = selectedPledge + projectedInterest;

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Breadcrumb Header */}
      <div className="mb-8 flex items-center gap-2 font-mono text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors flex items-center gap-1">
          <ArrowLeft className="h-3 w-3" />
          <span>Home</span>
        </Link>
        <span>/</span>
        <span className="text-foreground">Semester Stacks</span>
      </div>

      {/* Main Title Banner */}
      <div className="space-y-4 border-b border-border/60 pb-10 mb-12">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-brand-gold/30 bg-brand-gold/10 px-3.5 py-1 font-mono text-xs font-bold tracking-widest text-brand-gold-dark dark:text-brand-gold uppercase">
          <Layers className="h-3.5 w-3.5" />
          BUNDLED SEMESTER PACKAGES · REMITA VERIFIED
        </div>
        <h1 className="font-display text-4xl sm:text-6xl font-black tracking-tight text-foreground">
          Fund the entire semester, not just the week.
        </h1>
        <p className="max-w-3xl text-sm sm:text-base text-muted-foreground leading-relaxed">
          Bundled student packages designed to eliminate funding fragmentation.
          Tuition, hostel lodging, and faculty dues are itemized into a single transparent receipt.
        </p>
      </div>

      {/* Interactive Yield Calculator Strip */}
      <div className="mb-14 rounded-3xl border border-brand-gold/30 bg-card p-6 sm:p-8 shadow-lg">
        <div className="grid gap-8 md:grid-cols-12 items-center">
          <div className="md:col-span-6 space-y-3">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-brand-gold uppercase">
              <Calculator className="h-4 w-4" />
              <span>COWRYWISE MATCH & YIELD CALCULATOR</span>
            </div>
            <h3 className="font-display text-2xl font-bold text-foreground">
              See the power of your locked micro-pledge
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              When sponsors lock funds ahead of the university payment deadline,
              Cowrywise locked vaults generate interest yield that directly shrinks the student funding gap.
            </p>

            <div className="pt-2">
              <label className="font-mono text-xs text-muted-foreground uppercase">
                Choose your sponsorship pledge amount:
              </label>
              <div className="flex flex-wrap gap-2 pt-2">
                {[10000, 25000, 50000, 100000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setSelectedPledge(amt)}
                    className={`rounded-full px-4 py-1.5 font-mono text-xs font-bold transition-all ${
                      selectedPledge === amt
                        ? 'gradient-bg-blue text-white shadow-xs'
                        : 'border border-border bg-muted/60 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {formatNaira(amt * 100)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-6 rounded-2xl border border-border bg-muted/30 p-6 font-mono text-xs space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-border/50">
              <span className="text-muted-foreground">Your Sponsor Pledge</span>
              <span className="font-bold text-sm text-foreground">{formatNaira(selectedPledge * 100)}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-border/50">
              <span className="text-emerald-500 font-bold">+ Cowrywise Locked Vault Yield (14% p.a.)</span>
              <span className="font-bold text-emerald-500">+{formatNaira(projectedInterest * 100)}</span>
            </div>
            <div className="flex justify-between items-center pt-1 text-sm font-black">
              <span className="text-foreground">TOTAL EFFECTIVE STUDENT VALUE</span>
              <span className="text-brand-blue font-extrabold text-base">{formatNaira(totalPower * 100)}</span>
            </div>
            <p className="text-[10px] text-muted-foreground pt-1">
              * Yield compounded until university semester bursary settlement date.
            </p>
          </div>
        </div>
      </div>

      {/* The Semester Stacks Packages */}
      <div className="space-y-12">
        {stacks.map((pkg, idx) => (
          <div
            key={pkg.id}
            className={`rounded-3xl border p-6 sm:p-10 shadow-2xl ${pkg.colorClass}`}
          >
            <div className="grid gap-8 lg:grid-cols-12 items-center">
              {/* Left narrative */}
              <div className="lg:col-span-7 space-y-5">
                <div className="flex items-center gap-3 font-mono">
                  <span className="text-xs font-bold tracking-widest text-brand-gold uppercase">
                    STACK 0{idx + 1}
                  </span>
                  <span className="rounded-full border border-white/20 bg-white/10 px-3 py-0.5 text-[11px] font-semibold">
                    {pkg.targetLevel}
                  </span>
                </div>

                <h3 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-white">
                  {pkg.name}
                </h3>

                <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-xl">
                  {pkg.summary}
                </p>

                {/* Line items list */}
                <div className="space-y-2 pt-2">
                  {pkg.items.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs font-mono text-white/90">
                      <CheckCircle2 className="h-4 w-4 text-brand-gold shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">{item.name}</span>
                        <span className="text-white/60"> — {item.description}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex flex-wrap gap-3">
                  <PillButton href="/auth?mode=signup" variant="gold" icon={Heart}>
                    Sponsor This Stack
                  </PillButton>
                  <Link
                    href={`/explore?stack=${pkg.id}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-5 py-2.5 font-mono text-xs font-bold text-white hover:bg-white/20 transition-colors"
                  >
                    <span>View Student Campaigns</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              {/* Right: Receipt */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="receipt w-full max-w-md rounded-t-lg p-6 font-mono text-xs shadow-2xl text-neutral-900">
                  <div className="flex items-start justify-between border-b border-dashed border-neutral-300 pb-3">
                    <div>
                      <div className="font-bold tracking-widest text-[10px] text-neutral-500 uppercase">
                        {pkg.name.toUpperCase()}
                      </div>
                      <div className="text-[9px] text-neutral-400">
                        VERIFIED NIGERIAN BUNDLE · 3 ITEMS
                      </div>
                    </div>
                    <span className="stamp text-[10px]">EDUFUND</span>
                  </div>

                  <div className="my-4 space-y-2">
                    {pkg.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-[11px]">
                        <span className="text-neutral-700">{item.name.split('(')[0]}</span>
                        <span className="font-bold">{formatNaira(item.amount)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-dashed border-neutral-300 pt-3 space-y-1.5">
                    <div className="flex justify-between text-neutral-500 text-[10px]">
                      <span>Gross Bundle Subtotal</span>
                      <span>{formatNaira(pkg.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-emerald-600 font-bold text-[10px]">
                      <span>Cowrywise Locked Yield / Match</span>
                      <span>-{formatNaira(pkg.cowrywiseMatch)}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-neutral-300 pt-2 text-sm font-black text-neutral-900">
                      <span>COMMUNITY TARGET</span>
                      <span className="text-base font-extrabold text-neutral-950">
                        {formatNaira(pkg.finalTarget)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-[9px] text-neutral-400">
                    <span className="stamp-gold text-[8px] font-bold">REMITA DIRECT SETTLED</span>
                    <span>INTEGER KOBO PRECISION</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Back button */}
      <div className="mt-16 pt-8 border-t border-border/60">
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

