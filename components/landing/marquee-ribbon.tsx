'use client';

import React from 'react';
import { formatNaira } from '@/lib/finance';

const ribbonEvents = [
  { time: '09:14', school: 'UNILAG', title: 'Computer Science 300L Tuition', amount: 5000000, tag: 'VERIFIED' },
  { time: '09:42', school: 'UI Ibadan', title: 'Clinical Medicine Year 4', amount: 10000000, tag: 'FUNDED' },
  { time: '10:08', school: 'FUTO Owerri', title: 'Hostel Accommodation Deposit', amount: 2500000, tag: 'PLEDGED' },
  { time: '10:35', school: 'OAU Ile-Ife', title: 'Pharmacy Laboratory Gear', amount: 1500000, tag: 'VERIFIED' },
  { time: '11:02', school: 'UNN Nsukka', title: 'Engineering Workshop Registration', amount: 3500000, tag: 'FUNDED' },
  { time: '11:28', school: 'ABU Zaria', title: 'Architecture Studio Manuals', amount: 2000000, tag: 'SPONSORED' },
  { time: '11:55', school: 'LASU Ojo', title: 'Final Year Clearance & Transcript', amount: 4500000, tag: 'VERIFIED' },
  { time: '12:20', school: 'UNIBEN', title: 'Dentistry Clinical Kit', amount: 3000000, tag: 'FUNDED' },
];

export function MarqueeRibbon() {
  const loopList = [...ribbonEvents, ...ribbonEvents];

  return (
    <div className="relative overflow-hidden w-full max-w-full border-y border-dashed border-border/80 bg-neutral-900 dark:bg-black py-3 font-mono text-xs text-neutral-200 select-none">
      <div className="flex w-max animate-marquee gap-8 whitespace-nowrap">
        {loopList.map((item, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <span className="inline-block h-2 w-2 rounded-full bg-brand-gold animate-pulse" />
            <span className="text-neutral-400">{item.time}</span>
            <span className="font-bold text-white">{item.school}</span>
            <span className="text-neutral-300">{item.title}</span>
            <span className="font-bold text-brand-gold">{formatNaira(item.amount)}</span>
            <span className="rounded border border-red-500/60 bg-red-500/10 px-1.5 py-0.5 text-[9px] font-bold text-red-400 uppercase">
              {item.tag}
            </span>
            <span className="text-neutral-600">·</span>
          </div>
        ))}
      </div>
    </div>
  );
}

