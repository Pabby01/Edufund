'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, ArrowLeft, Lock, CheckCircle2 } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Breadcrumb Header */}
      <div className="mb-8 flex items-center gap-2 font-mono text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors flex items-center gap-1">
          <ArrowLeft className="h-3 w-3" />
          <span>Home</span>
        </Link>
        <span>/</span>
        <span className="text-foreground">Privacy Policy</span>
      </div>

      {/* Title */}
      <div className="space-y-3 border-b border-border/60 pb-8 mb-10">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-[11px] font-bold tracking-widest text-emerald-600 dark:text-emerald-400 uppercase">
          <Shield className="h-3.5 w-3.5" />
          NDPR COMPLIANT DATA PROTECTION
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-black tracking-tight text-foreground">
          Privacy Policy & Data Security
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground font-mono">
          Last revised: October 2026 · Nigeria Data Protection Regulation (NDPR) Standard
        </p>
      </div>

      {/* Content */}
      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-sm sm:text-base leading-relaxed">
        <section className="space-y-3">
          <h2 className="font-display text-2xl font-bold text-foreground">1. Information We Collect</h2>
          <p className="text-muted-foreground">
            We collect information provided directly by Nigerian students and their sponsors:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            <li><strong>Student Identity:</strong> Name, university email, institution name, course of study, and matriculation number (strictly for invoice verification).</li>
            <li><strong>Education Campaign Data:</strong> Target amount in kobo, deadline, expense category, and personal educational statement.</li>
            <li><strong>Sponsor Information:</strong> Sponsor display name or anonymous pseudonym, email for payment receipt delivery, and optional notes of encouragement.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl font-bold text-foreground">2. Student Privacy Options</h2>
          <p className="text-muted-foreground">
            Students retain full control over their public visibility:
          </p>
          <div className="grid sm:grid-cols-2 gap-4 not-prose">
            <div className="rounded-2xl border border-border bg-card p-5 space-y-2">
              <h4 className="font-display font-bold text-foreground text-sm">Pseudonymous Mode</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Students can choose a public display pseudonym (e.g. &quot;300L Med Student, UI&quot;) to protect their personal privacy while sharing their campaign.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5 space-y-2">
              <h4 className="font-display font-bold text-foreground text-sm">Private Circle Mode</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Campaigns can be kept private and accessible only via direct link for family, mentors, and alumni groups without appearing on the public registry.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl font-bold text-foreground">3. Payment & Credentials Security</h2>
          <p className="text-muted-foreground">
            EduFund does not store debit card details, PINs, or banking passwords. All card and bank
            transactions are handled via PCI-DSS compliant payment gateways (Paystack and Remita) with
            end-to-end encryption.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl font-bold text-foreground">4. Contact & Inquiries</h2>
          <p className="text-muted-foreground">
            For privacy inquiries, data deletion requests, or NDPR compliance questions, contact our
            Data Protection Officer at{' '}
            <a href="mailto:privacy@edufund.ng" className="text-brand-blue font-mono font-bold hover:underline">
              privacy@edufund.ng
            </a>.
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

