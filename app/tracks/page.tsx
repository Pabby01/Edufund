'use client';

import React from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Home,
  BookOpen,
  BookMarked,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  Heart,
} from 'lucide-react';
import { PillButton } from '@/components/landing/primitives';

const trackItems = [
  {
    slug: 'tuition',
    title: 'Tuition & Academic Fees',
    tagline: 'Direct Bursary Remita Settlement',
    desc: 'Undergraduate, clinical, and postgraduate school fees disbursed straight into university treasury single accounts (TSA). Eliminating deregistration fears before senate portal closures.',
    icon: GraduationCap,
    badgeColor: 'border-blue-500/30 bg-blue-500/10 text-brand-blue',
    accentColor: 'from-blue-600/20 to-indigo-600/10',
    stats: [
      { label: 'AVERAGE TARGET', value: '₦180K - ₦450K' },
      { label: 'DISBURSEMENT', value: 'Direct Remita RRR' },
      { label: 'DOCUMENTATION', value: 'Admission / Course Form' },
      { label: 'ACTIVE CAMPAIGNS', value: '34 Live' },
    ],
    sampleItems: ['100L School Fees (UNILAG)', 'Clinical Tuition (UI)', 'Faculty Dues & ICT Levies'],
  },
  {
    slug: 'hostels',
    title: 'Hostels & Campus Lodging',
    tagline: 'Verified Accommodation Escrow',
    desc: 'University hall of residence allocations and accredited off-campus student lodges. Preventing indigent students from homelessness or unsafe long-distance commuting.',
    icon: Home,
    badgeColor: 'border-amber-500/30 bg-amber-500/10 text-amber-500',
    accentColor: 'from-amber-600/20 to-orange-600/10',
    stats: [
      { label: 'AVERAGE TARGET', value: '₦120K - ₦280K' },
      { label: 'DISBURSEMENT', value: 'Bursary / Lodge Escrow' },
      { label: 'DOCUMENTATION', value: 'Tenancy / Hall Allocation' },
      { label: 'ACTIVE CAMPAIGNS', value: '19 Live' },
    ],
    sampleItems: ['Campus Hostel Allocation', 'Off-Campus Lodge Deposit', 'Utility & Maintenance Dues'],
  },
  {
    slug: 'stem',
    title: 'STEM Gear & Textbooks',
    tagline: 'Practical Lab & Clinical Tools',
    desc: 'Diagnostic kits for clinical medicine, drafting equipment for architecture, laboratory manuals, and laptop grants essential for technical coursework completion.',
    icon: BookOpen,
    badgeColor: 'border-purple-500/30 bg-purple-500/10 text-purple-500',
    accentColor: 'from-purple-600/20 to-pink-600/10',
    stats: [
      { label: 'AVERAGE TARGET', value: '₦45K - ₦150K' },
      { label: 'DISBURSEMENT', value: 'Vendor / Direct Reimbursed' },
      { label: 'DOCUMENTATION', value: 'Faculty Booklist / Syllabus' },
      { label: 'ACTIVE CAMPAIGNS', value: '14 Live' },
    ],
    sampleItems: ['Clinical Stethoscope & Kit', 'Architecture Drafting Board', 'Engineering Textbooks & Software'],
  },
  {
    slug: 'clearance',
    title: 'Final Clearance & Capstone',
    tagline: 'Zero Dropout in Final Semester',
    desc: 'Final year research project fieldwork, dissertation binding, senate graduation clearance, and transcript processing. Ensuring indigent finalists graduate on schedule.',
    icon: BookMarked,
    badgeColor: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500',
    accentColor: 'from-emerald-600/20 to-teal-600/10',
    stats: [
      { label: 'AVERAGE TARGET', value: '₦25K - ₦95K' },
      { label: 'DISBURSEMENT', value: 'Senate Registry & Printer' },
      { label: 'DOCUMENTATION', value: 'Project Approval Letter' },
      { label: 'ACTIVE CAMPAIGNS', value: '8 Live' },
    ],
    sampleItems: ['Final Project Printing & Binding', 'Senate Transcript Clearance', 'Convocation & Alumni Dues'],
  },
];

