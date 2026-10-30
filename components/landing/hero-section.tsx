'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { formatNaira, formatNairaShort } from '@/lib/finance';
import { WordReveal, PillButton, EASE_OUT, EASE_SPRING } from './primitives';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  GraduationCap,
  Heart,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  X,
  Target,
  Sparkles,
  Plus,
} from 'lucide-react';

interface GoalBox {
  id: string;
  slug: string;
  title: string;
  category: string;
  institution: string;
  studentName: string;
  targetKobo: number;
  raisedKobo: number;
  deadlineDays: number;
  badge: string;
  badgeColor: string;
  gradient: string;
}

const heroGoals: GoalBox[] = [
  // Top tier
  {
    id: '1',
    slug: 'unilag-cs-tuition',
    title: 'Computer Science 300L Tuition',
    category: 'Tuition',
    institution: 'University of Lagos (UNILAG)',
    studentName: 'Tunde Bakare',
    targetKobo: 45000000,
    raisedKobo: 31000000,
    deadlineDays: 21,
    badge: 'MOST URGENT',
    badgeColor: 'bg-red-500 text-white',
    gradient: 'from-blue-600 via-blue-700 to-indigo-900',
  },
  {
    id: '2',
    slug: 'ui-clinical-medicine',
    title: 'Clinical Medicine 400L Fees',
    category: 'Tuition',
    institution: 'University of Ibadan (UI)',
    studentName: 'Amina Bello',
    targetKobo: 65000000,
    raisedKobo: 48000000,
    deadlineDays: 34,
    badge: 'TOP FUNDED',
    badgeColor: 'bg-brand-gold text-neutral-950 font-bold',
    gradient: 'from-amber-500 via-orange-600 to-amber-900',
  },
  {
    id: '3',
    slug: 'futo-eng-workshop',
    title: 'Mechanical Workshop & Kit',
    category: 'STEM Kit',
    institution: 'FUTO Owerri',
    studentName: 'Chidi Okonkwo',
    targetKobo: 18000000,
    raisedKobo: 14500000,
    deadlineDays: 14,
    badge: 'NEW',
    badgeColor: 'bg-emerald-500 text-white',
    gradient: 'from-emerald-600 via-teal-700 to-slate-900',
  },
  // Middle tier
  {
    id: '4',
    slug: 'unn-campus-hostel',
    title: 'Off-Campus Lodge Annual Rent',
    category: 'Accommodation',
    institution: 'Univ of Nigeria, Nsukka (UNN)',
    studentName: 'Ngozi Eze',
    targetKobo: 24000000,
    raisedKobo: 15000000,
    deadlineDays: 19,
    badge: 'HOSTEL',
    badgeColor: 'bg-purple-500 text-white',
    gradient: 'from-purple-600 via-indigo-700 to-slate-900',
  },
  {
    id: '5',
    slug: 'oau-law-dues',
    title: 'Faculty of Law Session Registration',
    category: 'Tuition',
    institution: 'Obafemi Awolowo Univ (OAU)',
    studentName: 'Segun Adeleke',
    targetKobo: 32000000,
    raisedKobo: 29000000,
    deadlineDays: 8,
    badge: '90% FUNDED',
    badgeColor: 'bg-emerald-600 text-white',
    gradient: 'from-slate-700 via-blue-900 to-slate-950',
  },
  {
    id: '6',
    slug: 'abu-arch-drafting',
    title: 'Architecture Drafting Equipment',
    category: 'Materials',
    institution: 'Ahmadu Bello Univ (ABU)',
    studentName: 'Fatima Garba',
    targetKobo: 16000000,
    raisedKobo: 9500000,
    deadlineDays: 28,
    badge: 'VERIFIED',
    badgeColor: 'bg-blue-500 text-white',
    gradient: 'from-cyan-600 via-blue-800 to-slate-900',
  },
];

