'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { WordReveal, PillButton, EASE_OUT } from './primitives';
import { Play, CheckCircle2, Clock, ArrowRight } from 'lucide-react';

interface Milestone {
  num: string;
  phase: string;
  title: string;
  desc: string;
  timing: string;
  imgUrl: string;
}

const milestones: Milestone[] = [
  {
    num: '01',
    phase: 'STAGE 1 · SETUP',
    title: 'Goal creation & fee schedule verification',
    desc: 'Input your school, department, and official tuition invoice. EduFund verifies your registration deadline against the university academic calendar.',
    timing: '5 mins to set up',
    imgUrl: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=800&q=70',
  },
  {
    num: '02',
    phase: 'STAGE 2 · SAVINGS ENGINE',
    title: 'Automated Cowrywise locked savings',
    desc: 'Link an automated target savings plan suited to your deadline. Earn daily returns that offset your total gap without early withdrawal temptations.',
    timing: 'Locked to portal close',
    imgUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=70',
  },
  {
    num: '03',
    phase: 'STAGE 3 · SPONSOR CIRCLE',
    title: 'Activate family, alumni & mentor pledges',
    desc: 'Share your privacy-safe campaign URL via WhatsApp or social links. Sponsors commit to daily, weekly, or monthly pledges that project your gap to zero.',
    timing: 'Direct WhatsApp share',
    imgUrl: 'https://images.pexels.com/photos/38451631/pexels-photo-38451631.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    num: '04',
    phase: 'STAGE 4 · PROGRESS ALERTS',
    title: 'Milestone tracking & deadline countdown',
    desc: 'Automated weekly reminders alert sponsors to scheduled contribution dates, ensuring commitments are fulfilled ahead of portal penalties.',
    timing: 'Weekly SMS & email',
    imgUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=70',
  },
  {
    num: '05',
    phase: 'STAGE 5 · DISBURSEMENT',
    title: 'Direct university portal clearance',
    desc: 'Once your goal hits 100%, funds are verified and disbursed directly to settle your school portal Remita RRR invoice. 100% transparent and fraud-free.',
    timing: 'Instant receipt clearance',
    imgUrl: 'https://images.pexels.com/photos/901964/pexels-photo-901964.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

export function TimelineSyllabus() {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = milestones[activeIdx];

  return (
    <section className="relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8 border-b border-border/40">
      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <div className="max-w-2xl space-y-3 mb-16">
          <div className="eyebrow">
            THE STUDENT ROADMAP
          </div>
          <WordReveal
            lines={[
              'A funding plan that',
              'finishes on time.',
            ]}
            className="display-lg text-neutral-950 dark:text-white"
          />
          <p className="text-base text-muted-foreground">
            Clear milestones, one target at a time. Verified proof at every step
            so sponsors and students stay completely aligned.
          </p>
        </div>

        {/* 2-Column Interactive Syllabus */}
        <div className="grid gap-12 lg:grid-cols-12 items-start">
          {/* Left: Active Milestone Media Card */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-border bg-card">
              <div className="relative h-64 sm:h-72 w-full overflow-hidden">
                <img
                  src={active.imgUrl}
                  alt={active.title}
                  className="h-full w-full object-cover transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                {/* Top tracker */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white font-mono text-xs">
                  <span className="flex items-center gap-1.5 font-bold text-brand-gold uppercase tracking-widest">
                    <span className="h-2 w-2 rounded-full bg-brand-gold animate-ping" />
                    ACTIVE MILESTONE
                  </span>
                  <span>{active.num} / 05</span>
                </div>

                {/* Bottom title inside media */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="font-mono text-[10px] tracking-widest text-brand-gold uppercase block">
                    {active.phase}
                  </span>
                  <h4 className="text-xl font-bold leading-snug mt-1">
                    {active.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-2 text-xs text-white/70 font-mono">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{active.timing}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-6 space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {active.desc}
                </p>
                <div className="pt-1">
                  <PillButton href="/goals/new" variant="primary">
                    Start this roadmap
                  </PillButton>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Interactive Steps List */}
          <div className="lg:col-span-7 space-y-3">
            {milestones.map((item, idx) => {
              const isSelected = activeIdx === idx;

              return (
                <div
                  key={item.num}
                  onClick={() => setActiveIdx(idx)}
                  className={`group relative p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? 'border-brand-gold bg-muted/60 shadow-lg'
                      : 'border-border/60 hover:border-border hover:bg-muted/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3 font-mono text-xs">
                        <span className={`font-bold ${isSelected ? 'text-brand-gold' : 'text-muted-foreground'}`}>
                          {item.num}
                        </span>
                        <span className="text-[10px] tracking-widest text-muted-foreground uppercase">
                          {item.phase}
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-neutral-900 dark:text-white pt-1">
                        {item.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pt-1">
                        {item.desc}
                      </p>
                    </div>

                    <div className="shrink-0 pt-1">
                      <span className="font-mono text-[11px] text-muted-foreground font-semibold">
                        {item.timing}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

