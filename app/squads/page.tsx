'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getSupabaseClient } from '@/lib/supabase/client';
import { formatNaira, formatNairaShort } from '@/lib/finance';
import {
  Users,
  Search,
  GraduationCap,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Heart,
  ShieldCheck,
  TrendingUp,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PillButton } from '@/components/landing/primitives';

export interface AlumniSquad {
  id: string;
  name: string;
  university: string;
  faculty: string;
  classYear: string;
  targetKobo: number;
  raisedKobo: number;
  membersCount: number;
  studentsSupported: number;
  coordinator: string;
  description: string;
}

const defaultSquads: AlumniSquad[] = [
  {
    id: 'unilag-cs-18',
    name: "UNILAG Computer Science '18 Squad",
    university: 'University of Lagos (UNILAG)',
    faculty: 'Faculty of Science',
    classYear: 'Class of 2018',
    targetKobo: 250000000, // ₦2.5M
    raisedKobo: 185000000, // ₦1.85M
    membersCount: 28,
    studentsSupported: 6,
    coordinator: 'Engr. Dapo Alabi (Tech Lead, Lagos)',
    description:
      'Alumni class set pooling monthly pledges to fund indigent 300L & 400L computer science students before matriculation portal closure.',
  },
  {
    id: 'ui-med-15',
    name: 'UI College of Medicine 2015 Circle',
    university: 'University of Ibadan (UI)',
    faculty: 'College of Medicine & Dentistry',
    classYear: 'Class of 2015',
    targetKobo: 450000000, // ₦4.5M
    raisedKobo: 390000000, // ₦3.9M
    membersCount: 42,
    studentsSupported: 8,
    coordinator: 'Dr. Kelechi Nwosu (UCH Consultant)',
    description:
      'Medical alumni paying teaching hospital school fees and clinical hostel accommodation for indigent 500L medical students.',
  },
  {
    id: 'oau-law-19',
    name: 'Great Ife Law Alumni Set 2019',
    university: 'Obafemi Awolowo University (OAU)',
    faculty: 'Faculty of Law',
    classYear: 'Class of 2019',
    targetKobo: 180000000, // ₦1.8M
    raisedKobo: 145000000, // ₦1.45M
    membersCount: 31,
    studentsSupported: 4,
    coordinator: 'Barr. Folashade Adeleke (Abuja)',
    description:
      'Class pooling funds for finalist law student project fieldwork, Nigerian Law School application deposits, and library dues.',
  },
  {
    id: 'unn-elec-20',
    name: 'UNN Electronic Engineering Alumni Squad',
    university: 'University of Nigeria, Nsukka (UNN)',
    faculty: 'Faculty of Engineering',
    classYear: 'Class of 2020',
    targetKobo: 200000000, // ₦2.0M
    raisedKobo: 160000000, // ₦1.6M
    membersCount: 22,
    studentsSupported: 5,
    coordinator: 'Ifeanyi Okoro (Hardware Engineer)',
    description:
      'Supporting penultimate and final year engineering scholars with laboratory fees and practical embedded hardware toolkits.',
  },
];

