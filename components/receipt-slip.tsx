'use client';

import React from 'react';
import { formatNaira, formatNairaShort } from '@/lib/finance';
import { CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

export interface ReceiptItem {
  timeAgo: string;
  title: string;
  institution: string;
  amountKobo: number;
  status?: string;
}

const defaultItems: ReceiptItem[] = [
  { timeAgo: '12 min ago', title: 'Tuition Year 2', institution: 'UNILAG', amountKobo: 5000000, status: 'VERIFIED' },
  { timeAgo: '28 min ago', title: 'Hostel Deposit', institution: 'FUTO', amountKobo: 2500000, status: 'FUNDED' },
  { timeAgo: '45 min ago', title: 'Clinical Books', institution: 'OAU Ife', amountKobo: 1500000, status: 'VERIFIED' },
  { timeAgo: '1 hr ago', title: 'Final Clearance', institution: 'UNN', amountKobo: 3000000, status: 'FUNDED' },
];

export function ReceiptSlip({
  title = 'EDUFUND · RECENT CONTRIBUTIONS',
  items = defaultItems,
  totalLabel = '₦28.4M funded this semester · 98.6% on-time',
  stamp = 'VERIFIED',
  className = '',
}: {
  title?: string;
  items?: ReceiptItem[];
  totalLabel?: string;
  stamp?: string;
  className?: string;
}) {
  return (
    <div
      className={`receipt-paper relative w-full max-w-sm rounded-t-lg p-5 font-mono text-xs shadow-2xl transition-transform duration-300 hover:rotate-0 sm:-rotate-1 ${className}`}
      style={{
        boxShadow: '0 20px 40px -15px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,0,0,0.06)',
      }}
    >
      {/* Receipt Top Header */}
      <div className="flex items-start justify-between border-b border-dashed border-neutral-300 pb-3">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
            <span className="inline-block h-2 w-2 rounded-full bg-brand-gold" />
            {title}
          </div>
          <div className="mt-0.5 text-[9px] text-neutral-400">
            TERMINAL #{Math.floor(1000 + Math.random() * 9000)} · LAGOS, NG
          </div>
        </div>

        {/* Rubber Stamp */}
        {stamp && (
          <div className="rubber-stamp text-[10px]">
            {stamp}
          </div>
        )}
      </div>

      {/* Line Items */}
      <div className="my-3 space-y-2">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between gap-2 text-neutral-800">
            <div className="truncate">
              <span className="text-[10px] text-neutral-400">{item.timeAgo} </span>
              <span className="font-semibold">{item.title}</span>
              <span className="text-[10px] text-neutral-500"> ({item.institution})</span>
            </div>
            <div className="shrink-0 font-bold tracking-tight text-neutral-900">
              {formatNaira(item.amountKobo)}
            </div>
          </div>
        ))}
      </div>

      {/* Dotted separator */}
      <div className="border-t border-dashed border-neutral-300 pt-3">
        <div className="flex items-center justify-between text-[11px] font-bold text-neutral-700">
          <span>COWRYWISE YIELD MATCH</span>
          <span className="text-emerald-600">+8.5% p.a.</span>
        </div>
        <div className="mt-2 text-[10px] leading-tight text-neutral-500">
          {totalLabel}
        </div>
      </div>

      {/* Sawtooth Perforated Edge Bottom */}
      <div className="receipt-sawtooth -mx-5 -mb-5 mt-4" />
    </div>
  );
}

