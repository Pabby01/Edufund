'use client';

import React, { useState } from 'react';
import { WordReveal, PillButton } from './primitives';
import { BookOpen, CheckCircle2, Download, Send } from 'lucide-react';
import { toast } from 'sonner';

export function FreeGuide() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    setSubmitted(true);
    toast.success('Playbook sent! Check your inbox.');
  };

  return (
    <section className="relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8 border-b border-border/40">
      <div className="relative mx-auto max-w-5xl rounded-3xl border border-border bg-card p-8 sm:p-14 shadow-2xl">
        <div className="grid gap-8 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="eyebrow">
              FREE STUDENT PLAYBOOK
            </div>
            <WordReveal
              lines={[
                'The sponsorship guide,',
                'on the house.',
              ]}
              className="display-md text-neutral-950 dark:text-white"
            />
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Forty pages on funding your degree without crippling debt: letter templates
              for departmental alumni associations, structuring recurring family micro-pledges,
              and navigating university late-registration waivers.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 pt-2">
              <input
                type="email"
                placeholder="Enter your student or sponsor email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitted}
                className="flex-1 rounded-full border border-border bg-background px-5 py-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-blue"
              />
              <button
                type="submit"
                disabled={submitted}
                className="rounded-full gradient-bg-blue text-white font-bold px-6 py-3 text-sm flex items-center justify-center gap-2 hover:opacity-95 shadow-md shrink-0"
              >
                {submitted ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-brand-gold" />
                    Sent to inbox
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Get free playbook
                  </>
                )}
              </button>
            </form>
            <p className="text-[11px] text-muted-foreground font-mono">
              Zero spam. Direct PDF guide delivered instantly to your inbox.
            </p>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="w-48 sm:w-56 h-64 sm:h-72 rounded-r-xl rounded-l-xs bg-gradient-to-br from-blue-700 via-blue-900 to-slate-950 p-5 text-white shadow-2xl border-t border-r border-white/20 flex flex-col justify-between transform -rotate-3 hover:rotate-0 transition-transform duration-300">
              <span className="self-start rounded bg-brand-gold text-slate-950 font-mono text-[9px] font-bold px-2 py-0.5">
                40 PAGES · PDF
              </span>
              <div>
                <h4 className="font-bold text-lg leading-tight">
                  The Student Sponsorship Playbook
                </h4>
                <p className="text-xs text-white/70 mt-1">
                  Cowrywise Ambassadors 2026 Edition
                </p>
              </div>
              <span className="text-[10px] text-brand-gold font-mono">
                EDUFUND · NIGERIA
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

