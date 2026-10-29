'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { formatNaira } from '@/lib/finance';
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

interface SemesterStack {
  index: string;
  totalIndex: string;
  title: string;
  tagline: string;
  description: string;
  bgClass: string;
  badgePills: string[];
  receiptTitle: string;
  items: { name: string; amount: number }[];
  subtotal: number;
  cowrywiseMatch: number;
  finalAmount: number;
  saveBadge: string;
}

const stacks: SemesterStack[] = [
  {
    index: '01',
    totalIndex: '03',
    title: 'The Freshman Launch Stack',
    tagline: 'Year 1 Undergraduate Entry',
    description:
      'Tuition, off-campus hostel deposit, and essential faculty registration fees. Everything an indigent 100L student needs to matriculate without fear.',
    bgClass: 'bg-[#0f2442] border-blue-500/30 text-white',
    badgePills: ['Tuition 100L', 'Hostel Deposit', 'Faculty Dues'],
    receiptTitle: 'THE FRESHMAN STACK',
    items: [
      { name: '100L School Fees (UNILAG)', amount: 180000 },
      { name: 'Off-Campus Room Deposit', amount: 140000 },
      { name: 'Faculty & Departmental Dues', amount: 25000 },
    ],
    subtotal: 345000,
    cowrywiseMatch: 15000,
    finalAmount: 330000,
    saveBadge: 'YOU SAVE ₦15,000',
  },
  {
    index: '02',
    totalIndex: '03',
    title: 'The Clinical Medicine Stack',
    tagline: 'College of Medicine & Dentistry',
    description:
      'Teaching hospital school fees, clinical hostel accommodation, and medical diagnostic kit for 400L-600L medical students.',
    bgClass: 'bg-[#1e1b4b] border-indigo-500/30 text-white',
    badgePills: ['Clinical Tuition', 'Hospital Hostel', 'Diagnostic Kit'],
    receiptTitle: 'THE CLINICAL STACK',
    items: [
      { name: 'Clinical Year Tuition (UI)', amount: 260000 },
      { name: 'Teaching Hospital Hostel', amount: 150000 },
      { name: 'Diagnostic Kit & Manuals', amount: 45000 },
    ],
    subtotal: 455000,
    cowrywiseMatch: 25000,
    finalAmount: 430000,
    saveBadge: 'YOU SAVE ₦25,000',
  },
  {
    index: '03',
    totalIndex: '03',
    title: 'The Finalist Capstone Stack',
    tagline: 'Graduation & Senate Clearance',
    description:
      'Final year semester fee, research project fieldwork binding, and senate graduation clearance. Ensuring zero students drop out in their final semester.',
    bgClass: 'bg-[#18212f] border-amber-500/30 text-white',
    badgePills: ['Final Semester Fee', 'Research Binding', 'Senate Clearance'],
    receiptTitle: 'THE FINALIST STACK',
    items: [
      { name: 'Final Semester School Fee', amount: 120000 },
      { name: 'Project Fieldwork & Printing', amount: 65000 },
      { name: 'Transcript & Senate Clearance', amount: 35000 },
    ],
    subtotal: 220000,
    cowrywiseMatch: 12000,
    finalAmount: 208000,
    saveBadge: 'YOU SAVE ₦12,000',
  },
];