export default function TracksPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Breadcrumb Header */}
      <div className="mb-8 flex items-center gap-2 font-mono text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors flex items-center gap-1">
          <ArrowLeft className="h-3 w-3" />
          <span>Home</span>
        </Link>
        <span>/</span>
        <span className="text-foreground">Funding Tracks</span>
      </div>

      {/* Main Title Banner */}
      <div className="space-y-4 border-b border-border/60 pb-10 mb-12">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-brand-gold/30 bg-brand-gold/10 px-3.5 py-1 font-mono text-xs font-bold tracking-widest text-brand-gold-dark dark:text-brand-gold uppercase">
          <Sparkles className="h-3.5 w-3.5" />
          FOUR ACADEMIC TRACKS · ONE VERIFIED CHECKOUT
        </div>
        <h1 className="font-display text-4xl sm:text-6xl font-black tracking-tight text-foreground">
          Funding tracks designed for Nigerian universities.
        </h1>
        <p className="max-w-3xl text-sm sm:text-base text-muted-foreground leading-relaxed">
          Each funding track is calibrated for specific academic costs, required documentation,
          and direct bursary settlement via Remita and Cowrywise locked savings vaults.
        </p>
      </div>

      {/* Track Cards Grid */}
      <div className="grid gap-8 md:grid-cols-2">
        {trackItems.map((track) => {
          const Icon = track.icon;
          return (
            <div
              key={track.slug}
              className="group relative flex flex-col justify-between rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-md hover:shadow-xl hover:border-brand-gold/50 transition-all duration-300"
            >
              <div className="space-y-5">
                {/* Header Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/70 group-hover:scale-105 transition-transform">
                    <Icon className="h-6 w-6 text-brand-blue" />
                  </div>
                  <span className={`rounded-full border px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider ${track.badgeColor}`}>
                    {track.tagline}
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground group-hover:text-brand-blue transition-colors">
                    {track.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {track.desc}
                  </p>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-3 rounded-2xl border border-border/60 bg-muted/30 p-4 font-mono text-xs">
                  {track.stats.map((s, i) => (
                    <div key={i} className="space-y-0.5">
                      <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">
                        {s.label}
                      </span>
                      <p className="font-bold text-foreground text-[11px] truncate">{s.value}</p>
                    </div>
                  ))}
                </div>

                {/* Sample items pill */}
                <div className="space-y-2">
                  <span className="font-mono text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    SAMPLE VERIFIED ITEMS:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {track.sampleItems.map((item, idx) => (
                      <span
                        key={idx}
                        className="rounded-full bg-muted/60 px-3 py-1 text-xs font-mono text-muted-foreground border border-border/40"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-5 border-t border-border/60 flex flex-wrap items-center justify-between gap-3">
                <Link
                  href={`/tracks/${track.slug}`}
                  className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-brand-blue hover:text-brand-gold transition-colors uppercase tracking-wider"
                >
                  <span>Explore {track.title.split('&')[0]} Details</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link href={`/explore?category=${track.slug}`}>
                  <span className="rounded-full bg-muted px-3 py-1 text-[11px] font-mono font-bold text-foreground hover:bg-foreground hover:text-background transition-colors">
                    View Live Campaigns
                  </span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA Card */}
      <div className="mt-16 rounded-3xl gradient-bg-blue p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="font-display text-2xl sm:text-3xl font-black">Ready to fund your semester?</h3>
          <p className="text-sm text-white/80 max-w-xl">
            Choose your academic track and set up your verified Remita-connected goal in under 2 minutes.
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <PillButton href="/auth?mode=signup" variant="gold" icon={ArrowRight}>
            Start a Goal Now
          </PillButton>
        </div>
      </div>
    </div>
  );
}
