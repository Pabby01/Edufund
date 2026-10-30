'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, ExternalLink } from 'lucide-react';

export function DashboardFooter() {
  return (
    <footer className="border-t border-border/60 bg-card/60 text-muted-foreground py-6 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-[11px]">
        {/* Left: Security status & partnership */}
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
          <span>
            EduFund Student Registry · Secured by <strong className="text-foreground">Cowrywise</strong> locked vaults & <strong className="text-foreground">Remita</strong> portal settlement.
          </span>
        </div>

        {/* Right: Support links & status */}
        <div className="flex items-center gap-4 text-[10px] tracking-wider uppercase">
          <Link href="/terms" className="hover:text-foreground transition-colors">
            Terms
          </Link>
          <span>·</span>
          <Link href="/privacy" className="hover:text-foreground transition-colors">
            Privacy
          </Link>
          <span>·</span>
          <Link href="/support" className="hover:text-foreground transition-colors">
            Support
          </Link>
          <span>·</span>
          <span className="inline-flex items-center gap-1 text-emerald-500 font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Remita API Live
          </span>
        </div>
      </div>
    </footer>
  );
}

