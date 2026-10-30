'use client';

import React from 'react';
import Link from 'next/link';
import { HelpCircle, ArrowLeft, Mail, MessageSquare, ShieldCheck, GraduationCap, ArrowRight } from 'lucide-react';
import { PillButton } from '@/components/landing/primitives';

const faqs = [
  {
    q: 'How does direct Remita settlement work?',
    a: 'EduFund settles verified tuition payments directly to the university bursary using official Remita Retrieval References (RRR). Funds are never deposited into individual student bank accounts.',
  },
  {
    q: 'What is the Cowrywise locked savings vault?',
    a: 'Every student goal is backed by an automated Cowrywise locked vault that accumulates micro-pledges and student savings until the semester tuition deadline or target is reached.',
  },
  {
    q: 'Can international sponsors pledge in USD or GBP?',
    a: 'Yes. Sponsors worldwide can contribute using Paystack international cards, Apple Pay, or direct card checkout with live exchange conversion to integer kobo.',
  },
  {
    q: 'How do students verify their matriculation status?',
    a: 'Students submit their university email (.edu.ng) or matriculation admission letter. Verified badges are displayed on their public goal cards.',
  },
];

export default function SupportPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Breadcrumb Header */}
      <div className="mb-8 flex items-center gap-2 font-mono text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors flex items-center gap-1">
          <ArrowLeft className="h-3 w-3" />
          <span>Home</span>
        </Link>
        <span>/</span>
        <span className="text-foreground">Support & Help</span>
      </div>

      {/* Title */}
      <div className="space-y-3 border-b border-border/60 pb-8 mb-10">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-brand-blue/30 bg-brand-blue/10 px-3 py-1 font-mono text-[11px] font-bold tracking-widest text-brand-blue uppercase">
          <HelpCircle className="h-3.5 w-3.5" />
          EDUFUND HELP DESK
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-black tracking-tight text-foreground">
          How can we help your semester funding?
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground font-mono">
          Fast support for Nigerian university students, parents, mentors, and corporate sponsors.
        </p>
      </div>

      {/* Quick Help Cards */}
      <div className="grid sm:grid-cols-2 gap-4 mb-12">
        <div className="rounded-2xl border border-border bg-card p-6 space-y-3 shadow-xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue">
            <Mail className="h-5 w-5" />
          </div>
          <h3 className="font-display text-lg font-bold text-foreground">Email Support</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Get assistance with Remita RRR validation, matriculation issues, or sponsor receipts.
          </p>
          <a
            href="mailto:support@edufund.ng"
            className="inline-flex items-center gap-1 text-xs font-mono font-bold text-brand-blue hover:underline"
          >
            <span>support@edufund.ng</span>
            <ArrowRight className="h-3 w-3" />
          </a>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 space-y-3 shadow-xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
            <MessageSquare className="h-5 w-5" />
          </div>
          <h3 className="font-display text-lg font-bold text-foreground">WhatsApp Registry Desk</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Chat with an EduFund campus ambassador for urgent semester payment deadline support.
          </p>
          <a
            href="https://whatsapp.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            <span>Chat on WhatsApp</span>
            <ArrowRight className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="space-y-6">
        <h2 className="font-display text-2xl font-bold text-foreground">Frequently Answered Questions</h2>
        <div className="divide-y divide-border/60 rounded-2xl border border-border bg-card/60 p-6">
          {faqs.map((faq, i) => (
            <div key={i} className="py-4 first:pt-0 last:pb-0 space-y-1.5">
              <h4 className="font-display text-base font-bold text-foreground">{faq.q}</h4>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Back Button */}
      <div className="mt-14 pt-8 border-t border-border/60">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-xs font-bold text-brand-blue hover:underline uppercase tracking-wider"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Homepage</span>
        </Link>
      </div>
    </div>
  );
}

