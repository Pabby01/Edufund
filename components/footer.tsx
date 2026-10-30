'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { EduFundLogo } from '@/components/edu-fund-logo';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export function Footer() {
  const [lagosTime, setLagosTime] = useState('19:54');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const timeStr = new Intl.DateTimeFormat('en-GB', {
          timeZone: 'Africa/Lagos',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }).format(now);
        setLagosTime(timeStr);
      } catch {
        // Fallback
        const now = new Date();
        setLagosTime(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`);
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    setSubscribed(true);
    toast.success('Subscribed to the EduFund Registry Digest!');
  };

  return (
    <footer className="relative overflow-hidden border-t border-border/40 bg-card/60 text-foreground pt-14 pb-0">
      {/* Top Banner Ribbon */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-10">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-8 font-mono text-[11px] text-muted-foreground tracking-widest uppercase">
          <span>DIRECT PORTAL DISBURSEMENT</span>
          <span>·</span>
          <span>VERIFIED NIGERIAN UNIVERSITY CALENDARS</span>
          <span>·</span>
          <span>INTEGER KOBO PRECISION (0% DRIFT)</span>
        </div>
      </div>

      {/* Main Footer Columns */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid gap-10 md:grid-cols-12">
          {/* Column 1: Brand Info & Clock */}
          <div className="md:col-span-4 space-y-4">
            <EduFundLogo size={36} />
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              EduFund helps Nigerian university students and their sponsors plan, save towards,
              and collectively fund tuition and campus accommodation before payment deadlines.
            </p>

            {/* Live Clock Pill (Shelfline style) */}
            <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/80 px-3.5 py-1.5 font-mono text-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-muted-foreground font-semibold">LOCAL TIME</span>
              <span className="text-muted-foreground">·</span>
              <span className="font-bold text-foreground">LAGOS {lagosTime}</span>
            </div>

            <div>
              <a
                href="mailto:hello@edufund.ng"
                className="text-xs font-mono text-muted-foreground hover:text-brand-gold transition-colors"
              >
                hello@edufund.ng
              </a>
            </div>
          </div>

          {/* Column 2: Tracks */}
          <div className="md:col-span-2 space-y-3 font-mono text-xs">
            <h4 className="font-bold uppercase tracking-widest text-brand-gold-dark dark:text-brand-gold">
              TRACKS
            </h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link href="/#tracks" className="hover:text-foreground transition-colors">Tuition & Fees</Link></li>
              <li><Link href="/#tracks" className="hover:text-foreground transition-colors">Hostels & Lodges</Link></li>
              <li><Link href="/#tracks" className="hover:text-foreground transition-colors">STEM & Textbooks</Link></li>
              <li><Link href="/#tracks" className="hover:text-foreground transition-colors">Final Clearance</Link></li>
              <li><Link href="/dashboard" className="hover:text-foreground transition-colors">All Active Goals</Link></li>
            </ul>
          </div>

          {/* Column 3: Platform */}
          <div className="md:col-span-2 space-y-3 font-mono text-xs">
            <h4 className="font-bold uppercase tracking-widest text-brand-gold-dark dark:text-brand-gold">
              STUDENT
            </h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link href="/goals/new" className="hover:text-foreground transition-colors">Start a Goal</Link></li>
              <li><Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link></li>
              <li><Link href="/pledges" className="hover:text-foreground transition-colors">Pledge Circle</Link></li>
              <li><Link href="/#stacks" className="hover:text-foreground transition-colors">Semester Stacks</Link></li>
              <li><Link href="/settings" className="hover:text-foreground transition-colors">Verification</Link></li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div className="md:col-span-2 space-y-3 font-mono text-xs">
            <h4 className="font-bold uppercase tracking-widest text-brand-gold-dark dark:text-brand-gold">
              LEGAL
            </h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link href="/terms" className="hover:text-foreground transition-colors">Remita Terms</Link></li>
              <li><Link href="/terms" className="hover:text-foreground transition-colors">Cowrywise Terms</Link></li>
              <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Column 5: Newsletter / Digest (Image 2 style) */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-brand-gold-dark dark:text-brand-gold">
              REGISTRY DIGEST
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              One email a month: student impact stories, deadline reminders, and sponsorship matching.
            </p>

            <form onSubmit={handleSubscribe} className="flex items-center gap-1">
              <input
                type="email"
                placeholder="you@university.edu.ng"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={subscribed}
                className="w-full rounded-l-md border border-border bg-background px-3 py-2 text-xs font-mono placeholder:text-muted-foreground/60 focus:outline-hidden focus:ring-1 focus:ring-brand-blue"
              />
              <button
                type="submit"
                disabled={subscribed}
                className="rounded-r-md gradient-bg-gold text-slate-950 p-2 font-bold hover:opacity-95 shadow-sm shrink-0"
              >
                {subscribed ? <CheckCircle2 className="h-4 w-4 text-emerald-950" /> : <ArrowRight className="h-4 w-4" />}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Socials */}
        <div className="mt-14 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-muted-foreground">
          <p>© 2026 EduFund. Built for the Cowrywise Ambassadors Innovation Challenge 2026.</p>
          <div className="flex gap-4 tracking-widest text-[11px] uppercase">
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">X</a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">INSTAGRAM</a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">LINKEDIN</a>
            <a href="https://whatsapp.com" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">WHATSAPP</a>
          </div>
        </div>
      </div>

      {/* GIGANTIC WATERMARK TEXT (Image 2 Shelfline style) */}
      <div className="w-full overflow-hidden select-none pointer-events-none leading-none -mb-4 sm:-mb-8 md:-mb-12">
        <div className="font-display font-black text-[22vw] tracking-tighter text-foreground/[0.03] dark:text-white/[0.04] text-center uppercase whitespace-nowrap">
          EduFund
        </div>
      </div>
    </footer>
  );
}
