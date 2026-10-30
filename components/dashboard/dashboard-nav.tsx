'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth, isUserAdmin } from '@/lib/auth-context';
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
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function DashboardNav() {
  const { user, profile, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out of EduFund Portal');
    router.push('/');
  };

  const isAdmin = profile?.is_admin || isUserAdmin(user?.email, profile?.is_admin);

  const navLinks = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard, exact: true },
    { name: 'New Goal', href: '/goals/new', icon: Target, exact: true },
    { name: 'Pledges', href: '/pledges', icon: Heart, exact: false },
    { name: 'Settings', href: '/settings', icon: Settings, exact: false },
  ];

  if (isAdmin) {
    navLinks.push({ name: 'Admin', href: '/admin', icon: Shield, exact: false });
  }

  const isLinkActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-card/95 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Logo & Portal Badge */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center">
            <EduFundLogo />
          </Link>
          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-brand-blue/30 bg-brand-blue/10 px-2.5 py-0.5 font-mono text-[10px] font-bold tracking-wider text-brand-blue uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-blue animate-pulse" />
            STUDENT PORTAL
          </span>
          {profile?.institution && (
            <span className="hidden md:inline-flex items-center gap-1 rounded-full border border-border bg-muted/60 px-2.5 py-0.5 font-mono text-[10px] text-muted-foreground">
              <GraduationCap className="h-3 w-3 text-brand-gold" />
              {profile.institution.split('(')[1]?.replace(')', '') || profile.institution.slice(0, 16)}
            </span>
          )}
        </div>

        {/* Center: Clean In-App Tab Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const active = isLinkActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all',
                  active
                    ? 'bg-foreground text-background shadow-xs dark:bg-white dark:text-slate-950 font-bold'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon className={cn('h-3.5 w-3.5', active ? 'text-brand-gold' : '')} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions, Profile & Exit to Public */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            className="hidden lg:inline-flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors mr-1"
            title="View public registry landing page"
          >
            <span>Public site</span>
            <ExternalLink className="h-3 w-3" />
          </Link>

          <ThemeToggle />

          {/* Quick Create Goal Button */}
          <Link href="/goals/new" className="hidden sm:inline-flex">
            <Button size="sm" className="rounded-full gradient-bg-blue text-white font-bold text-xs h-8 px-3.5 shadow-xs">
              <Target className="mr-1 h-3 w-3" />
              New Goal
            </Button>
          </Link>

          {/* User Profile Pill & Signout */}
          <div className="hidden sm:flex items-center gap-2 border-l border-border pl-2 sm:pl-3">
            <div className="flex flex-col text-right leading-none">
              <span className="text-xs font-bold text-foreground line-clamp-1 max-w-[120px]">
                {profile?.display_name || user?.email?.split('@')[0] || 'Student'}
              </span>
              <span className="font-mono text-[10px] text-muted-foreground">
                {isAdmin ? 'Admin' : 'Verified'}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
              className="h-8 w-8 rounded-full text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>

          {/* Mobile Sheet Nav */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden rounded-full h-9 w-9">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col gap-5 pt-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <EduFundLogo size={28} />
                  <span className="font-mono text-[10px] font-bold text-brand-blue uppercase">
                    PORTAL
                  </span>
                </div>

                <div className="rounded-xl border bg-muted/40 p-3 space-y-1">
                  <p className="text-xs font-bold">{profile?.display_name || user?.email}</p>
                  <p className="font-mono text-[10px] text-muted-foreground">{user?.email}</p>
                  {profile?.institution && (
                    <p className="font-mono text-[10px] text-brand-gold">{profile.institution}</p>
                  )}
                </div>

                <div className="space-y-1">
                  {navLinks.map((item) => {
                    const Icon = item.icon;
                    const active = isLinkActive(item.href, item.exact);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          'flex items-center gap-2.5 rounded-lg p-2.5 text-xs font-semibold transition-colors',
                          active
                            ? 'bg-foreground text-background dark:bg-white dark:text-slate-950 font-bold'
                            : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {item.name}
                      </Link>
                    );
                  })}
                </div>

                <div className="border-t pt-4 space-y-2 font-mono text-xs">
                  <Link
                    href="/"
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-muted text-muted-foreground"
                  >
                    <span>View Public Registry</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 p-2 rounded-lg text-red-500 hover:bg-red-500/10 font-bold"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

