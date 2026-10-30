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
    <footer className="relative overflow-hidden border-t border-neutral-800 bg-neutral-950 text-neutral-200 pt-16 pb-0">
      {/* Top Banner Ribbon */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 pb-8 font-mono text-[11px] text-neutral-400 tracking-widest uppercase">
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
          <div className="md:col-span-4 space-y-5">
            <EduFundLogo size={36} />
            <p className="text-sm text-neutral-400 leading-relaxed max-w-sm">
              EduFund helps Nigerian university students and their sponsors plan, save towards,
              and collectively fund tuition and campus accommodation before payment deadlines.
            </p>

            {/* Live Clock Pill (Shelfline style) */}
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/80 px-4 py-2 font-mono text-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-neutral-400 font-semibold">LOCAL TIME</span>
              <span className="text-neutral-600">·</span>
              <span className="font-bold text-white">LAGOS {lagosTime}</span>
            </div>

            <div>
              <a
                href="mailto:hello@edufund.ng"
                className="text-xs font-mono text-neutral-400 hover:text-brand-gold transition-colors"
              >
                hello@edufund.ng
              </a>
            </div>
          </div>

          {/* Column 2: Tracks */}
          <div className="md:col-span-2 space-y-3 font-mono text-xs">
            <h4 className="font-bold uppercase tracking-widest text-brand-gold">
              TRACKS
            </h4>
            <ul className="space-y-2.5 text-neutral-400">
              <li><Link href="/#tracks" className="hover:text-white transition-colors">Tuition & Fees</Link></li>
              <li><Link href="/#tracks" className="hover:text-white transition-colors">Hostels & Lodges</Link></li>
              <li><Link href="/#tracks" className="hover:text-white transition-colors">STEM & Textbooks</Link></li>
              <li><Link href="/#tracks" className="hover:text-white transition-colors">Final Clearance</Link></li>
              <li><Link href="/#stacks" className="hover:text-white transition-colors">Semester Stacks</Link></li>
            </ul>
          </div>

          {/* Column 3: Platform */}
          <div className="md:col-span-2 space-y-3 font-mono text-xs">
            <h4 className="font-bold uppercase tracking-widest text-brand-gold">
              PLATFORM
            </h4>
            <ul className="space-y-2.5 text-neutral-400">
              <li><Link href="/#how-it-works" className="hover:text-white transition-colors">How it works</Link></li>
              <li><Link href="/auth?mode=signup" className="hover:text-white transition-colors">Start a Goal</Link></li>
              <li><Link href="/auth?mode=signin" className="hover:text-white transition-colors">Student Portal</Link></li>
              <li><Link href="/support" className="hover:text-white transition-colors">Verification Guide</Link></li>
              <li><Link href="/support" className="hover:text-white transition-colors">Cowrywise Vault</Link></li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div className="md:col-span-2 space-y-3 font-mono text-xs">
            <h4 className="font-bold uppercase tracking-widest text-brand-gold">
              LEGAL
            </h4>
            <ul className="space-y-2.5 text-neutral-400">
              <li><Link href="/terms" className="hover:text-white transition-colors">Remita Terms</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Cowrywise Terms</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Column 5: Newsletter / Digest (Image 2 style) */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-brand-gold">
              REGISTRY DIGEST
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              One email a month: student impact stories, deadline reminders, and sponsorship matching.
            </p>

            <form onSubmit={handleSubscribe} className="flex items-center gap-1 pt-1">
              <input
                type="email"
                placeholder="you@university.edu.ng"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={subscribed}
                className="w-full rounded-l-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs font-mono text-white placeholder:text-neutral-500 focus:outline-hidden focus:ring-1 focus:ring-brand-gold"
              />
              <button
                type="submit"
                disabled={subscribed}
                aria-label="Subscribe"
                className="rounded-r-md gradient-bg-gold text-slate-950 p-2 font-bold hover:opacity-95 shadow-xs shrink-0"
              >
                {subscribed ? <CheckCircle2 className="h-4 w-4 text-emerald-950" /> : <ArrowRight className="h-4 w-4" />}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Socials */}
        <div className="mt-14 pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-neutral-400">
          <p>© 2026 EduFund. Built for the Cowrywise Ambassadors Innovation Challenge 2026.</p>
          <div className="flex gap-4 tracking-widest text-[11px] uppercase">
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">X</a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">INSTAGRAM</a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">LINKEDIN</a>
            <a href="https://whatsapp.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">WHATSAPP</a>
          </div>
        </div>
      </div>

      {/* GIGANTIC WATERMARK TEXT (Image 2 Shelfline style) */}
      <div className="w-full overflow-hidden select-none pointer-events-none leading-none -mb-6 sm:-mb-10 md:-mb-14">
        <div className="font-display font-black text-[22vw] tracking-tighter text-white/[0.04] text-center uppercase whitespace-nowrap">
          EduFund
        </div>
      </div>
    </footer>
  );
}