export function OverlappingStacks({ className = '' }: { className?: string }) {
  return (
    <section className={`relative py-24 px-4 sm:px-6 lg:px-8 bg-neutral-950 text-white overflow-hidden ${className}`}>
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 -right-48 h-96 w-96 rounded-full bg-brand-blue/20 blur-3xl" />
        <div className="absolute bottom-1/4 -left-48 h-96 w-96 rounded-full bg-brand-gold/15 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="grid gap-6 lg:grid-cols-12 items-end pb-16">
          <div className="lg:col-span-7 space-y-3">
            <div className="text-xs font-mono font-bold tracking-widest text-brand-gold uppercase">
              — BUNDLED SEMESTER STACKS
            </div>
            <h2 className="text-4xl sm:text-6xl font-black tracking-tight leading-[0.95]">
              Fund the semester, <br />
              not just the week.
            </h2>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            <p className="text-sm sm:text-base text-neutral-400">
              Three critical education sets that go together. The math is transparent, and verified directly on the receipt.
            </p>
            <div>
              <Link
                href="/auth?mode=signup"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold tracking-widest text-brand-gold hover:text-brand-gold-light uppercase"
              >
                EXPLORE ALL STACKS
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* The Overlapping Stacking Cards (Sticky Stack) */}
        <div className="relative space-y-12">
          {stacks.map((stack, idx) => (
            <div
              key={stack.index}
              className={`sticky rounded-3xl border p-6 sm:p-10 shadow-2xl transition-all duration-300 ${stack.bgClass}`}
              style={{
                top: `${80 + idx * 24}px`,
                zIndex: idx + 10,
              }}
            >
              <div className="grid gap-8 lg:grid-cols-12 items-center">
                {/* Left Column: Stack Details */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold tracking-widest text-brand-gold uppercase">
                      {stack.index} / {stack.totalIndex}
                    </span>
                    <span className="rounded-full border border-white/20 bg-white/10 px-3 py-0.5 text-[11px] font-semibold">
                      {stack.tagline}
                    </span>
                  </div>

                  <h3 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                    {stack.title}
                  </h3>

                  <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-xl">
                    {stack.description}
                  </p>

                  {/* Badge Pills */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {stack.badgePills.map((pill) => (
                      <span
                        key={pill}
                        className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-sm"
                      >
                        {pill}
                      </span>
                    ))}
                  </div>

                  {/* Action Button */}
                  <div className="pt-2">
                    <Link href="/auth?mode=signup">
                      <Button
                        size="lg"
                        className="rounded-full gradient-bg-gold text-slate-950 hover:opacity-95 font-bold h-12 px-6 shadow-lg"
                      >
                        Sponsor this stack
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Right Column: Perforated Receipt Paper */}
                <div className="lg:col-span-5 flex justify-center">
                  <div className="receipt-paper w-full max-w-md rounded-t-lg p-6 font-mono text-xs shadow-2xl text-neutral-900">
                    {/* Receipt Header */}
                    <div className="flex items-start justify-between border-b border-dashed border-neutral-300 pb-3">
                      <div>
                        <div className="font-bold tracking-widest text-[10px] text-neutral-500 uppercase">
                          {stack.receiptTitle}
                        </div>
                        <div className="text-[9px] text-neutral-400">
                          VERIFIED NIGERIAN BUNDLE · 3 ITEMS
                        </div>
                      </div>
                      <div className="rubber-stamp text-[10px]">
                        EDUFUND
                      </div>
                    </div>

                    {/* Receipt Items */}
                    <div className="my-4 space-y-2">
                      {stack.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-[11px]">
                          <span className="text-neutral-700">{item.name}</span>
                          <span className="font-bold">{formatNaira(item.amount * 100)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Calculations */}
                    <div className="border-t border-dashed border-neutral-300 pt-3 space-y-1.5">
                      <div className="flex justify-between text-neutral-500 text-[10px]">
                        <span>Subtotal</span>
                        <span>{formatNaira(stack.subtotal * 100)}</span>
                      </div>
                      <div className="flex justify-between text-emerald-600 font-bold text-[10px]">
                        <span>Cowrywise Sponsor Match</span>
                        <span>-{formatNaira(stack.cowrywiseMatch * 100)}</span>
                      </div>
                      <div className="flex items-center justify-between border-t border-neutral-300 pt-2 text-sm font-black text-neutral-900">
                        <span>COMMUNITY GOAL</span>
                        <span className="text-base font-extrabold text-neutral-950">
                          {formatNaira(stack.finalAmount * 100)}
                        </span>
                      </div>
                    </div>

                    {/* Stamp bottom */}
                    <div className="mt-4 flex items-center justify-between">
                      <span className="rubber-stamp-gold text-[9px] font-bold">
                        {stack.saveBadge}
                      </span>
                      <span className="text-[9px] text-neutral-400">TERMS APPLY</span>
                    </div>

                    {/* Sawtooth edge */}
                    <div className="receipt-sawtooth -mx-6 -mb-6 mt-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

