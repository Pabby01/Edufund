'use client';

import React from 'react';
import { formatNaira } from '@/lib/finance';

const tickerEvents = [
  { time: '10:14', school: 'UNILAG', title: 'Computer Science Tuition', amount: 50000, tag: 'VERIFIED' },
  { time: '10:34', school: 'UI Ibadan', title: 'Clinical Medicine 400L', amount: 100000, tag: 'FUNDED' },
  { time: '11:08', school: 'FUTO', title: 'Hostel Accommodation', amount: 25000, tag: 'PLEDGED' },
  { time: '11:29', school: 'OAU Ife', title: 'Pharmacy Laboratory Gear', amount: 15000, tag: 'VERIFIED' },
  { time: '11:54', school: 'UNN Nsukka', title: 'Engineering Workshop Dues', amount: 35000, tag: 'FUNDED' },
  { time: '12:15', school: 'ABU Zaria', title: 'Architecture Studio Manuals', amount: 20000, tag: 'SPONSORED' },
  { time: '12:40', school: 'LASU', title: 'Final Year Clearance', amount: 45000, tag: 'VERIFIED' },
];

export function MarqueeTicker({ className = '' }: { className?: string }) {
  // Duplicate for seamless loop
  const list = [...tickerEvents, ...tickerEvents];

  return (
    <div className={`relative overflow-hidden border-y border-dashed border-border/80 bg-neutral-900 py-3 font-mono text-xs text-neutral-200 select-none ${className}`}>
      <div className="flex w-max animate-marquee gap-8 whitespace-nowrap">
        {list.map((item, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <span className="inline-block h-2 w-2 rounded-full bg-brand-gold animate-pulse" />
            <span className="text-neutral-400">{item.time}</span>
            <span className="font-bold text-white">{item.school}</span>
            <span className="text-neutral-300">{item.title}</span>
            <span className="font-bold text-brand-gold">{formatNaira(item.amount * 100)}</span>
            <span className="rounded border border-red-500/60 bg-red-500/10 px-1.5 py-0.5 text-[10px] font-bold text-red-400 uppercase">
              {item.tag}
            </span>
            <span className="text-neutral-600">·</span>
          </div>
        ))}
      </div>
    </div>
  );
}

