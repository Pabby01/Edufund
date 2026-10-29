'use client';

import React from 'react';
import { WordReveal, useCountUp } from './primitives';

const weeklyData = [
  { day: 'M', height: '45%' },
  { day: 'T', height: '60%' },
  { day: 'W', height: '80%' },
  { day: 'T', height: '95%' },
  { day: 'F', height: '70%' },
  { day: 'S', height: '50%' },
  { day: 'S', height: '40%' },
];

const institutions = [
  'University of Lagos (UNILAG)',
  'University of Ibadan (UI)',
  'Obafemi Awolowo University (OAU)',
  'University of Nigeria, Nsukka (UNN)',
  'Ahmadu Bello University (ABU)',
  'Federal Univ of Technology, Owerri (FUTO)',
  'Lagos State University (LASU)',
  'University of Benin (UNIBEN)',
];

export function ImpactNumbers() {
  const nairaRef = useCountUp(48, 1800);
  const universitiesRef = useCountUp(42, 1400);
  const studentsRef = useCountUp(3400, 2000);

  return (
    <section className="relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8 border-b border-border/40 bg-card/30">
      <div className="relative mx-auto max-w-7xl">
        <div className="max-w-xl space-y-3 mb-16">
          <div className="eyebrow">
            IMPACT IN NUMBERS
          </div>
          <WordReveal
            lines={[
              'Numbers that',
              'keep doors open.',
            ]}
            className="display-lg text-neutral-950 dark:text-white"
          />
        </div>

        {/* Big numbers grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 pb-16 border-b border-border/60">
          <div className="rounded-2xl border border-border/60 bg-card p-6 space-y-2 shadow-sm">
            <span className="font-mono text-xs text-muted-foreground uppercase">
              Total Funded
            </span>
            <div className="text-4xl sm:text-5xl font-black tracking-tight text-brand-blue">
              ₦<span ref={nairaRef}>48</span>M+
            </div>
            <p className="text-xs text-muted-foreground">
              Direct contributions and sponsor pledges
            </p>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card p-6 space-y-2 shadow-sm">
            <span className="font-mono text-xs text-muted-foreground uppercase">
              Universities
            </span>
            <div className="text-4xl sm:text-5xl font-black tracking-tight text-neutral-900 dark:text-white">
              <span ref={universitiesRef}>42</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Federal, State, and accredited private campuses
            </p>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card p-6 space-y-2 shadow-sm">
            <span className="font-mono text-xs text-muted-foreground uppercase">
              On-Time Rate
            </span>
            <div className="text-4xl sm:text-5xl font-black tracking-tight text-emerald-500">
              98.7%
            </div>
            <p className="text-xs text-muted-foreground">
              Funded before portal late-fee deadline
            </p>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card p-6 space-y-2 shadow-sm">
            <span className="font-mono text-xs text-muted-foreground uppercase">
              Students Supported
            </span>
            <div className="text-4xl sm:text-5xl font-black tracking-tight text-brand-gold">
              <span ref={studentsRef}>3,400</span>+
            </div>
            <p className="text-xs text-muted-foreground">
              Indigent students saved from dropping out
            </p>
          </div>
        </div>

        {/* Weekly activity chart + Universities list */}
        <div className="grid gap-8 lg:grid-cols-12 pt-12 items-center">
          {/* Left: Mini Weekly Activity Bar */}
          <div className="lg:col-span-5 rounded-2xl border border-border/60 bg-card p-6 space-y-4">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-muted-foreground uppercase">
                Contributions this week
              </span>
              <span className="text-emerald-500 font-bold">Mon → Sun (+18%)</span>
            </div>

            <div className="flex items-end justify-between h-28 pt-4 gap-2 border-b border-border/60 pb-3">
              {weeklyData.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <div
                    className="w-full rounded-t-md gradient-bg-blue transition-all duration-500 hover:opacity-80"
                    style={{ height: d.height }}
                  />
                  <span className="font-mono text-[10px] text-muted-foreground">{d.day}</span>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-muted-foreground font-mono">
              Peak student sponsor pledges occur Thursday & Friday before weekend registrations.
            </p>
          </div>

          {/* Right: Supported Nigerian Universities */}
          <div className="lg:col-span-7 space-y-3">
            <span className="font-mono text-xs font-bold tracking-widest text-brand-gold uppercase block">
              COVERED NIGERIAN INSTITUTIONS
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs font-medium">
              {institutions.map((inst) => (
                <div
                  key={inst}
                  className="rounded-xl border border-border/60 bg-card/60 px-3.5 py-2.5 text-neutral-800 dark:text-neutral-200 truncate shadow-sm"
                >
                  {inst}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

