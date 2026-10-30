'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, FileText, CheckCircle2 } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Breadcrumb Header */}
      <div className="mb-8 flex items-center gap-2 font-mono text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors flex items-center gap-1">
          <ArrowLeft className="h-3 w-3" />
          <span>Home</span>
        </Link>
        <span>/</span>
        <span className="text-foreground">Terms of Service</span>
      </div>

      {/* Title */}
      <div className="space-y-3 border-b border-border/60 pb-8 mb-10">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-brand-gold/30 bg-brand-gold/10 px-3 py-1 font-mono text-[11px] font-bold tracking-widest text-brand-gold-dark dark:text-brand-gold uppercase">
          <FileText className="h-3.5 w-3.5" />
          REGULATORY TERMS · 2026/2027
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-black tracking-tight text-foreground">
          Terms of Service & Settlement Rules
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground font-mono">
          Last revised: October 2026 · Cowrywise Innovation Challenge Regulatory Framework
        </p>
      </div>

      {/* Content */}
      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-sm sm:text-base leading-relaxed">
        <section className="space-y-3">
          <h2 className="font-display text-2xl font-bold text-foreground">1. Introduction & Mission</h2>
          <p className="text-muted-foreground">
            EduFund is a collective education financing platform built to help indigent Nigerian university
            students plan, track, and collectively fund verified academic expenses including tuition,
            campus accommodation, STEM equipment, and final senate clearance before payment deadlines.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl font-bold text-foreground">2. Remita Portal Direct Settlement</h2>
          <p className="text-muted-foreground">
            All tuition disbursements are settled directly into official university bursary portal accounts
            via Remita Retrieval Reference (RRR) electronic payment channels. EduFund does not disburse
            tuition contributions to personal student bank accounts, ensuring complete transparency and
            eliminating fund diversion.
          </p>
          <div className="rounded-2xl border border-border bg-card p-5 font-mono text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-foreground">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>Remita Settlement Guarantee</span>
            </div>
            <p className="text-muted-foreground">
              Tuition contributions generate an immutable audit receipt tied to the verified RRR invoice number
              validated against the Federal Ministry of Education and university bursary registries.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl font-bold text-foreground">3. Cowrywise Locked Savings Vaults</h2>
          <p className="text-muted-foreground">
            Contributions accumulated toward student campaigns are held in Cowrywise automated locked vaults.
            These funds remain securely locked until the specified university deadline or until the funding
            target is achieved, protecting the capital from unplanned withdrawals.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl font-bold text-foreground">4. Integer Kobo Precision & Zero Drift</h2>
          <p className="text-muted-foreground">
            All financial arithmetic across the EduFund platform is calculated with integer kobo precision
            (1 NGN = 100 kobo). Floating point rounding errors are strictly disallowed to maintain zero-drift
            accounting for every contribution, micro-pledge, and yield calculation.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl font-bold text-foreground">5. Prototype Disclaimer</h2>
          <p className="text-muted-foreground">
            EduFund is a hackathon prototype developed for the Cowrywise Ambassadors Innovation Challenge 2026.
            Simulated demonstration payments do not debit live bank accounts unless production Paystack/Remita
            credentials are configured by the administrator.
          </p>
        </section>
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

