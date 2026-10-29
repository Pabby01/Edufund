'use client';

import Link from 'next/link';
import { EduFundLogo } from '@/components/edu-fund-logo';
import { Github, Twitter, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <EduFundLogo />
            <p className="text-sm text-muted-foreground">
              Every semester funded, one contribution at a time.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link></li>
              <li><Link href="/goals/new" className="hover:text-foreground transition-colors">Create a goal</Link></li>
              <li><Link href="/auth?mode=signup" className="hover:text-foreground transition-colors">Get started</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
              <li><Link href="/support" className="hover:text-foreground transition-colors">Support</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Connect</h4>
            <div className="flex gap-3">
              <Link href="#" className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors" aria-label="Twitter">
                <Twitter className="h-4 w-4" />
              </Link>
              <Link href="#" className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors" aria-label="GitHub">
                <Github className="h-4 w-4" />
              </Link>
              <Link href="#" className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors" aria-label="Email">
                <Mail className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-border/40 pt-6 text-center text-xs text-muted-foreground">
          <p>
            EduFund is a hackathon prototype for the Cowrywise Ambassadors Innovation Challenge 2026.
            This prototype does not hold or transfer real funds. Demo contributions are simulated.
          </p>
        </div>
      </div>
    </footer>
  );
}
