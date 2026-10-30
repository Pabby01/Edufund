'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { DashboardSidebar, DashboardTopBar } from '@/components/dashboard/dashboard-sidebar';
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

  // 1. Authenticated Student Dashboard Workspace with Sidebar
  if (isDashboardRoute) {
    return (
      <div className="flex min-h-screen bg-muted/20 dark:bg-slate-950/40 text-foreground selection:bg-brand-gold/30">
        <DashboardSidebar />
        <div className="flex flex-1 flex-col min-w-0 lg:pl-64 xl:pl-72">
          <DashboardTopBar />
          <main className="flex-1">{children}</main>
          <DashboardFooter />
        </div>
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

