'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { EduFundLogo } from '@/components/edu-fund-logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Target,
  Heart,
  Settings,
  Shield,
  LogOut,
  ExternalLink,
  Menu,
  GraduationCap,
  Sparkles,
  Compass,
  Layers,
  BookOpen,
  HelpCircle,
  ShieldCheck,
  ChevronRight,
  User,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function DashboardSidebar() {
  const { user, profile, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out of EduFund Student Portal');
    router.push('/');
  };

  const primaryNav = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard, exact: true },
    { name: 'New Goal', href: '/goals/new', icon: Target, exact: true },
    { name: 'Pledge Circle', href: '/pledges', icon: Heart, exact: false },
    { name: 'Settings & Profile', href: '/settings', icon: Settings, exact: false },
  ];

  if (profile?.is_admin) {
    primaryNav.push({ name: 'Admin Registry', href: '/admin', icon: Shield, exact: false });
  }

  const secondaryNav = [
    { name: 'Public Registry', href: '/explore', icon: Compass },
    { name: 'Semester Stacks', href: '/stacks', icon: Layers },
    { name: 'How It Works', href: '/how-it-works', icon: BookOpen },
    { name: 'Help & Support', href: '/support', icon: HelpCircle },
  ];

  const isLinkActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  const initials = (profile?.display_name || user?.email || 'Student')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between py-5 px-4 font-sans">
      {/* Top Section */}
      <div className="space-y-6">
        {/* Logo and Workspace Label */}
        <div className="flex items-center justify-between px-2">
          <Link href="/dashboard" className="flex items-center gap-2">
            <EduFundLogo size={32} />
          </Link>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-blue/30 bg-brand-blue/10 px-2.5 py-0.5 font-mono text-[9px] font-bold tracking-wider text-brand-blue uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-blue animate-pulse" />
            PORTAL
          </span>
        </div>

        {/* Student Mini Profile Card */}
        <div className="rounded-2xl border border-border/80 bg-muted/30 p-3.5 space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-blue to-indigo-700 text-white font-mono font-bold text-xs shadow-xs">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-foreground">
                {profile?.display_name || user?.email?.split('@')[0] || 'Student'}
              </p>
              <p className="truncate font-mono text-[10px] text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </div>
          {profile?.institution ? (
            <div className="flex items-center gap-1.5 pt-1 border-t border-border/50 text-[10px] font-mono text-brand-gold-dark dark:text-brand-gold">
              <GraduationCap className="h-3 w-3 shrink-0" />
              <span className="truncate">{profile.institution}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 pt-1 border-t border-border/50 text-[10px] font-mono text-emerald-500">
              <ShieldCheck className="h-3 w-3 shrink-0" />
              <span>Remita Verified Student</span>
            </div>
          )}
        </div>

        {/* Primary Workspace Navigation */}
        <div className="space-y-1">
          <div className="px-2 font-mono text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
            WORKSPACE
          </div>
          {primaryNav.map((item) => {
            const Icon = item.icon;
            const active = isLinkActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all',
                  active
                    ? 'bg-foreground text-background dark:bg-white dark:text-slate-950 font-bold shadow-xs'
                    : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground'
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={cn('h-4 w-4', active ? 'text-brand-gold' : '')} />
                  <span>{item.name}</span>
                </div>
                {active && <ChevronRight className="h-3.5 w-3.5 opacity-60" />}
              </Link>
            );
          })}
        </div>

        {/* Quick Start Goal Pill */}
        <div className="px-1 pt-1">
          <Link href="/goals/new" onClick={() => setMobileOpen(false)}>
            <Button size="sm" className="w-full rounded-xl gradient-bg-blue text-white font-bold text-xs h-9 shadow-xs">
              <Target className="mr-1.5 h-3.5 w-3.5" />
              Start New Goal
            </Button>
          </Link>
        </div>

        {/* Secondary Navigation */}
        <div className="space-y-1 pt-2">
          <div className="px-2 font-mono text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
            EXPLORE & RESOURCES
          </div>
          {secondaryNav.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors"
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bottom Section: Security Status, Theme Toggle, Sign Out */}
      <div className="space-y-3 pt-6 border-t border-border/60">
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-2.5 font-mono text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Cowrywise Locked · Remita Live</span>
        </div>

        <div className="flex items-center justify-between px-1">
          <ThemeToggle />
          <button
            onClick={handleSignOut}
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-mono font-semibold text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign out</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop Fixed Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 xl:w-72 border-r border-border/60 bg-card/95 backdrop-blur-xl lg:flex flex-col">
        {sidebarContent}
      </aside>

      {/* 2. Mobile / Tablet Top Header with Drawer Trigger */}
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border/60 bg-card/95 px-4 backdrop-blur-xl lg:hidden">
        <div className="flex items-center gap-2">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              {sidebarContent}
            </SheetContent>
          </Sheet>
          <EduFundLogo size={28} />
        </div>

        <div className="flex items-center gap-2">
          <Link href="/goals/new">
            <Button size="sm" className="h-8 rounded-full gradient-bg-blue text-white text-xs font-bold px-3">
              <Target className="mr-1 h-3 w-3" />
              New Goal
            </Button>
          </Link>
          <ThemeToggle />
        </div>
      </header>
    </>
  );
}

export function DashboardTopBar({ title, description }: { title?: string; description?: string }) {
  const pathname = usePathname();

  const getSectionTitle = () => {
    if (title) return title;
    if (pathname === '/dashboard') return 'Overview & Analytics';
    if (pathname === '/goals/new') return 'Create an Education Goal';
    if (pathname.startsWith('/goals/')) return 'Goal Management';
    if (pathname === '/pledges') return 'Pledge Circle & Reminders';
    if (pathname === '/settings') return 'Student Profile & Settings';
    if (pathname === '/admin') return 'Admin Registry & Moderation';
    return 'Student Portal';
  };

  return (
    <div className="hidden lg:flex h-16 w-full items-center justify-between border-b border-border/40 bg-card/40 px-6 xl:px-8 backdrop-blur-md">
      <div>
        <h2 className="font-display text-base font-bold text-foreground">
          {getSectionTitle()}
        </h2>
        {description && (
          <p className="text-[11px] font-mono text-muted-foreground">{description}</p>
        )}
      </div>

      <div className="flex items-center gap-3 font-mono text-xs">
        <Link
          href="/explore"
          className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors mr-2"
        >
          <span>Public Registry</span>
          <ExternalLink className="h-3 w-3" />
        </Link>
        <Link href="/goals/new">
          <Button size="sm" className="rounded-full gradient-bg-blue text-white font-bold text-xs h-8 px-3.5 shadow-xs">
            <Target className="mr-1 h-3 w-3" />
            New Goal
          </Button>
        </Link>
      </div>
    </div>
  );
}

