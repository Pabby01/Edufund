'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  GraduationCap,
  Home,
  BookOpen,
  FolderCheck,
  ArrowUpRight,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface Aisle {
  num: string;
  name: string;
  category: string;
  count: string;
  desc: string;
  icon: typeof GraduationCap;
  tag: string;
  imgUrl: string;
}

const aisles: Aisle[] = [
  {
    num: '01',
    name: 'Tuition & University Fees',
    category: 'tuition',
    count: '34 CAMPAIGNS',
    desc: 'Undergraduate, postgraduate, and departmental dues with countdown reminders and locked savings plans.',
    icon: GraduationCap,
    tag: 'MOST POPULAR',
    imgUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80',
  },
  {
    num: '02',
    name: 'Campus & Off-Campus Hostels',
    category: 'accommodation',
    count: '19 CAMPAIGNS',
    desc: 'Lodge deposits, annual off-campus rent, and power/water utilities funded before tenancy deadlines.',
    icon: Home,
    tag: 'HIGH PRIORITY',
    imgUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80',
  },
  {
    num: '03',
    name: 'Textbooks, Lab Gear & STEM Kits',
    category: 'books',
    count: '14 CAMPAIGNS',
    desc: 'Clinical diagnostic kits, engineering drawing gear, laptop repairs, and essential faculty textbooks.',
    icon: BookOpen,
    tag: 'ESSENTIALS',
    imgUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80',
  },
  {
    num: '04',
    name: 'Finalist Projects & Clearance',
    category: 'other',
    count: '8 CAMPAIGNS',
    desc: 'Fieldwork surveys, capstone project binding, transcript fees, and graduation senate clearance.',
    icon: FolderCheck,
    tag: 'CONVOCATION',
    imgUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80',
  },
];

export function AislesSection({ className = '' }: { className?: string }) {
  const [activeAisle, setActiveAisle] = useState<Aisle | null>(aisles[0]);

  return (
    <section className={`relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8 bg-[#f8f6f0] dark:bg-[#0c1017] text-neutral-900 dark:text-neutral-100 transition-colors ${className}`}>
      {/* Background dot grid pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-40 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:20px_20px]" />

      <div className="relative mx-auto max-w-7xl">
        {/* Header Grid */}
        <div className="grid gap-8 lg:grid-cols-12 items-end pb-16 border-b border-neutral-300 dark:border-neutral-800">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest uppercase text-brand-gold-dark dark:text-brand-gold">
              <span>—</span> THE AISLES
            </div>
            <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-neutral-950 dark:text-white leading-[0.95]">
              Four aisles. <br />
              One verified checkout.
            </h2>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400">
              Every goal on EduFund is tied to an official university calendar and verified student identity. Sponsors contribute directly or pledge monthly with zero hidden fees.
            </p>
            <div className="pt-2">
              <Link href="/goals/new">
                <Button
                  size="lg"
                  className="rounded-full bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 font-bold px-6 h-12 shadow-md"
                >
                  Start an aisle goal
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* The Numbered Rows */}
        <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
          {aisles.map((aisle) => {
            const isHovered = activeAisle?.num === aisle.num;

            return (
              <div
                key={aisle.num}
                onMouseEnter={() => setActiveAisle(aisle)}
                className={`group relative flex flex-col sm:flex-row sm:items-center justify-between py-8 sm:py-10 transition-all duration-300 cursor-pointer ${
                  isHovered ? 'px-4 -mx-4 rounded-xl bg-neutral-900 text-white dark:bg-neutral-900/90' : 'hover:bg-neutral-100/60 dark:hover:bg-neutral-900/40'
                }`}
              >
                {/* Left: Number & Big Title */}
                <div className="flex items-baseline gap-6 sm:gap-10">
                  <span className={`font-mono text-sm sm:text-base font-bold ${isHovered ? 'text-brand-gold' : 'text-neutral-400 dark:text-neutral-600'}`}>
                    {aisle.num}
                  </span>
                  <div>
                    <h3 className={`text-2xl sm:text-4xl font-extrabold tracking-tight transition-colors ${
                      isHovered ? 'text-white' : 'text-neutral-900 dark:text-white'
                    }`}>
                      {aisle.name}
                    </h3>
                  </div>
                </div>

                {/* Right: Description & Action */}
                <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-12 pl-12 sm:pl-0">
                  <div className="max-w-md">
                    <span className={`font-mono text-[11px] font-bold tracking-wider uppercase block mb-1 ${
                      isHovered ? 'text-brand-gold' : 'text-neutral-500'
                    }`}>
                      {aisle.count}
                    </span>
                    <p className={`text-xs sm:text-sm leading-relaxed ${
                      isHovered ? 'text-neutral-300' : 'text-neutral-600 dark:text-neutral-400'
                    }`}>
                      {aisle.desc}
                    </p>
                  </div>

                  <div className="shrink-0">
                    <Link href={`/auth?mode=signup`}>
                      <span className={`inline-flex items-center gap-1.5 text-xs font-mono font-bold tracking-wider uppercase ${
                        isHovered ? 'text-brand-gold' : 'text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white'
                      }`}>
                        OPEN AISLE
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

