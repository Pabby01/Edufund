'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { WordReveal } from './primitives';
import { Star, Pin } from 'lucide-react';

interface ReceiptReview {
  id: string;
  name: string;
  role: string;
  quote: string;
  campaign: string;
  number: string;
  tag: string;
}

const reviews: ReceiptReview[] = [
  {
    id: '1',
    name: 'Dr. Kelechi Nwosu',
    role: 'Alumni Sponsor, Lagos',
    quote: 'Being able to pledge ₦25,000 monthly for two indigent medical students and seeing their fees cleared directly before matriculation was the cleanest giving experience.',
    campaign: 'Clinical Medicine 400L',
    number: '#1004',
    tag: 'SPONSORED',
  },
  {
    id: '2',
    name: 'Tunde Bakare',
    role: 'Student, UNILAG 300L',
    quote: 'My father fell ill right as school fee portal was closing. EduFund allowed 14 classmates and diaspora relatives to contribute my ₦450,000 tuition in 9 days.',
    campaign: 'Computer Science Tuition',
    number: '#1037',
    tag: 'FUNDED',
  },
  {
    id: '3',
    name: 'Folashade Adeleke',
    role: 'Mentor & Sponsor, Abuja',
    quote: 'No student should be sent away from exams over ₦60,000 accommodation arrears. The transparent kobo receipt breakdown gives complete accountability.',
    campaign: 'Off-Campus Lodge Rent',
    number: '#1089',
    tag: 'VERIFIED',
  },
  {
    id: '4',
    name: 'Chidi Okonkwo',
    role: 'Finalist, FUTO Owerri',
    quote: 'Got my mechanical workshop toolkit funded by three engineering alumni. I sat for my accreditation exams without any hindrance.',
    campaign: 'Workshop Gear Kit',
    number: '#1112',
    tag: 'FUNDED',
  },
  {
    id: '5',
    name: 'Amina Bello',
    role: 'Medical Student, UI Ibadan',
    quote: 'Cowrywise locked savings matched our campaign yield. The funds settled our hospital lodge invoice directly without third-party fees.',
    campaign: 'Teaching Hospital Hostel',
    number: '#1145',
    tag: 'VERIFIED',
  },
];

export function ReceiptWall() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section className="relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8 border-b border-border/40">
      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
          <div className="max-w-xl space-y-3">
            <div className="eyebrow">
              VERIFIED IMPACT
            </div>
            <WordReveal
              lines={[
                'Receipts from',
                'real students & sponsors.',
              ]}
              className="display-lg text-neutral-950 dark:text-white"
            />
          </div>
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
            Every receipt is tied to a verified university invoice.
          </p>
        </div>

        {/* Horizontal scrollable row of pinned receipts */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-8 pt-4 scrollbar-none snap-x snap-mandatory"
        >
          {reviews.map((rev) => (
            <motion.div
              key={rev.id}
              whileHover={{ y: -6, rotate: 0 }}
              className="receipt shrink-0 w-80 sm:w-96 p-6 rounded-t-lg transition-transform duration-300 font-mono text-xs text-neutral-900 snap-center select-none"
              style={{
                transform: rev.id === '2' ? 'rotate(1deg)' : rev.id === '4' ? 'rotate(-1.5deg)' : 'rotate(-0.5deg)',
              }}
            >
              {/* Thumbtack pin on top center */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-red-600 shadow-md border-2 border-white" />
              </div>

              {/* Receipt Header */}
              <div className="flex items-center justify-between border-b border-dashed border-neutral-300 pb-2.5">
                <span className="font-bold text-[10px] text-neutral-500 tracking-widest uppercase">
                  VERIFIED IMPACT
                </span>
                <span className="text-[10px] text-neutral-400 font-bold">{rev.number}</span>
              </div>

              {/* 5 Stars */}
              <div className="flex gap-1 my-3 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>

              {/* Quote */}
              <p className="font-sans text-xs sm:text-sm text-neutral-800 leading-relaxed italic mb-4">
                &ldquo;{rev.quote}&rdquo;
              </p>

              {/* Author Info */}
              <div className="border-t border-dashed border-neutral-300 pt-3 flex items-center justify-between">
                <div>
                  <h5 className="font-sans font-bold text-xs text-neutral-900">{rev.name}</h5>
                  <p className="text-[10px] text-neutral-500">{rev.role}</p>
                </div>
                <span className="stamp text-[9px]">{rev.tag}</span>
              </div>

              {/* Goal reference */}
              <div className="mt-3 pt-2 border-t border-neutral-200 text-[10px] text-neutral-500 flex justify-between">
                <span>{rev.campaign}</span>
                <span className="font-bold text-neutral-700">100% FUNDED</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

