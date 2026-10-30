'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { formatNaira } from '@/lib/finance';
import { WordReveal, PillButton } from './primitives';
import { ArrowRight, CheckCircle2, Heart } from 'lucide-react';

interface SemesterBundle {
  index: string;
  total: string;
  title: string;
  tagline: string;
  desc: string;
  bgClass: string;
  badgePills: string[];
  receiptTitle: string;
  items: { name: string; amount: number }[];
  subtotal: number;
  cowrywiseMatch: number;
  finalTarget: number;
  saveBadge: string;
}

const bundles: SemesterBundle[] = [
  {
    index: '01',
    total: '03',
    title: 'The Freshman Launch Stack',
    tagline: 'Year 1 Undergraduate Entry',
    desc: 'Tuition, off-campus hostel deposit, and essential faculty registration fees. Everything an indigent 100L student needs to matriculate without fear of deregistration.',
    bgClass: 'bg-[#0c2340] border-blue-500/30 text-white',
    badgePills: ['Tuition 100L', 'Hostel Deposit', 'Faculty Dues'],
    receiptTitle: 'THE FRESHMAN STACK',
    items: [
      { name: '100L School Fees (UNILAG)', amount: 18000000 },
      { name: 'Off-Campus Lodge Deposit', amount: 14000000 },
      { name: 'Faculty & Departmental Dues', amount: 2500000 },
    ],
    subtotal: 34500000,
    cowrywiseMatch: 1500000,
    finalTarget: 33000000,
    saveBadge: 'COMMUNITY MATCH ₦15K',
  },
  {
    index: '02',
    total: '03',
    title: 'The Clinical Medicine Stack',
    tagline: 'College of Medicine & Dentistry',
    desc: 'Teaching hospital school fees, clinical hostel accommodation, and medical diagnostic equipment for 400L-600L medical students.',
    bgClass: 'bg-[#3b42ea] border-indigo-300/40 text-white',
    badgePills: ['Clinical Tuition', 'Hospital Hostel', 'Diagnostic Kit'],
    receiptTitle: 'THE CLINICAL STACK',
    items: [
      { name: 'Clinical Year Tuition (UI)', amount: 26000000 },
      { name: 'Teaching Hospital Hostel', amount: 15000000 },
      { name: 'Diagnostic Kit & Ward Manuals', amount: 4500000 },
    ],
    subtotal: 45500000,
    cowrywiseMatch: 2500000,
    finalTarget: 43000000,
    saveBadge: 'COMMUNITY MATCH ₦25K',
  },
  {
    index: '03',
    total: '03',
    title: 'The Finalist Capstone Stack',
    tagline: 'Graduation & Senate Clearance',
    desc: 'Final year semester school fees, research project fieldwork binding, and senate graduation clearance. Ensuring zero students drop out in their final semester.',
    bgClass: 'bg-[#1f4e42] border-emerald-400/40 text-white',
    badgePills: ['Final Semester Fee', 'Research Binding', 'Senate Clearance'],
    receiptTitle: 'THE FINALIST STACK',
    items: [
      { name: 'Final Semester School Fee', amount: 12000000 },
      { name: 'Project Fieldwork & Printing', amount: 6500000 },
      { name: 'Transcript & Senate Clearance', amount: 3500000 },
    ],
    subtotal: 22000000,
    cowrywiseMatch: 1200000,
    finalTarget: 20800000,
    saveBadge: 'COMMUNITY MATCH ₦12K',
  },
];

