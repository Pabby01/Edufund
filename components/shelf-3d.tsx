'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { formatNaira, formatNairaShort } from '@/lib/finance';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  GraduationCap,
  Home,
  BookOpen,
  Sparkles,
  Heart,
  ArrowRight,
  Clock,
  CheckCircle2,
  X,
} from 'lucide-react';

export interface ShelfGoal {
  id: string;
  slug: string;
  title: string;
  category: 'tuition' | 'accommodation' | 'books' | 'other';
  institution: string;
  studentName: string;
  targetKobo: number;
  raisedKobo: number;
  deadlineDays: number;
  badge: string;
  badgeColor: string;
  coverGradient: string;
  spineColor: string;
}

const mockShelfGoals: ShelfGoal[] = [
  // Tier 1 (Top Shelf)
  {
    id: '1',
    slug: 'unilag-cs-tuition-2026',
    title: 'Computer Science Tuition',
    category: 'tuition',
    institution: 'University of Lagos (UNILAG)',
    studentName: 'Tunde Bakare',
    targetKobo: 45000000,
    raisedKobo: 31000000,
    deadlineDays: 24,
    badge: 'MOST URGENT',
    badgeColor: 'bg-red-500/90 text-white',
    coverGradient: 'from-blue-600 via-blue-700 to-indigo-900',
    spineColor: '#1e3a8a',
  },
  {
    id: '2',
    slug: 'ui-clinical-medicine',
    title: 'Clinical Medicine 400L',
    category: 'tuition',
    institution: 'University of Ibadan (UI)',
    studentName: 'Amina Bello',
    targetKobo: 65000000,
    raisedKobo: 48000000,
    deadlineDays: 38,
    badge: 'TOP FUNDED',
    badgeColor: 'bg-brand-gold text-slate-950 font-bold',
    coverGradient: 'from-amber-500 via-orange-600 to-amber-800',
    spineColor: '#b45309',
  },
  {
    id: '3',
    slug: 'futo-eng-toolkit',
    title: 'Mechanical Workshop Kit',
    category: 'books',
    institution: 'FUTO Owerri',
    studentName: 'Chidi Okonkwo',
    targetKobo: 18000000,
    raisedKobo: 14500000,
    deadlineDays: 16,
    badge: 'NEW',
    badgeColor: 'bg-emerald-500 text-white',
    coverGradient: 'from-emerald-600 via-teal-700 to-slate-900',
    spineColor: '#065f46',
  },

  // Tier 2 (Middle Shelf)
  {
    id: '4',
    slug: 'unn-campus-hostel',
    title: 'Off-Campus Lodge Deposit',
    category: 'accommodation',
    institution: 'University of Nigeria, Nsukka',
    studentName: 'Ngozi Eze',
    targetKobo: 22000000,
    raisedKobo: 12000000,
    deadlineDays: 19,
    badge: 'HOT',
    badgeColor: 'bg-rose-500 text-white',
    coverGradient: 'from-purple-600 via-indigo-700 to-slate-900',
    spineColor: '#4338ca',
  },
  {
    id: '5',
    slug: 'oau-law-prep',
    title: 'Faculty of Law Session Dues',
    category: 'tuition',
    institution: 'Obafemi Awolowo Univ (OAU)',
    studentName: 'Segun Adeleke',
    targetKobo: 32000000,
    raisedKobo: 29000000,
    deadlineDays: 9,
    badge: '90% FUNDED',
    badgeColor: 'bg-emerald-600 text-white',
    coverGradient: 'from-slate-700 via-blue-900 to-slate-950',
    spineColor: '#1e293b',
  },
  {
    id: '6',
    slug: 'abu-architecture-gear',
    title: 'Architecture Drafting Gear',
    category: 'books',
    institution: 'Ahmadu Bello Univ (ABU)',
    studentName: 'Fatima Garba',
    targetKobo: 15000000,
    raisedKobo: 8500000,
    deadlineDays: 31,
    badge: 'VERIFIED',
    badgeColor: 'bg-blue-500 text-white',
    coverGradient: 'from-cyan-600 via-blue-800 to-slate-900',
    spineColor: '#0e7490',
  },

  // Tier 3 (Bottom Shelf)
  {
    id: '7',
    slug: 'uniben-pharmacy',
    title: 'Pharmacy Lab Manuals & Reg',
    category: 'tuition',
    institution: 'University of Benin (UNIBEN)',
    studentName: 'Osagie Imasuen',
    targetKobo: 28000000,
    raisedKobo: 21000000,
    deadlineDays: 27,
    badge: 'COMMUNITY',
    badgeColor: 'bg-amber-600 text-white',
    coverGradient: 'from-amber-600 via-yellow-700 to-stone-900',
    spineColor: '#78350f',
  },
  {
    id: '8',
    slug: 'lasu-final-clearance',
    title: 'Final Year Project & Clearance',
    category: 'other',
    institution: 'Lagos State Univ (LASU)',
    studentName: 'Kehinde Alabi',
    targetKobo: 12000000,
    raisedKobo: 9500000,
    deadlineDays: 14,
    badge: 'CLEARANCE',
    badgeColor: 'bg-indigo-600 text-white',
    coverGradient: 'from-rose-700 via-pink-800 to-slate-950',
    spineColor: '#881337',
  },
  {
    id: '9',
    slug: 'covenant-stem-research',
    title: 'AI & Robotics Capstone Fee',
    category: 'books',
    institution: 'Covenant University',
    studentName: 'David Oyewole',
    targetKobo: 25000000,
    raisedKobo: 17500000,
    deadlineDays: 45,
    badge: 'ALUMNI MATCH',
    badgeColor: 'bg-brand-blue text-white font-bold',
    coverGradient: 'from-sky-600 via-blue-700 to-indigo-950',
    spineColor: '#1d4ed8',
  },
];