export default function SquadsPage() {
  const [search, setSearch] = useState('');
  const [selectedUni, setSelectedUni] = useState('all');
  const [squads, setSquads] = useState<AlumniSquad[]>(defaultSquads);

  // In production, sync with Supabase squads table
  useEffect(() => {
    async function fetchSquads() {
      try {
        const supabase = getSupabaseClient();
        const { data } = await supabase.from('alumni_squads').select('*');
        if (data && data.length > 0) {
          setSquads(data as AlumniSquad[]);
        }
      } catch {
        // Fallback to default class squads
      }
    }
    fetchSquads();
  }, []);

  const filtered = squads.filter((sq) => {
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      sq.name.toLowerCase().includes(q) ||
      sq.university.toLowerCase().includes(q) ||
      sq.faculty.toLowerCase().includes(q);
    const matchesUni =
      selectedUni === 'all' || sq.university.toLowerCase().includes(selectedUni.toLowerCase());
    return matchesSearch && matchesUni;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Breadcrumb Header */}
      <div className="mb-8 flex items-center gap-2 font-mono text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors flex items-center gap-1">
          <ArrowLeft className="h-3 w-3" />
          <span>Home</span>
        </Link>
        <span>/</span>
        <span className="text-foreground">Alumni & Class Squads</span>
      </div>

      {/* Hero Header */}
      <div className="space-y-4 border-b border-border/60 pb-10 mb-10">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-brand-gold/30 bg-brand-gold/10 px-3.5 py-1 font-mono text-xs font-bold tracking-widest text-brand-gold-dark dark:text-brand-gold uppercase">
          <Users className="h-3.5 w-3.5" />
          COLLECTIVE CLASS SET CHALLENGES
        </div>
        <h1 className="font-display text-4xl sm:text-6xl font-black tracking-tight text-foreground">
          Alumni & departmental squad pools.
        </h1>
        <p className="max-w-3xl text-sm sm:text-base text-muted-foreground leading-relaxed">
          Departmental sets and alumni class circles pooling monthly contributions to fund multiple indigent
          scholars in their alma mater. Audited with direct Remita settlement and zero platform commission.
        </p>
      </div>

      {/* Filter Row */}
      <div className="mb-10 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by alumni set, department, or university..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-border bg-card pl-10 pr-4 py-3 text-xs sm:text-sm font-sans focus:outline-hidden focus:ring-1 focus:ring-brand-blue"
          />
        </div>

        <select
          value={selectedUni}
          onChange={(e) => setSelectedUni(e.target.value)}
          className="rounded-2xl border border-border bg-card px-4 py-3 text-xs sm:text-sm font-mono text-foreground focus:outline-hidden focus:ring-1 focus:ring-brand-blue"
        >
          <option value="all">All Universities</option>
          <option value="UNILAG">UNILAG (Lagos)</option>
          <option value="UI">UI (Ibadan)</option>
          <option value="OAU">OAU (Ile-Ife)</option>
          <option value="UNN">UNN (Nsukka)</option>
        </select>
      </div>

      {/* Squad Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {filtered.map((squad) => {
          const percent = Math.min(100, Math.round((squad.raisedKobo / squad.targetKobo) * 100));

          return (
            <div
              key={squad.id}
              className="group flex flex-col justify-between rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm hover:shadow-xl hover:border-brand-gold/60 transition-all duration-300 space-y-6"
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="rounded-full border border-border bg-muted/60 px-3 py-1 font-bold text-muted-foreground">
                    {squad.classYear}
                  </span>
                  <span className="text-emerald-500 font-bold flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {squad.studentsSupported} Scholars Cleared
                  </span>
                </div>

                {/* Title & University */}
                <div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground group-hover:text-brand-blue transition-colors">
                    {squad.name}
                  </h3>
                  <p className="text-xs text-muted-foreground font-mono mt-1">
                    {squad.university} · {squad.faculty}
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {squad.description}
                </p>

                {/* Progress bar */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between items-center font-mono text-xs">
                    <span className="font-bold text-foreground">{formatNaira(squad.raisedKobo)}</span>
                    <span className="text-muted-foreground text-[11px]">
                      Target: {formatNaira(squad.targetKobo)} ({percent}%)
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full gradient-bg-blue transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                {/* Coordinator Tag */}
                <div className="rounded-xl border border-border/60 bg-muted/30 p-3 font-mono text-[11px] flex items-center justify-between">
                  <span className="text-muted-foreground">Squad Coordinator:</span>
                  <span className="font-bold text-foreground">{squad.coordinator}</span>
                </div>
              </div>

              {/* Action row */}
              <div className="pt-4 border-t border-border/60 flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-muted-foreground">
                  {squad.membersCount} Alumni Members
                </span>
                <Link href={`/squads/${squad.id}`}>
                  <Button size="sm" className="rounded-full gradient-bg-blue text-white font-mono text-xs h-8 px-4">
                    <span>Join & Pledge</span>
                    <ArrowRight className="ml-1.5 h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Start a Squad CTA */}
      <div className="mt-16 rounded-3xl gradient-bg-blue p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="font-display text-2xl sm:text-3xl font-black">
            Want to start an alumni squad for your graduating class?
          </h3>
          <p className="text-sm text-white/80 max-w-xl">
            Rally your departmental classmates to adopt indigent scholars and ensure 100% matriculation retention.
          </p>
        </div>
        <PillButton href="/auth?mode=signup" variant="gold" icon={Plus}>
          Register an Alumni Squad
        </PillButton>
      </div>
    </div>
  );
}

