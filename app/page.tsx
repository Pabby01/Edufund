'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { EduFundLogo } from '@/components/edu-fund-logo';
import { Footer } from '@/components/footer';
import { Shelf3D } from '@/components/shelf-3d';
import { ReceiptSlip } from '@/components/receipt-slip';
import { MarqueeTicker } from '@/components/marquee-ticker';
import { AislesSection } from '@/components/aisles-section';
import { OverlappingStacks } from '@/components/overlapping-stacks';
import {
  Target,
  Users,
  CalendarClock,
  Heart,
  ShieldCheck,
  TrendingUp,
  GraduationCap,
  BookOpen,
  Home,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Share2,
  Bell,
  Eye,
  Plus,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col bg-background text-foreground">
      {/* ============================================================
          HERO SECTION (Shelfline Template 3D Shelf + Perforated Receipt)
         ============================================================ */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-border/40">
        {/* Subtle Background Glows and Shelf Guide Lines */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-10 right-1/4 h-[500px] w-[500px] rounded-full bg-brand-blue/15 blur-[120px]" />
          <div className="absolute top-40 -left-20 h-[400px] w-[400px] rounded-full bg-brand-gold/15 blur-[100px]" />
          {/* Subtle vertical shelf dividing lines */}
          <div className="mx-auto flex h-full max-w-7xl justify-between px-6 opacity-[0.03] dark:opacity-[0.05]">
            <div className="w-[1px] bg-foreground h-full" />
            <div className="w-[1px] bg-foreground h-full" />
            <div className="w-[1px] bg-foreground h-full" />
            <div className="w-[1px] bg-foreground h-full" />
          </div>
        </div>

        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-12 items-center">
            {/* Left Column: Bold Typography & Actions */}
            <div className="lg:col-span-6 space-y-6 animate-fade-up">
              {/* Category tracker line */}
              <div className="flex items-center gap-2 font-mono text-xs font-bold tracking-widest text-brand-gold-dark dark:text-brand-gold uppercase">
                <span>—</span> NIGERIAN UNIVERSITIES · TUITION · HOSTELS · PLEDGES
              </div>

              {/* Massive Display Title */}
              <h1 className="text-5xl sm:text-7xl lg:text-[5.25rem] font-black leading-[0.92] tracking-tight text-neutral-950 dark:text-white">
                Every semester <br />
                funded, <br />
                <span className="text-brand-gold">on one shelf.</span>
              </h1>

              {/* Subtitle */}
              <p className="max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed">
                EduFund helps Nigerian university students and their sponsors plan, save towards, and collectively fund school fees and off-campus accommodation before deadlines arrive.
              </p>

              {/* Shelfline Pill Button Controls */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link href="#aisles">
                  <div className="shelfline-btn gradient-bg-blue text-white shadow-lg hover:opacity-95">
                    <span className="px-5 py-3.5 font-bold flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-brand-gold animate-ping" />
                      Browse the shelf
                    </span>
                    <span className="bg-black/20 p-3.5 border-l border-white/20">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>

                <Link href="/goals/new">
                  <div className="shelfline-btn border border-neutral-300 dark:border-white/20 hover:bg-neutral-100 dark:hover:bg-white/10 text-neutral-900 dark:text-white">
                    <span className="px-5 py-3.5 font-bold">
                      Start an education goal
                    </span>
                    <span className="p-3.5 border-l border-neutral-300 dark:border-white/20">
                      <Plus className="h-4 w-4 text-brand-gold" />
                    </span>
                  </div>
                </Link>
              </div>

              {/* Verified Trust Strip */}
              <div className="flex items-center gap-6 pt-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-brand-blue" />
                  <span>Verified university timelines</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-brand-gold" />
                  <span>Integer kobo precision</span>
                </div>
              </div>

              {/* Perforated Receipt Paper Ticket (Bottom Left, like in Image 1) */}
              <div className="pt-4">
                <ReceiptSlip />
              </div>
            </div>

            {/* Right Column: Interactive 3D Shelves (Image 1 & 3) */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end">
              <Shelf3D />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          CONTINUOUS TICKER MARQUEE TAPE (Image 3 Bottom)
         ============================================================ */}
      <MarqueeTicker />

      {/* ============================================================
          THE AISLES SECTION (Image 4)
         ============================================================ */}
      <div id="aisles">
        <AislesSection />
      </div>

      {/* ============================================================
          OVERLAPPING / STACKING SCROLL CARDS (Image 5)
         ============================================================ */}
      <div id="stacks">
        <OverlappingStacks />
      </div>

      {/* ============================================================
          HOW IT WORKS (Interactive Transparent Workflow)
         ============================================================ */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 border-t border-border/40">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="font-mono text-xs font-bold tracking-widest text-brand-gold uppercase">
              — SYSTEM ARCHITECTURE
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
              How collective funding works
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              A transparent, milestone-driven engine connecting student aspirations with verified community sponsors.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: '01',
                title: 'Set up your goal & deadline',
                desc: 'Enter your exact tuition or accommodation fee in Nigerian Naira. EduFund sets a daily and weekly target countdown based on your school calendar.',
                icon: Target,
                color: 'text-brand-blue',
              },
              {
                step: '02',
                title: 'Share your verified link',
                desc: 'Generate a public, privacy-safe campaign URL. Family, alumni, and sponsors can contribute directly or commit to recurring monthly pledges.',
                icon: Share2,
                color: 'text-brand-gold',
              },
              {
                step: '03',
                title: 'Lock & fund before deadline',
                desc: 'Track confirmed contributions and pledge projections in real-time. Reach 100% readiness with zero stress and zero debt.',
                icon: ShieldCheck,
                color: 'text-emerald-500',
              },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.step}
                  className="rounded-2xl border border-border/60 bg-card p-8 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-xs font-bold tracking-widest text-brand-gold uppercase">
                      STEP {card.step}
                    </span>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted/60">
                      <Icon className={`h-6 w-6 ${card.color}`} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3">{card.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{card.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          CALL TO ACTION FOOTER BANNER
         ============================================================ */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-neutral-950 text-white overflow-hidden border-t border-white/10">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[600px] rounded-full bg-brand-blue/20 blur-[140px]" />
        </div>
        <div className="relative mx-auto max-w-4xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-gold/30 bg-brand-gold/10 px-4 py-1 text-xs font-medium text-brand-gold">
            <Sparkles className="h-3.5 w-3.5" />
            Cowrywise Ambassadors Innovation Challenge 2026
          </div>
          <h2 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            Ready to secure your next semester?
          </h2>
          <p className="text-neutral-400 max-w-xl mx-auto text-base">
            Join hundreds of Nigerian students funding their education debt-free. It takes less than two minutes to publish your first goal.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Link href="/auth?mode=signup">
              <Button size="lg" className="rounded-full gradient-bg-blue text-white font-bold h-12 px-8 shadow-xl hover:opacity-95 text-base">
                Create a student account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/auth?mode=signin">
              <Button size="lg" variant="outline" className="rounded-full border-white/20 text-white hover:bg-white/10 h-12 px-8 text-base">
                Sign in to dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