export function SemesterStacks() {
  return (
    <section id="stacks" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-neutral-950 text-white border-b border-white/10">
      <div className="relative mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="grid gap-6 lg:grid-cols-12 items-end pb-16">
          <div className="lg:col-span-7 space-y-3">
            <div className="eyebrow text-brand-gold">
              BUNDLED SEMESTER STACKS
            </div>
            <WordReveal
              lines={[
                'Fund the semester,',
                'not just the week.',
              ]}
              className="display-lg text-white"
            />
          </div>

          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
              Three essential student packages bundled together.
              The math is transparent, and verified directly on the receipt.
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

        {/* The Overlapping Stacking Cards (Deck of cards slide-over effect) */}
        <div className="relative pb-36">
          {bundles.map((bundle, idx) => (
            <div
              key={bundle.index}
              className="sticky transition-all duration-300 mb-32 sm:mb-48 last:mb-10 will-change-transform"
              style={{
                top: `${96 + idx * 36}px`,
                zIndex: 10 + idx,
              }}
            >
              <div
                className={`rounded-[32px] sm:rounded-[40px] border p-6 sm:p-12 shadow-[0_-25px_60px_rgba(0,0,0,0.7)] backdrop-blur-md ${bundle.bgClass}`}
              >
                <div className="grid gap-8 lg:grid-cols-12 items-center">
                  {/* Left Column: Stack Narrative */}
                  <div className="lg:col-span-7 space-y-5">
                    <div className="flex items-center gap-3 font-mono">
                      <span className="text-xs font-bold tracking-widest text-brand-gold uppercase">
                        {bundle.index} / {bundle.total}
                      </span>
                      <span className="rounded-full border border-white/20 bg-white/10 px-3 py-0.5 text-[11px] font-semibold">
                        {bundle.tagline}
                      </span>
                    </div>

                    <h3 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                      {bundle.title}
                    </h3>

                    <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-xl">
                      {bundle.desc}
                    </p>

                    {/* Badge Pills */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {bundle.badgePills.map((pill) => (
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
                      <PillButton href="/auth?mode=signup" variant="gold" icon={Heart}>
                        Sponsor this stack
                      </PillButton>
                    </div>
                  </div>

                  {/* Right Column: Perforated Receipt Paper */}
                  <div className="lg:col-span-5 flex justify-center">
                    <div className="receipt w-full max-w-md rounded-t-lg p-6 font-mono text-xs shadow-2xl text-neutral-900">
                      {/* Receipt Header */}
                      <div className="flex items-start justify-between border-b border-dashed border-neutral-300 pb-3">
                        <div>
                          <div className="font-bold tracking-widest text-[10px] text-neutral-500 uppercase">
                            {bundle.receiptTitle}
                          </div>
                          <div className="text-[9px] text-neutral-400">
                            VERIFIED NIGERIAN BUNDLE · 3 ITEMS
                          </div>
                        </div>
                        <span className="stamp text-[10px]">EDUFUND</span>
                      </div>

                      {/* Receipt Items */}
                      <div className="my-4 space-y-2">
                        {bundle.items.map((item, i) => (
                          <div key={i} className="flex justify-between text-[11px]">
                            <span className="text-neutral-700">{item.name}</span>
                            <span className="font-bold">{formatNaira(item.amount)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Calculations */}
                      <div className="border-t border-dashed border-neutral-300 pt-3 space-y-1.5">
                        <div className="flex justify-between text-neutral-500 text-[10px]">
                          <span>Subtotal</span>
                          <span>{formatNaira(bundle.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-emerald-600 font-bold text-[10px]">
                          <span>Cowrywise Yield / Match</span>
                          <span>-{formatNaira(bundle.cowrywiseMatch)}</span>
                        </div>
                        <div className="flex items-center justify-between border-t border-neutral-300 pt-2 text-sm font-black text-neutral-900">
                          <span>COMMUNITY TARGET</span>
                          <span className="text-base font-extrabold text-neutral-950">
                            {formatNaira(bundle.finalTarget)}
                          </span>
                        </div>
                      </div>

                      {/* Stamp bottom */}
                      <div className="mt-4 flex items-center justify-between">
                        <span className="stamp-gold text-[9px] font-bold">
                          {bundle.saveBadge}
                        </span>
                        <span className="text-[9px] text-neutral-400">TERMS APPLY</span>
                      </div>
                    </div>
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
