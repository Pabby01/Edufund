'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { EduFundLogo } from '@/components/edu-fund-logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Menu,
  LayoutDashboard,
  Target,
  Heart,
  Settings,
  LogOut,
  Shield,
  ChevronDown,
  Sparkles,
  GraduationCap,
  Home,
  BookOpen,
  ArrowRight,
  BookMarked,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const tracksDropdown = [
  { name: 'Tuition & Fees', count: '34 CAMPAIGNS', href: '/tracks/tuition', icon: GraduationCap },
  { name: 'Hostels & Lodges', count: '19 CAMPAIGNS', href: '/tracks/hostels', icon: Home },
  { name: 'Textbooks & STEM Gear', count: '14 CAMPAIGNS', href: '/tracks/stem', icon: BookOpen },
  { name: 'Final Clearance', count: '8 CAMPAIGNS', href: '/tracks/clearance', icon: BookMarked },
];

export function Navbar() {
  const { user, profile, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [megamenuOpen, setMegamenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <header className="glass-nav sticky top-0 z-50 w-full border-b border-border/40 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center">
          <EduFundLogo />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 font-medium text-sm">
          {/* Megamenu Trigger */}
          <div
            className="relative"
            onMouseEnter={() => setMegamenuOpen(true)}
            onMouseLeave={() => setMegamenuOpen(false)}
          >
            <button
              onClick={() => setMegamenuOpen(!megamenuOpen)}
              className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-neutral-600 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition-colors"
            >
              Tracks
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${megamenuOpen ? 'rotate-180 text-brand-gold' : ''}`} />
            </button>

            {/* Megamenu Dropdown */}
            {megamenuOpen && (
              <div className="absolute top-full left-0 mt-1 w-[680px] rounded-2xl border border-border/60 bg-card/95 p-6 shadow-2xl backdrop-blur-2xl animate-fade-up">
                <div className="grid grid-cols-12 gap-6">
                  {/* Left Column: Tracks list */}
                  <div className="col-span-5 space-y-3 border-r border-border/50 pr-4">
                    <span className="font-mono text-[10px] font-bold tracking-widest text-brand-gold-dark dark:text-brand-gold uppercase">
                      FUNDING TRACKS
                    </span>
                    <div className="space-y-1">
                      {tracksDropdown.map((track) => {
                        const Icon = track.icon;
                        return (
                          <Link
                            key={track.name}
                            href={track.href}
                            onClick={() => setMegamenuOpen(false)}
                            className="flex items-center justify-between rounded-lg p-2 text-xs font-semibold hover:bg-muted transition-colors"
                          >
                            <span className="flex items-center gap-2">
                              <Icon className="h-4 w-4 text-brand-blue" />
                              {track.name}
                            </span>
                            <span className="font-mono text-[9px] text-muted-foreground">
                              {track.count}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  {/* Middle Column: Featured This Week */}
                  <div className="col-span-7 space-y-3">
                    <span className="font-mono text-[10px] font-bold tracking-widest text-brand-gold-dark dark:text-brand-gold uppercase">
                      FEATURED THIS WEEK
                    </span>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl border bg-muted/40 p-3 hover:border-brand-gold/50 transition-colors">
                        <span className="rounded bg-red-500/10 text-red-500 font-bold px-1.5 py-0.5 text-[9px]">
                          MOST URGENT
                        </span>
                        <h4 className="mt-2 text-xs font-bold line-clamp-1">UNILAG CS Tuition</h4>
                        <p className="text-[10px] text-muted-foreground">₦450K · 68% funded</p>
                      </div>
                      <div className="rounded-xl border bg-muted/40 p-3 hover:border-brand-gold/50 transition-colors">
                        <span className="rounded bg-brand-gold/20 text-brand-gold-dark dark:text-brand-gold font-bold px-1.5 py-0.5 text-[9px]">
                          TOP FUNDED
                        </span>
                        <h4 className="mt-2 text-xs font-bold line-clamp-1">UI Clinical Medicine</h4>
                        <p className="text-[10px] text-muted-foreground">₦650K · 74% funded</p>
                      </div>
                    </div>

                    {/* Quick Guide Card */}
                    <div className="rounded-xl bg-gradient-to-r from-brand-blue/10 to-brand-gold/10 p-3 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold">The EduFund Sponsor Guide</p>
                        <p className="text-[10px] text-muted-foreground">Learn how collective school funding works</p>
                      </div>
                      <Link href="/auth?mode=signup" onClick={() => setMegamenuOpen(false)}>
                        <Button size="sm" variant="ghost" className="h-7 text-xs font-bold text-brand-blue">
                          Read
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link
            href="/tracks"
            className="rounded-full px-3.5 py-1.5 text-neutral-600 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition-colors"
          >
            All Tracks
          </Link>

          <Link
            href="/stacks"
            className="rounded-full px-3.5 py-1.5 text-neutral-600 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition-colors"
          >
            Semester Stacks
          </Link>

          <Link
            href="/explore"
            className="rounded-full px-3.5 py-1.5 text-neutral-600 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition-colors"
          >
            Explore
          </Link>

          <Link
            href="/how-it-works"
            className="rounded-full px-3.5 py-1.5 text-neutral-600 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition-colors"
          >
            How it works
          </Link>

          <Link
            href="/about"
            className="rounded-full px-3.5 py-1.5 text-neutral-600 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition-colors"
          >
            About
          </Link>

          {user && (
            <>
              <Link
                href="/dashboard"
                className={cn(
                  'rounded-full px-3.5 py-1.5 transition-colors',
                  pathname === '/dashboard'
                    ? 'bg-primary/10 text-primary font-bold'
                    : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/60'
                )}
              >
                Dashboard
              </Link>
              <Link
                href="/pledges"
                className={cn(
                  'rounded-full px-3.5 py-1.5 transition-colors',
                  pathname === '/pledges'
                    ? 'bg-primary/10 text-primary font-bold'
                    : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/60'
                )}
              >
                Pledges
              </Link>
              {profile?.is_admin && (
                <Link
                  href="/admin"
                  className={cn(
                    'rounded-full px-3.5 py-1.5 transition-colors',
                    pathname === '/admin'
                      ? 'bg-primary/10 text-primary font-bold'
                      : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/60'
                  )}
                >
                  Admin
                </Link>
              )}
            </>
          )}
        </nav>

        {/* Right action buttons */}
        <div className="flex items-center gap-2.5">
          <ThemeToggle />

          {user ? (
            <div className="flex items-center gap-2">
              <Link href="/goals/new">
                <Button size="sm" className="rounded-full gradient-bg-blue text-white font-bold h-8 sm:h-9 px-3 sm:px-4 shadow-sm text-xs sm:text-sm">
                  <Target className="mr-1 sm:mr-1.5 h-3.5 w-3.5" />
                  <span className="hidden xs:inline">New goal</span>
                  <span className="xs:hidden">Goal</span>
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="hidden md:flex rounded-full text-xs">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Link href="/auth?mode=signin">
                <Button variant="ghost" size="sm" className="rounded-full text-xs font-semibold px-2.5 sm:px-3 h-8">
                  Sign in
                </Button>
              </Link>
              <Link href="/auth?mode=signup">
                <Button size="sm" className="rounded-full gradient-bg-blue text-white font-bold text-xs h-8 px-2.5 sm:px-4 shadow-sm">
                  <span className="hidden sm:inline">Start an education goal</span>
                  <span className="sm:hidden">Start</span>
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile hamburger menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden rounded-full">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col gap-4 pt-6">
                <Link href="/" className="mb-2">
                  <EduFundLogo />
                </Link>
                <div className="space-y-1">
                  <Link href="/tracks" className="flex items-center gap-2 p-2 rounded-lg text-sm font-medium hover:bg-muted">
                    Funding Tracks
                  </Link>
                  <Link href="/stacks" className="flex items-center gap-2 p-2 rounded-lg text-sm font-medium hover:bg-muted">
                    Semester Stacks
                  </Link>
                  <Link href="/explore" className="flex items-center gap-2 p-2 rounded-lg text-sm font-medium hover:bg-muted">
                    Explore Campaigns
                  </Link>
                  <Link href="/how-it-works" className="flex items-center gap-2 p-2 rounded-lg text-sm font-medium hover:bg-muted">
                    How it works
                  </Link>
                  <Link href="/about" className="flex items-center gap-2 p-2 rounded-lg text-sm font-medium hover:bg-muted">
                    About EduFund
                  </Link>
                  {user && (
                    <>
                      <Link href="/dashboard" className="flex items-center gap-2 p-2 rounded-lg text-sm font-medium hover:bg-muted">
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>
                      <Link href="/goals/new" className="flex items-center gap-2 p-2 rounded-lg text-sm font-medium hover:bg-muted">
                        <Target className="h-4 w-4" />
                        New Goal
                      </Link>
                      <Link href="/pledges" className="flex items-center gap-2 p-2 rounded-lg text-sm font-medium hover:bg-muted">
                        <Heart className="h-4 w-4" />
                        Pledges
                      </Link>
                      <Link href="/settings" className="flex items-center gap-2 p-2 rounded-lg text-sm font-medium hover:bg-muted">
                        <Settings className="h-4 w-4" />
                        Settings
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
