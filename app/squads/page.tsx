'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchAllSquads } from '@/lib/squads';
import type { AlumniSquad } from '@/lib/types';
import { formatNaira } from '@/lib/finance';
import {
  Users,
  Search,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Plus,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PillButton } from '@/components/landing/primitives';

export default function SquadsPage() {
  const [search, setSearch] = useState('');
  const [selectedUni, setSelectedUni] = useState('all');
  const [squads, setSquads] = useState<AlumniSquad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await fetchAllSquads();
      setSquads(data);
      setLoading(false);
    }
    load();
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
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center">
          <Users className="mx-auto h-12 w-12 text-muted-foreground/40 mb-3" />
          <h3 className="font-display text-lg font-bold">No squads found</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Try adjusting your search query or university filter.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filtered.map((squad) => {
            const percent = Math.min(
              100,
              Math.round(((squad.raised_amount_kobo || 0) / (squad.target_amount_kobo || 1)) * 100)
            );

            return (
              <div
                key={squad.id || squad.slug}
                className="group flex flex-col justify-between rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm hover:shadow-xl hover:border-brand-gold/60 transition-all duration-300 space-y-6"
              >
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="rounded-full border border-border bg-muted/60 px-3 py-1 font-bold text-muted-foreground">
                      {squad.class_year || 'Alumni Set'}
                    </span>
                    <span className="text-emerald-500 font-bold flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      {squad.students_supported || 0} Scholars Cleared
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
                      <span className="font-bold text-foreground">{formatNaira(squad.raised_amount_kobo || 0)}</span>
                      <span className="text-muted-foreground text-[11px]">
                        Target: {formatNaira(squad.target_amount_kobo)} ({percent}%)
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
                    <span className="font-bold text-foreground">{squad.coordinator_name}</span>
                  </div>
                </div>

                {/* Action row */}
                <div className="pt-4 border-t border-border/60 flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-muted-foreground">
                    {squad.members_count || 1} Alumni Members
                  </span>
                  <Link href={`/squads/${squad.slug || squad.id}`}>
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
      )}

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
        <PillButton href="/admin" variant="gold" icon={Plus}>
          Manage Squads in Admin
        </PillButton>
      </div>
    </div>
  );
}
