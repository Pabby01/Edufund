'use client';

import React from 'react';
import Link from 'next/link';
import { WordReveal, PillButton } from './primitives';
import { Sparkles, ArrowRight, Heart } from 'lucide-react';

export function CTABanner() {
  return (
    <section className="relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8 bg-neutral-950 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[600px] rounded-full bg-brand-blue/20 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-4xl text-center space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-brand-gold/30 bg-brand-gold/10 px-4 py-1 text-xs font-mono font-medium text-brand-gold">
          <Sparkles className="h-3.5 w-3.5" />
          COWRYWISE AMBASSADORS INNOVATION CHALLENGE 2026
        </div>

        <WordReveal
          lines={[
            'Ready to secure your',
            '*next semester?*',
          ]}
          className="display-lg text-white"
        />

        <p className="text-neutral-400 max-w-xl mx-auto text-base sm:text-lg">
          Join thousands of Nigerian university students funding their education debt-free.
          It takes less than two minutes to publish your verified goal.
        </p>

        <div className="pt-4 flex flex-wrap justify-center gap-4">
          <PillButton href="/auth?mode=signup" variant="primary">
            Create your education goal
          </PillButton>
          <PillButton href="/#tracks" variant="ghost" icon={ArrowRight}>
            Explore student campaigns
          </PillButton>
        </div>

        <p className="text-xs text-neutral-500 font-mono pt-4">
          Direct Remita settlement · Cowrywise locked savings · Zero platform commission
        </p>
      </div>
    </section>
  );
}

