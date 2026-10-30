'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth, isUserAdmin } from '@/lib/auth-context';
import {
  LayoutDashboard,
  Target,
  Heart,
  Settings,
  ShieldCheck,
  Shield,
  Compass,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function DashboardBottomNav() {
  const pathname = usePathname();
  const { user, profile } = useAuth();
  const isAdmin = profile?.is_admin || isUserAdmin(user?.email, profile?.is_admin);

  const tabs = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard, exact: true },
    { name: 'New Goal', href: '/goals/new', icon: Target, exact: true },
    { name: 'Pledges', href: '/pledges', icon: Heart, exact: false },
    isAdmin
      ? { name: 'Admin', href: '/admin', icon: Shield, exact: false }
      : { name: 'Sponsor', href: '/sponsor', icon: ShieldCheck, exact: false },
    { name: 'Settings', href: '/settings', icon: Settings, exact: false },
  ];

  const isTabActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 border-t border-border/80 bg-card/95 backdrop-blur-xl flex items-center justify-around px-2 lg:hidden shadow-[0_-4px_25px_rgba(0,0,0,0.15)] selection:bg-brand-gold/30">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const active = isTabActive(tab.href, tab.exact);
        const isNewGoal = tab.name === 'New Goal';

        if (isNewGoal) {
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex flex-col items-center justify-center -mt-5"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full gradient-bg-blue text-white shadow-lg shadow-brand-blue/30 active:scale-95 transition-transform">
                <Target className="h-5 w-5" />
              </div>
              <span className="mt-1 font-mono text-[9px] font-bold text-foreground">
                NEW GOAL
              </span>
            </Link>
          );
        }

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              'flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all',
              active
                ? 'text-brand-blue dark:text-brand-gold font-bold'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <div className="relative">
              <Icon className={cn('h-5 w-5', active ? 'scale-110' : '')} />
              {active && (
                <span className="absolute -top-1 -right-1 h-1.5 w-1.5 rounded-full bg-brand-gold animate-pulse" />
              )}
            </div>
            <span className="mt-1 font-mono text-[9px] font-semibold uppercase tracking-wider">
              {tab.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