export function HeroSection() {
  const [selectedGoal, setSelectedGoal] = useState<GoalBox | null>(heroGoals[0]);
  const shelfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (shelfRef.current) {
        gsap.to(shelfRef.current, {
          y: -40,
          rotateX: 6,
          rotateY: -3,
          ease: 'none',
          scrollTrigger: {
            trigger: shelfRef.current,
            start: 'top 50%',
            end: 'bottom top',
            scrub: 1.2,
          },
        });
      }
    }, shelfRef);

    return () => ctx.revert();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!shelfRef.current) return;
    const rect = shelfRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(shelfRef.current, {
      rotateY: x * 14,
      rotateX: -y * 10,
      duration: 0.45,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    if (!shelfRef.current) return;
    gsap.to(shelfRef.current, {
      rotateY: -4,
      rotateX: 2,
      duration: 0.7,
      ease: 'power2.out',
    });
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-border/40">
      {/* Background radial gradients and subtle grid lines */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-10 right-1/4 h-[520px] w-[520px] rounded-full bg-brand-blue/15 blur-[120px]" />
        <div className="absolute top-48 -left-20 h-[440px] w-[440px] rounded-full bg-brand-gold/15 blur-[100px]" />
        <div className="column-lines absolute inset-0 opacity-40" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-12 items-center">
          {/* Left Column: Display Typography, CTAs, and Perforated Receipt */}
          <div className="lg:col-span-6 space-y-6">
            <div className="eyebrow">
              NIGERIAN UNIVERSITIES · TUITION · HOSTELS · PLEDGES
            </div>

            <WordReveal
              lines={[
                'Every semester',
                'funded, before',
                '*the deadline.*',
              ]}
              as="h1"
              className="display-xl text-neutral-950 dark:text-white"
            />

            <p className="max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed">
              EduFund helps Nigerian university students and their sponsors plan, save towards,
              and collectively fund tuition and campus accommodation before payment deadlines.
              Direct, transparent, and debt-free.
            </p>

            {/* Pill Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <PillButton href="#tracks" variant="primary">
                Explore funding tracks
              </PillButton>
              <PillButton href="/goals/new" variant="ghost" icon={Plus}>
                Start an education goal
              </PillButton>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center gap-6 pt-1 text-xs text-muted-foreground font-mono">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-brand-blue" />
                <span>Verified university calendars</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-brand-gold" />
                <span>Integer kobo precision</span>
              </div>
            </div>

            {/* Perforated Receipt Ticket (Template Style) */}
            <div className="pt-4">
              <div
                className="receipt max-w-md p-5 rounded-t-lg transition-transform duration-300 hover:rotate-0 -rotate-1"
                style={{ filter: 'drop-shadow(0 20px 35px rgba(0,0,0,0.18))' }}
              >
                {/* Receipt Header */}
                <div className="flex items-start justify-between border-b border-dashed border-neutral-300 dark:border-neutral-700 pb-3">
                  <div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
                      <span className="inline-block h-2 w-2 rounded-full bg-brand-gold animate-pulse" />
                      EDUFUND · RECENT VERIFIED CONTRIBUTIONS
                    </div>
                    <div className="mt-0.5 text-[9px] text-neutral-400">
                      LIVE NIGERIAN STUDENT REGISTRY · 2026
                    </div>
                  </div>
                  <span className="stamp text-[10px]">VERIFIED</span>
                </div>

                {/* Line Items */}
                <div className="my-3 space-y-2 text-xs">
                  {[
                    { time: '11 min ago', title: 'Computer Science Tuition', school: 'UNILAG', amount: 5000000 },
                    { time: '24 min ago', title: 'Clinical Medicine 400L', school: 'UI Ibadan', amount: 10000000 },
                    { time: '38 min ago', title: 'Off-Campus Hostel Rent', school: 'FUTO', amount: 2500000 },
                    { time: '52 min ago', title: 'Pharmacy Laboratory Gear', school: 'OAU Ife', amount: 1500000 },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-2">
                      <div className="truncate">
                        <span className="text-[10px] text-neutral-400">{item.time} </span>
                        <span className="font-semibold text-neutral-800 dark:text-neutral-200">{item.title}</span>
                        <span className="text-[10px] text-neutral-500"> ({item.school})</span>
                      </div>
                      <span className="font-bold text-neutral-900 dark:text-white shrink-0">
                        {formatNaira(item.amount)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Receipt Footer */}
                <div className="border-t border-dashed border-neutral-300 dark:border-neutral-700 pt-3">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span>COWRYWISE YIELD MATCH</span>
                    <span className="text-emerald-600">+8.5% p.a.</span>
                  </div>
                  <div className="mt-1 text-[10px] text-neutral-500">
                    ₦48.2M funded across 42 universities · 98.7% on-time registration
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Perspective Floating Goal Display (Shelfline Style) */}
          <div
            className="lg:col-span-6 flex flex-col items-center lg:items-end w-full min-w-0"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div
              ref={shelfRef}
              className="scene-3d w-full max-w-lg space-y-2 sm:space-y-4 will-change-transform"
              style={{
                perspective: '1400px',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* TOP SHELF — 3D Goals */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                {heroGoals.slice(0, 3).map((goal) => {
                  const percent = Math.round((goal.raisedKobo / goal.targetKobo) * 100);
                  const isSelected = selectedGoal?.id === goal.id;

                  return (
                    <motion.div
                      key={goal.id}
                      onClick={() => setSelectedGoal(goal)}
                      whileHover={{ y: -8, scale: 1.04, rotateY: -2 }}
                      transition={{ duration: 0.35, ease: EASE_SPRING }}
                      className="cursor-pointer"
                    >
                      <div
                        className={`preserve-3d relative h-36 sm:h-52 rounded-xl bg-gradient-to-br ${goal.gradient} p-2 sm:p-3 text-white shadow-xl border-t border-r border-white/25 flex flex-col justify-between overflow-hidden transition-all ${
                          isSelected ? 'ring-2 ring-brand-gold shadow-[0_20px_40px_rgba(245,166,35,0.4)]' : ''
                        }`}
                        style={{
                          transform: 'perspective(800px) rotateY(-8deg) rotateX(3deg)',
                        }}
                      >
                        <span className={`self-start rounded px-1 sm:px-1.5 py-0.5 text-[7px] sm:text-[8px] font-black uppercase ${goal.badgeColor}`}>
                          {goal.badge}
                        </span>

                        <div className="my-auto">
                          <h4 className="text-[11px] sm:text-xs font-bold leading-tight line-clamp-2">
                            {goal.title}
                          </h4>
                          <p className="mt-0.5 sm:mt-1 text-[8px] sm:text-[9px] text-white/75 line-clamp-1">
                            {goal.institution.split('(')[0]}
                          </p>
                        </div>

                        <div>
                          <div className="flex justify-between text-[8px] sm:text-[9px] font-bold">
                            <span>{formatNairaShort(goal.targetKobo)}</span>
                            <span className="text-brand-gold-light">{percent}%</span>
                          </div>
                          <div className="mt-1 h-1 w-full rounded-full bg-black/40 overflow-hidden">
                            <div className="h-full bg-brand-gold" style={{ width: `${percent}%` }} />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Top Shelf Plank (Shelfline Reference) */}
              <div className="relative -mt-1 mb-4 sm:mb-6">
                <div className="h-2.5 sm:h-3 w-full rounded-sm bg-gradient-to-b from-neutral-800 via-neutral-900 to-black shadow-[0_16px_28px_rgba(0,0,0,0.85)] border-t border-neutral-600/50" />
                <div className="h-1 w-full bg-black/60 blur-xs" />
              </div>

              {/* BOTTOM SHELF — 3D Goals */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                {heroGoals.slice(3, 6).map((goal) => {
                  const percent = Math.round((goal.raisedKobo / goal.targetKobo) * 100);
                  const isSelected = selectedGoal?.id === goal.id;

                  return (
                    <motion.div
                      key={goal.id}
                      onClick={() => setSelectedGoal(goal)}
                      whileHover={{ y: -8, scale: 1.04, rotateY: -2 }}
                      transition={{ duration: 0.35, ease: EASE_SPRING }}
                      className="cursor-pointer"
                    >
                      <div
                        className={`preserve-3d relative h-36 sm:h-52 rounded-xl bg-gradient-to-br ${goal.gradient} p-2 sm:p-3 text-white shadow-xl border-t border-r border-white/25 flex flex-col justify-between overflow-hidden transition-all ${
                          isSelected ? 'ring-2 ring-brand-gold shadow-[0_20px_40px_rgba(245,166,35,0.4)]' : ''
                        }`}
                        style={{
                          transform: 'perspective(800px) rotateY(-8deg) rotateX(3deg)',
                        }}
                      >
                        <span className={`self-start rounded px-1 sm:px-1.5 py-0.5 text-[7px] sm:text-[8px] font-black uppercase ${goal.badgeColor}`}>
                          {goal.badge}
                        </span>

                        <div className="my-auto">
                          <h4 className="text-[11px] sm:text-xs font-bold leading-tight line-clamp-2">
                            {goal.title}
                          </h4>
                          <p className="mt-0.5 sm:mt-1 text-[8px] sm:text-[9px] text-white/75 line-clamp-1">
                            {goal.institution.split('(')[0]}
                          </p>
                        </div>

                        <div>
                          <div className="flex justify-between text-[8px] sm:text-[9px] font-bold">
                            <span>{formatNairaShort(goal.targetKobo)}</span>
                            <span className="text-brand-gold-light">{percent}%</span>
                          </div>
                          <div className="mt-1 h-1 w-full rounded-full bg-black/40 overflow-hidden">
                            <div className="h-full bg-brand-gold" style={{ width: `${percent}%` }} />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Bottom Shelf Plank (Shelfline Reference) */}
              <div className="relative -mt-1 mb-2">
                <div className="h-2.5 sm:h-3 w-full rounded-sm bg-gradient-to-b from-neutral-800 via-neutral-900 to-black shadow-[0_16px_28px_rgba(0,0,0,0.85)] border-t border-neutral-600/50" />
                <div className="h-1 w-full bg-black/60 blur-xs" />
              </div>
            </div>

            {/* Interactive Selected Goal Preview Box (Shelfline Popover Style) */}
            {selectedGoal && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: EASE_OUT }}
                className="mt-6 w-full max-w-md rounded-2xl border border-border bg-card p-4 shadow-2xl"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`rounded px-1.5 py-0.5 text-[10px] font-black uppercase ${selectedGoal.badgeColor}`}>
                        {selectedGoal.badge}
                      </span>
                      <span className="text-xs text-muted-foreground">{selectedGoal.institution}</span>
                    </div>
                    <h3 className="mt-1.5 text-base font-bold leading-snug">
                      {selectedGoal.title}
                    </h3>
                    <p className="text-xs text-brand-gold font-medium">
                      Student: {selectedGoal.studentName} · {selectedGoal.deadlineDays} days to school fee deadline
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedGoal(null)}
                    className="rounded-full p-1 text-muted-foreground hover:bg-muted"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2 rounded-xl bg-muted/60 p-2.5 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase">Target</span>
                    <p className="font-bold">{formatNaira(selectedGoal.targetKobo)}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase">Funded</span>
                    <p className="font-bold text-emerald-500">
                      {Math.round((selectedGoal.raisedKobo / selectedGoal.targetKobo) * 100)}%
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase">Remaining</span>
                    <p className="font-bold text-red-500">
                      {formatNairaShort(selectedGoal.targetKobo - selectedGoal.raisedKobo)}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <Link href={`/fund/${selectedGoal.slug}`} className="flex-1">
                    <button className="w-full rounded-full gradient-bg-blue text-white font-bold h-9 text-xs flex items-center justify-center gap-1.5 hover:opacity-95 shadow-md">
                      <Heart className="h-3.5 w-3.5 text-brand-gold" />
                      Sponsor this student
                    </button>
                  </Link>
                  <Link href={`/fund/${selectedGoal.slug}`}>
                    <button className="rounded-full border border-border px-3.5 h-9 text-xs font-semibold hover:bg-muted">
                      View details
                    </button>
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

