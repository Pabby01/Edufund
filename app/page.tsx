'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ProgressBar } from '@/components/progress-bar';
import { EduFundLogo } from '@/components/edu-fund-logo';
import { Footer } from '@/components/footer';
import {
  Target, Users, CalendarClock, Heart, ShieldCheck, TrendingUp,
  GraduationCap, BookOpen, Home, Sparkles, ArrowRight, CheckCircle2,
  Share2, Bell, Eye,
} from 'lucide-react';

const HERO_IMG = 'https://images.pexels.com/photos/38451631/pexels-photo-38451631.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
const GRAD_IMG = 'https://images.pexels.com/photos/901964/pexels-photo-901964.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-16 pb-20 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-brand-blue/10 blur-3xl" />
          <div className="absolute top-20 -left-40 h-96 w-96 rounded-full bg-brand-gold/10 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="animate-fade-up space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-gold/30 bg-brand-gold/10 px-3 py-1 text-xs font-medium text-brand-gold-dark dark:text-brand-gold-light">
                <Sparkles className="h-3.5 w-3.5" />
                Cowrywise Ambassadors Innovation Challenge 2026
              </div>
              <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Your education shouldn&apos;t depend on{' '}
                <span className="gradient-text">one payment deadline.</span>
              </h1>
              <p className="max-w-lg text-lg text-muted-foreground">
                EduFund helps Nigerian university students plan, save towards, and collectively
                fund school fees and accommodation — with planned contributions, family support,
                and community-funded education before deadlines arrive.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/auth?mode=signup">
                  <Button size="lg" className="gradient-bg-blue text-white hover:opacity-90">
                    Start an education goal
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#how-it-works">
                  <Button size="lg" variant="outline">
                    Explore how it works
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-brand-blue" />
                  Free to start
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-brand-gold" />
                  No card required
                </div>
              </div>
            </div>

            {/* Dashboard preview mockup */}
            <div className="animate-fade-up glass-card relative rounded-2xl p-6 shadow-2xl" style={{ animationDelay: '0.1s' }}>
              <div className="mb-4 flex items-center justify-between">
                <EduFundLogo showWordmark={false} size={28} />
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-400/60" />
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-400/60" />
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/60" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Total target', val: '₦450K', icon: Target, color: 'text-brand-blue' },
                    { label: 'Funded', val: '₦187K', icon: TrendingUp, color: 'text-brand-gold' },
                    { label: 'Days left', val: '42', icon: CalendarClock, color: 'text-emerald-500' },
                  ].map((stat) => {
                    const Icon = stat.icon;
                    return (
                      <div key={stat.label} className="rounded-xl border bg-card/80 p-3">
                        <Icon className={`mb-1.5 h-4 w-4 ${stat.color}`} />
                        <div className="text-lg font-bold">{stat.val}</div>
                        <div className="text-xs text-muted-foreground">{stat.label}</div>
                      </div>
                    );
                  })}
                </div>
                <div className="rounded-xl border bg-card/80 p-4">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium">Tuition — UNILAG 2026</span>
                    <span className="text-muted-foreground">42%</span>
                  </div>
                  <ProgressBar value={42} />
                  <div className="mt-2 text-xs text-muted-foreground">₦187,000 of ₦450,000</div>
                </div>
                <div className="rounded-xl border bg-card/80 p-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Heart className="h-4 w-4 text-brand-gold" />
                    <span className="font-medium">3 active pledges</span>
                    <span className="ml-auto text-xs text-muted-foreground">₦12K/mo projected</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Three simple steps</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              From goal to funded — a clear path to meeting your education deadline.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                step: '01',
                icon: Target,
                title: 'Create a goal',
                desc: 'Set your target amount, deadline, and expense category. Add your story so sponsors understand your journey.',
              },
              {
                step: '02',
                icon: Share2,
                title: 'Invite your community',
                desc: 'Share your campaign link with family, friends, and supporters. No account required for sponsors to contribute.',
              },
              {
                step: '03',
                icon: CalendarClock,
                title: 'Reach your deadline',
                desc: 'Track progress, manage pledges, and close the funding gap before your payment deadline arrives.',
              },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <Card key={s.step} className="card-3d relative overflow-hidden">
                  <div className="absolute right-4 top-4 text-5xl font-bold text-muted/20">
                    {s.step}
                  </div>
                  <CardHeader>
                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-blue/10">
                      <Icon className="h-6 w-6 text-brand-blue" />
                    </div>
                    <CardTitle className="text-xl">{s.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{s.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-muted/20 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Built for students and sponsors</h2>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {/* Student benefits */}
            <Card className="card-3d">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-blue/10">
                  <GraduationCap className="h-6 w-6 text-brand-blue" />
                </div>
                <CardTitle>For students</CardTitle>
                <CardDescription>Take control of your education funding</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  'Create goals for tuition, accommodation, books and more',
                  'Track confirmed contributions and pledges separately',
                  'See your funding gap and required savings rate',
                  'Share a clean campaign page with your community',
                  'Manage pledge reminders and encouragement notes',
                ].map((b) => (
                  <div key={b} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-blue" />
                    <span>{b}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Sponsor benefits */}
            <Card className="card-3d">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gold/10">
                  <Heart className="h-6 w-6 text-brand-gold" />
                </div>
                <CardTitle>For sponsors</CardTitle>
                <CardDescription>Support a student without an account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  'Open a shared campaign link — no sign-up needed',
                  'See transparent progress, funding gap and deadline',
                  'Make a demo contribution or pledge future support',
                  'Leave encouragement notes with public display consent',
                  'Choose daily, weekly, or monthly pledge frequencies',
                ].map((b) => (
                  <div key={b} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" />
                    <span>{b}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Transparent progress */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="relative overflow-hidden rounded-2xl">
              <img
                src={GRAD_IMG}
                alt="Graduates celebrating"
                className="h-full w-full object-cover"
                style={{ aspectRatio: '4/3' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tight">Transparent campaign progress</h2>
              <p className="text-muted-foreground">
                Every campaign shows a clear breakdown: target amount, confirmed contributions,
                self-reported savings, and the outstanding gap. No hidden numbers, no inflated totals.
                Pledges are shown separately and never counted as money received.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Eye, title: 'Public progress bar', desc: 'Percentage funded, days remaining, and funding gap — visible at a glance.' },
                  { icon: ShieldCheck, title: 'Privacy by default', desc: 'No emails, phone numbers, or private details exposed on public pages.' },
                  { icon: Bell, title: 'Pledge reminders', desc: 'Sponsors opt in to daily, weekly, or monthly reminders — with easy opt-out.' },
                ].map((f) => {
                  const Icon = f.icon;
                  return (
                    <div key={f.title} className="flex gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-blue/10">
                        <Icon className="h-5 w-5 text-brand-blue" />
                      </div>
                      <div>
                        <h3 className="font-medium">{f.title}</h3>
                        <p className="text-sm text-muted-foreground">{f.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category showcase */}
      <section className="bg-muted/20 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-3xl font-bold tracking-tight">Fund what matters</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: GraduationCap, title: 'Tuition', desc: 'Semester fees and registration' },
              { icon: Home, title: 'Accommodation', desc: 'Off-campus housing and rent' },
              { icon: BookOpen, title: 'Books & Materials', desc: 'Textbooks, supplies, equipment' },
              { icon: Target, title: 'Other', desc: 'Lab fees, projects, field trips' },
            ].map((c) => {
              const Icon = c.icon;
              return (
                <Card key={c.title} className="card-3d text-center">
                  <CardContent className="pt-6">
                    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gold/10">
                      <Icon className="h-7 w-7 text-brand-gold" />
                    </div>
                    <h3 className="font-semibold">{c.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Disclosure + CTA */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="glass-card rounded-2xl p-8 shadow-lg">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10">
              <ShieldCheck className="h-6 w-6 text-amber-500" />
            </div>
            <h2 className="text-2xl font-bold">Hackathon prototype disclosure</h2>
            <p className="mt-3 text-muted-foreground">
              EduFund is an MVP built for the Cowrywise Ambassadors Innovation Challenge 2026.
              This prototype does not hold, transfer, or invest real funds. All contributions in this
              demo are simulated and clearly labelled. A future production version would integrate
              a licensed payment provider and the Cowrywise Embed API for real savings.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/auth?mode=signup">
                <Button size="lg" className="gradient-bg-blue text-white hover:opacity-90">
                  Get started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button size="lg" variant="outline">Learn more</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
