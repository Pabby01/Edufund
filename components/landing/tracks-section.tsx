'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { WordReveal, PillButton, EASE_OUT, EASE_SPRING } from './primitives';
import {
  GraduationCap,
  Home,
  BookOpen,
  FolderCheck,
  ArrowRight,
  ArrowUpRight,
} from 'lucide-react';

interface FundingTrack {
  num: string;
  name: string;
  category: string;
  count: string;
  desc: string;
  imgUrl: string;
  tag: string;
}

const tracks: FundingTrack[] = [
  {
    num: '01',
    name: 'Tuition & University Fees',
    category: 'tuition',
    count: '34 CAMPAIGNS',
    desc: 'Undergraduate school fees, departmental dues, and semester registration fees locked into automated countdown targets before school portals close.',
    imgUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=70',
    tag: 'MOST CRITICAL',
  },
  {
    num: '02',
    name: 'Campus & Off-Campus Hostels',
    category: 'accommodation',
    count: '19 CAMPAIGNS',
    desc: 'Off-campus lodge deposits, annual student rent, and campus hostel fees funded directly to avoid student displacement and tenancy evictions.',
    imgUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=70',
    tag: 'HIGH URGENCY',
  },
  {
    num: '03',
    name: 'Medical, STEM & Textbooks',
    category: 'books',
    count: '14 CAMPAIGNS',
    desc: 'Clinical diagnostic kits, engineering drawing gear, laptop workstation repairs, and essential faculty textbooks required for lab access.',
    imgUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=70',
    tag: 'ACADEMIC GEAR',
  },
  {
    num: '04',
    name: 'Finalist Project & Clearance',
    category: 'other',
    count: '8 CAMPAIGNS',
    desc: 'Capstone research fieldwork, laboratory consumable testing, dissertation binding, and senate graduation clearance fees.',
    imgUrl: 'https://images.pexels.com/photos/901964/pexels-photo-901964.jpeg?auto=compress&cs=tinysrgb&w=800',
    tag: 'CONVOCATION',
  },
];

export function TracksSection() {
  const [activeTrack, setActiveTrack] = useState<FundingTrack>(tracks[0]);

  return (
    <section id="tracks" className="relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8 border-b border-border/40">
      <div className="dot-grid absolute inset-0 opacity-40 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl">
        {/* Header Grid */}
        <div className="grid gap-8 lg:grid-cols-12 items-end pb-16 border-b border-border/60">
          <div className="lg:col-span-7 space-y-4">
            <div className="eyebrow">
              EDUCATION TRACKS
            </div>
            <WordReveal
              lines={[
                'Four tracks.',
                'One verified checkout.',
              ]}
              className="display-lg text-neutral-950 dark:text-white"
            />
          </div>

          <div className="lg:col-span-5 space-y-4">
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Every goal is backed by verified university fee schedules.
              Students save on their terms, invite alumni and family pledges,
              and settle campus portals on time.
            </p>
            <div className="pt-1">
              <PillButton href="/goals/new" variant="ink">
                Start a funding goal
              </PillButton>
            </div>
          </div>
        </div>

        {/* Numbered Rows with Interactive Floating Preview */}
        <div className="divide-y divide-border/60">
          {tracks.map((track) => {
            const isActive = activeTrack.num === track.num;

            return (
              <div
                key={track.num}
                onMouseEnter={() => setActiveTrack(track)}
                className={`group relative flex flex-col sm:flex-row sm:items-center justify-between py-8 sm:py-10 px-4 -mx-4 rounded-2xl transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-neutral-900 text-white shadow-xl'
                    : 'hover:bg-muted/40'
                }`}
              >
                {/* Left: Number & Big Title */}
                <div className="flex items-baseline gap-6 sm:gap-10">
                  <span
                    className={`font-mono text-sm sm:text-base font-bold ${
                      isActive ? 'text-brand-gold' : 'text-muted-foreground'
                    }`}
                  >
                    {track.num}
                  </span>
                  <div>
                    <h3
                      className={`text-2xl sm:text-4xl font-extrabold tracking-tight transition-colors ${
                        isActive ? 'text-white' : 'text-neutral-900 dark:text-white'
                      }`}
                    >
                      {track.name}
                    </h3>
                  </div>
                </div>

                {/* Right: Description & Action */}
                <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10 pl-12 sm:pl-0">
                  <div className="max-w-md">
                    <span
                      className={`font-mono text-[10px] font-bold tracking-widest uppercase block mb-1 ${
                        isActive ? 'text-brand-gold' : 'text-muted-foreground'
                      }`}
                    >
                      {track.count} · {track.tag}
                    </span>
                    <p
                      className={`text-xs sm:text-sm leading-relaxed ${
                        isActive ? 'text-neutral-300' : 'text-muted-foreground'
                      }`}
                    >
                      {track.desc}
                    </p>
                  </div>

                  <div className="shrink-0">
                    <Link href="/auth?mode=signup">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-mono font-bold tracking-widest uppercase transition-colors ${
                          isActive
                            ? 'text-brand-gold'
                            : 'text-muted-foreground group-hover:text-foreground'
                        }`}
                      >
                        EXPLORE TRACK
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

