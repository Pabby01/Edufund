'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { DashboardSidebar, DashboardTopBar, DashboardMobileHeader } from '@/components/dashboard/dashboard-sidebar';
import { DashboardBottomNav } from '@/components/dashboard/dashboard-bottom-nav';
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
    pathname.startsWith('/sponsor') ||
    pathname.startsWith('/admin');

  // 1. Authenticated Student & Sponsor Workspace Layout with Sidebar (desktop) and Bottom Nav (mobile)
  if (isDashboardRoute) {
    return (
      <div className="min-h-screen bg-muted/20 dark:bg-slate-950/40 text-foreground selection:bg-brand-gold/30 w-full">
        {/* Desktop Fixed Left Sidebar */}
        <DashboardSidebar />

        {/* Mobile Sticky Top Bar */}
        <DashboardMobileHeader />

        {/* Main Content Area */}
        <div className="flex flex-col min-h-[calc(100vh-3.5rem)] lg:min-h-screen lg:pl-64 xl:pl-72 pb-20 lg:pb-0 min-w-0 w-full">
          <DashboardTopBar />
          <main className="flex-1 w-full min-w-0">{children}</main>
          <DashboardFooter />
        </div>

        {/* Mobile Bottom Dock Navigation Bar */}
        <DashboardBottomNav />
      </div>
    );
  }

  // 2. Focused Authentication Layout
  if (isAuthRoute) {
    return (
      <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-brand-gold/30 w-full">
        <AuthNav />
        <main className="flex-1 w-full min-w-0">{children}</main>
      </div>
    );
  }

  // 3. Public Pages (Landing, Fund Campaign, Legal, Support)
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-brand-gold/30 w-full min-w-0">
      <Navbar />
      <main className="flex-1 w-full min-w-0">{children}</main>
      <Footer />
    </div>
  );
}