export function Shelf3D({ className = '' }: { className?: string }) {
  const [selectedGoal, setSelectedGoal] = useState<ShelfGoal | null>(mockShelfGoals[0]);
  const [hoveredGoal, setHoveredGoal] = useState<ShelfGoal | null>(null);

  // Split into 3 tiers (3 goals per shelf)
  const tiers = [
    mockShelfGoals.slice(0, 3),
    mockShelfGoals.slice(3, 6),
    mockShelfGoals.slice(6, 9),
  ];

  return (
    <div className={`relative w-full max-w-2xl select-none ${className}`}>
      {/* 3D Shelf Container */}
      <div className="shelf-perspective space-y-12 sm:space-y-16 py-6">
        {tiers.map((tier, tierIdx) => (
          <div key={tierIdx} className="relative">
            {/* Shelf Items (Standing 3D Books) */}
            <div className="grid grid-cols-3 gap-4 sm:gap-8 px-4 sm:px-8 pb-1 items-end justify-items-center">
              {tier.map((goal) => {
                const percentage = Math.round((goal.raisedKobo / goal.targetKobo) * 100);
                const isSelected = selectedGoal?.id === goal.id;

                return (
                  <div
                    key={goal.id}
                    onClick={() => setSelectedGoal(goal)}
                    onMouseEnter={() => setHoveredGoal(goal)}
                    onMouseLeave={() => setHoveredGoal(null)}
                    className="group relative cursor-pointer"
                  >
                    {/* The 3D Standing Book */}
                    <div
                      className={`book-standing relative w-24 sm:w-32 h-36 sm:h-48 rounded-r-md rounded-l-[2px] bg-gradient-to-br ${goal.coverGradient} p-2.5 sm:p-3 text-white overflow-hidden border-t border-r border-white/25`}
                      style={{
                        transform: isSelected
                          ? 'perspective(700px) rotateY(-2deg) translateY(-14px) scale(1.06)'
                          : undefined,
                      }}
                    >
                      {/* Book spine simulation on the left edge */}
                      <div className="book-spine" />

                      {/* Cover content */}
                      <div className="relative z-10 flex h-full flex-col justify-between">
                        {/* Top Badge */}
                        <div className="flex items-start justify-between">
                          <span
                            className={`rounded-[3px] px-1.5 py-0.5 text-[8px] sm:text-[9px] font-black uppercase tracking-wider shadow-sm ${goal.badgeColor}`}
                          >
                            {goal.badge}
                          </span>
                        </div>

                        {/* Title & School */}
                        <div className="my-auto">
                          <h4 className="text-[11px] sm:text-xs font-bold leading-tight line-clamp-2 drop-shadow-sm">
                            {goal.title}
                          </h4>
                          <p className="mt-1 text-[8px] sm:text-[9px] text-white/80 line-clamp-1">
                            {goal.institution.split('(')[0]}
                          </p>
                        </div>

                        {/* Bottom Metric & Progress Bar */}
                        <div>
                          <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-bold">
                            <span>{formatNairaShort(goal.targetKobo)}</span>
                            <span className="text-brand-gold-light">{percentage}%</span>
                          </div>
                          <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-black/40">
                            <div
                              className="h-full bg-brand-gold transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Glossy light sweep reflection */}
                      <div className="pointer-events-none absolute -inset-full bg-gradient-to-tr from-transparent via-white/10 to-transparent group-hover:translate-x-full transition-transform duration-700" />
                    </div>

                    {/* Ground contact shadow */}
                    <div className="mx-auto mt-0.5 h-1.5 w-20 sm:w-28 rounded-full bg-black/60 blur-[3px]" />
                  </div>
                );
              })}
            </div>

            {/* The Solid 3D Wooden Shelf Plank */}
            <div className="shelf-wood relative h-3.5 sm:h-4 w-full">
              {/* Highlight line on top edge */}
              <div className="absolute inset-x-0 top-0 h-[1px] bg-white/20" />
              {/* Front edge shadow */}
              <div className="absolute inset-x-0 bottom-0 h-[1px] bg-black/60" />
            </div>

            {/* Shelf Under-Shadow */}
            <div className="mx-auto h-4 w-[98%] bg-gradient-to-b from-black/50 to-transparent blur-sm" />
          </div>
        ))}
      </div>

      {/* Interactive Popover Box (Shelfline "Pick up / Add" floating modal, Image 3) */}
      {selectedGoal && (
        <div className="relative mx-auto mt-2 max-w-md rounded-2xl border border-white/20 bg-slate-900/95 p-4 text-white shadow-2xl backdrop-blur-xl animate-fade-up">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className={`rounded px-1.5 py-0.5 text-[10px] font-black uppercase ${selectedGoal.badgeColor}`}>
                  {selectedGoal.badge}
                </span>
                <span className="text-xs text-white/60">{selectedGoal.institution}</span>
              </div>
              <h3 className="mt-1 text-base font-bold text-white leading-snug">
                {selectedGoal.title}
              </h3>
              <p className="text-xs text-brand-gold">
                Student: {selectedGoal.studentName} · {selectedGoal.deadlineDays} days to deadline
              </p>
            </div>

            <button
              onClick={() => setSelectedGoal(null)}
              className="rounded-full p-1 text-white/60 hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Pricing & Progress Row */}
          <div className="mt-3 grid grid-cols-3 gap-2 rounded-xl bg-black/40 p-2.5 text-xs">
            <div>
              <span className="text-[10px] text-white/50">Target</span>
              <p className="font-bold">{formatNaira(selectedGoal.targetKobo)}</p>
            </div>
            <div>
              <span className="text-[10px] text-white/50">Funded</span>
              <p className="font-bold text-emerald-400">
                {Math.round((selectedGoal.raisedKobo / selectedGoal.targetKobo) * 100)}%
              </p>
            </div>
            <div>
              <span className="text-[10px] text-white/50">Remaining Gap</span>
              <p className="font-bold text-red-400">
                {formatNairaShort(selectedGoal.targetKobo - selectedGoal.raisedKobo)}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-3 flex items-center gap-2">
            <Link href={`/fund/${selectedGoal.slug}`} className="flex-1">
              <Button size="sm" className="w-full gradient-bg-blue text-white font-bold h-9">
                <Heart className="mr-1.5 h-3.5 w-3.5 text-brand-gold" />
                Give to this student
              </Button>
            </Link>
            <Link href={`/fund/${selectedGoal.slug}`}>
              <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10 h-9">
                View goal
                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

