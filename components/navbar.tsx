'use client';

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
  SheetClose,
} from '@/components/ui/sheet';
import { Menu, LayoutDashboard, Target, Heart, Settings, LogOut, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/goals/new', label: 'New Goal', icon: Target },
  { href: '/pledges', label: 'Pledges', icon: Heart },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Navbar() {
  const { user, profile, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <header className="glass-nav sticky top-0 z-40 w-full border-b border-border/40">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center">
          <EduFundLogo />
        </Link>

        {/* Desktop nav */}
        {user && (
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = pathname === link.href || pathname.startsWith(link.href + '/');
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    active
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
            {profile?.is_admin && (
              <Link
                href="/admin"
                className={cn(
                  'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  pathname.startsWith('/admin')
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
              >
                <Shield className="h-4 w-4" />
                Admin
              </Link>
            )}
          </nav>
        )}

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <>
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="hidden md:flex">
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </Button>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-64">
                  <div className="flex flex-col gap-2 pt-6">
                    <Link href="/" className="mb-4">
                      <EduFundLogo />
                    </Link>
                    {navLinks.map((link) => {
                      const Icon = link.icon;
                      return (
                        <SheetClose asChild key={link.href}>
                          <Link
                            href={link.href}
                            className={cn(
                              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                              pathname === link.href
                                ? 'bg-primary/10 text-primary'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                            )}
                          >
                            <Icon className="h-4 w-4" />
                            {link.label}
                          </Link>
                        </SheetClose>
                      );
                    })}
                    {profile?.is_admin && (
                      <SheetClose asChild>
                        <Link
                          href="/admin"
                          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        >
                          <Shield className="h-4 w-4" />
                          Admin
                        </Link>
                      </SheetClose>
                    )}
                    <Button variant="ghost" size="sm" onClick={handleSignOut} className="mt-4 justify-start">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link href="/auth">
                <Button variant="ghost" size="sm">Sign in</Button>
              </Link>
              <Link href="/auth?mode=signup">
                <Button size="sm">Get started</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
