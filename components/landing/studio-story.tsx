'use client';

import React from 'react';
import { WordReveal, PillButton } from './primitives';

export function StudioStory() {
  return (
    <section className="relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8 border-b border-border/40 bg-card/20">
      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-12 items-center">
          {/* Left Column: Arch-framed photo + Polaroid */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Arch-framed photo */}
            <div className="relative w-full max-w-md h-[440px] sm:h-[500px] rounded-t-[200px] rounded-b-3xl overflow-hidden shadow-2xl border border-border">
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=70"
                alt="Nigerian university students collaborating"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>

            {/* Overlapping Polaroid Photo */}
            <div
              className="absolute -bottom-6 -right-2 sm:right-4 w-44 sm:w-52 bg-white p-3 shadow-2xl rounded-sm font-mono text-[10px] text-neutral-800 rotate-6 border border-neutral-200 select-none"
              style={{ filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.25))' }}
            >
              <div className="h-32 w-full overflow-hidden rounded-xs bg-neutral-100">
                <img
                  src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=70"
                  alt="University quad"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="mt-2.5 text-center font-bold tracking-wider uppercase text-neutral-600">
                CAMPUS PORTAL, 2026
              </div>
            </div>
          </div>

          {/* Right Column: Mission Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <div className="eyebrow">
              THE MISSION
            </div>
            <WordReveal
              lines={[
                'Built for students who',
                'deserve to graduate.',
              ]}
              className="display-lg text-neutral-950 dark:text-white"
            />
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              EduFund started during the <strong>Cowrywise Ambassadors Innovation Challenge 2026</strong> with
              a single conviction: no ambitious Nigerian university student should abandon their degree
              because of an arbitrary school fee deadline.
            </p>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              By combining disciplined, yield-generating locked savings plans with community-driven
              micro-pledges from alumni and loved ones, we ensure every kobo works directly toward keeping
              students in lecture halls and laboratories.
            </p>

            {/* Fact sheet rows */}
            <div className="divide-y divide-border/60 border-y border-border/60 text-xs sm:text-sm font-mono py-1">
              <div className="py-2.5 flex justify-between">
                <span className="text-muted-foreground uppercase">FOUNDED</span>
                <span className="font-bold">2026, Lagos · Innovation Challenge</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-muted-foreground uppercase">PARTNER ECOSYSTEM</span>
                <span className="font-bold">Cowrywise Embed Architecture Ready</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-muted-foreground uppercase">FINANCIAL PRECISION</span>
                <span className="font-bold text-emerald-500">Integer Kobo (0% Float Drift)</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-muted-foreground uppercase">STUDENT VERIFICATION</span>
                <span className="font-bold">Matriculation & HOD Approved</span>
              </div>
            </div>

            <div className="pt-2">
              <PillButton href="/auth?mode=signup" variant="primary">
                Join our student network
              </PillButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

