'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { DashboardNav } from '@/components/dashboard/dashboard-nav';
import { DashboardFooter } from '@/components/dashboard/dashboard-footer';
import { AuthNav } from '@/components/auth-nav';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

  const isAuthRoute = pathname === '/auth';
  const isDashboardRoute =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/goals') ||
    pathname.startsWith('/pledges') ||
    pathname.startsWith('/settings') ||
    pathname.startsWith('/admin');

  // 1. Authenticated Student Dashboard & Workspace Layout
  if (isDashboardRoute) {
    return (
      <div className="flex min-h-screen flex-col bg-muted/20 dark:bg-slate-950/40 text-foreground selection:bg-brand-gold/30">
        <DashboardNav />
        <main className="flex-1">{children}</main>
        <DashboardFooter />
      </div>
    );
  }

  // 2. Focused Authentication Layout
  if (isAuthRoute) {
    return (
      <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-brand-gold/30">
        <AuthNav />
        <main className="flex-1">{children}</main>
      </div>
    );
  }

  // 3. Public Pages (Landing, Fund Campaign, Legal, Support)
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-brand-gold/30">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

