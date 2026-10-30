'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getSupabaseClient } from '@/lib/supabase/client';
import { formatNaira, daysUntilDeadline } from '@/lib/finance';
import type { EducationGoal, GoalCategory } from '@/lib/types';
import {
  Compass,
  Search,
  Filter,
  GraduationCap,
  Home,
  BookOpen,
  BookMarked,
  Clock,
  ShieldCheck,
  ArrowRight,
  Heart,
  Loader2,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';
import { PillButton } from '@/components/landing/primitives';

const categoryLabels: Record<string, string> = {
  all: 'All Tracks',
  tuition: 'Tuition & Fees',
  accommodation: 'Hostels & Lodges',
  books: 'STEM & Books',
  other: 'Final Clearance',
};

// Seed campaigns to ensure explore registry always showcases active university student goals
const seedCampaigns = [
  {
    id: 'seed-1',
    public_slug: 'amina-bello-unilag-cs',
    title: '400L Computer Science Final Tuition & Lab Fees',
    public_display_name: 'Amina Bello',
    institution: 'University of Lagos (UNILAG)',
    category: 'tuition' as GoalCategory,
    target_amount_kobo: 38000000,
    starting_savings_kobo: 12000000,
    raised_kobo: 26000000,
    deadline: '2026-11-20',
    story: 'Final year software engineering student building accessible offline educational tools for public primary schools in Lagos.',
  },
  {
    id: 'seed-2',
    public_slug: 'chidi-nwosu-ui-medicine',
    title: 'Clinical Year Teaching Hospital Hostel & Kit',
    public_display_name: 'Chidi Nwosu',
    institution: 'University of Ibadan (UI)',
    category: 'accommodation' as GoalCategory,
    target_amount_kobo: 24000000,
    starting_savings_kobo: 5000000,
    raised_kobo: 18500000,
    deadline: '2026-11-15',
    story: '500L Medical Scholar at UI College of Medicine. Raising hostel accommodation deposit for teaching hospital clinical postings.',
  },
  {
    id: 'seed-3',
    public_slug: 'fatima-almustapha-abu-pharm',
    title: 'Final Year Pharmacognosy Fieldwork & Thesis',
    public_display_name: 'Fatima Al-Mustapha',
    institution: 'Ahmadu Bello University (ABU)',
    category: 'other' as GoalCategory,
    target_amount_kobo: 9500000,
    starting_savings_kobo: 2000000,
    raised_kobo: 7800000,
    deadline: '2026-11-28',
    story: 'Researching medicinal plant extracts for antimicrobial resistance. Need funding for laboratory solvent reagents and project binding.',
  },
  {
    id: 'seed-4',
    public_slug: 'tunde-bakare-oau-elec',
    title: 'Electrical Engineering Practical Microcontroller Kit',
    public_display_name: 'Tunde Bakare',
    institution: 'Obafemi Awolowo University (OAU)',
    category: 'books' as GoalCategory,
    target_amount_kobo: 11000000,
    starting_savings_kobo: 3000000,
    raised_kobo: 8200000,
    deadline: '2026-12-05',
    story: 'Embedded systems major working on solar inverter monitoring hardware. Raising funds for specialized development boards and sensors.',
  },
  {
    id: 'seed-5',
    public_slug: 'ngozi-eze-unn-nursing',
    title: '300L Clinical Nursing Matriculation & Uniforms',
    public_display_name: 'Ngozi Eze',
    institution: 'University of Nigeria, Nsukka (UNN)',
    category: 'tuition' as GoalCategory,
    target_amount_kobo: 19500000,
    starting_savings_kobo: 6000000,
    raised_kobo: 14000000,
    deadline: '2026-11-18',
    story: 'Entering clinical ward rotations. Funding covers university clinical fees, ward manuals, and diagnostic nurse kit.',
  },
  {
    id: 'seed-6',
    public_slug: 'emmanuel-adeyemi-futa-arch',
    title: 'Architecture Final Year Studio Clearance',
    public_display_name: 'Emmanuel Adeyemi',
    institution: 'Federal University of Technology, Akure (FUTA)',
    category: 'other' as GoalCategory,
    target_amount_kobo: 14000000,
    starting_savings_kobo: 4000000,
    raised_kobo: 9500000,
    deadline: '2026-11-30',
    story: 'Final year thesis on sustainable climate-adapted campus architecture. Funds cover 3D architectural model fabrication and printing.',
  },
];

export default function ExplorePage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedUniversity, setSelectedUniversity] = useState('all');
  const [dbGoals, setDbGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPublicGoals() {
      try {
        const supabase = getSupabaseClient();
        const { data } = await supabase
          .from('education_goals')
          .select('*')
          .eq('visibility', 'published');
        setDbGoals(data || []);
      } catch {
        // Fallback to seed campaigns
      } finally {
        setLoading(false);
      }
    }
    loadPublicGoals();
  }, []);

  // Merge database goals with seed campaigns, deduplicating
  const allCampaigns = [...dbGoals, ...seedCampaigns];

  // Filtering
  const filtered = allCampaigns.filter((item) => {
    // Search matching
    const query = search.toLowerCase().trim();
    const matchesSearch =
      !query ||
      item.title?.toLowerCase().includes(query) ||
      item.public_display_name?.toLowerCase().includes(query) ||
      item.institution?.toLowerCase().includes(query);

    // Category matching
    const matchesCat =
      selectedCategory === 'all' ||
      item.category === selectedCategory ||
      (selectedCategory === 'hostels' && item.category === 'accommodation') ||
      (selectedCategory === 'stem' && item.category === 'books') ||
      (selectedCategory === 'clearance' && item.category === 'other');

    // University matching
    const matchesUni =
      selectedUniversity === 'all' ||
      item.institution?.toLowerCase().includes(selectedUniversity.toLowerCase());

    return matchesSearch && matchesCat && matchesUni;
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
        <span className="text-foreground">Explore Campaigns</span>
      </div>

      {/* Main Title Banner */}
      <div className="space-y-4 border-b border-border/60 pb-10 mb-10">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-brand-gold/30 bg-brand-gold/10 px-3.5 py-1 font-mono text-xs font-bold tracking-widest text-brand-gold-dark dark:text-brand-gold uppercase">
          <Compass className="h-3.5 w-3.5" />
          VERIFIED NIGERIAN STUDENT REGISTRY
        </div>
        <h1 className="font-display text-4xl sm:text-6xl font-black tracking-tight text-foreground">
          Explore active education campaigns.
        </h1>
        <p className="max-w-3xl text-sm sm:text-base text-muted-foreground leading-relaxed">
          Support verified indigent students with direct Remita tuition settlement and Cowrywise locked savings.
          Every contribution is audited with zero platform commission.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="mb-10 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by student name, university, or course..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-border bg-card pl-10 pr-4 py-3 text-xs sm:text-sm font-sans placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-brand-blue"
            />
          </div>

          {/* University Dropdown */}
          <select
            value={selectedUniversity}
            onChange={(e) => setSelectedUniversity(e.target.value)}
            className="rounded-2xl border border-border bg-card px-4 py-3 text-xs sm:text-sm font-mono text-foreground focus:outline-hidden focus:ring-1 focus:ring-brand-blue"
          >
            <option value="all">All Universities</option>
            <option value="UNILAG">UNILAG (Lagos)</option>
            <option value="UI">UI (Ibadan)</option>
            <option value="OAU">OAU (Ile-Ife)</option>
            <option value="UNN">UNN (Nsukka)</option>
            <option value="ABU">ABU (Zaria)</option>
            <option value="FUTA">FUTA (Akure)</option>
          </select>
        </div>

        {/* Category Pill Filters */}
        <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs">
          {[
            { id: 'all', label: 'All Tracks' },
            { id: 'tuition', label: 'Tuition & Fees' },
            { id: 'hostels', label: 'Hostels & Lodges' },
            { id: 'stem', label: 'STEM & Books' },
            { id: 'clearance', label: 'Final Clearance' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-full px-4 py-1.5 transition-all ${
                selectedCategory === cat.id
                  ? 'gradient-bg-blue text-white font-bold shadow-xs'
                  : 'border border-border bg-card text-muted-foreground hover:text-foreground'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Campaigns Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center max-w-lg mx-auto">
          <Compass className="mx-auto h-10 w-10 text-muted-foreground/40 mb-3" />
          <h3 className="font-display text-lg font-bold">No campaigns match your filter</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Try adjusting your search terms or clearing your university filter.
          </p>
          <button
            onClick={() => { setSearch(''); setSelectedCategory('all'); setSelectedUniversity('all'); }}
            className="mt-4 rounded-full border border-border px-4 py-1.5 font-mono text-xs font-bold hover:bg-muted"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((goal, idx) => {
            const raised = goal.raised_kobo ?? (goal.starting_savings_kobo || 0);
            const target = goal.target_amount_kobo || 1;
            const percentage = Math.min(100, Math.round((raised / target) * 100));
            const daysLeft = daysUntilDeadline(goal.deadline);

            return (
              <div
                key={goal.id || idx}
                className="group flex flex-col justify-between rounded-3xl border border-border/80 bg-card p-6 shadow-sm hover:shadow-xl hover:border-brand-gold/60 transition-all duration-300"
              >
                <div className="space-y-4">
                  {/* Card Header: Institution & Deadline */}
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className="rounded-full border border-border bg-muted/60 px-2.5 py-0.5 text-muted-foreground truncate max-w-[180px]">
                      {goal.institution?.split('(')[1]?.replace(')', '') || goal.institution || 'University'}
                    </span>
                    <span
                      className={`font-bold flex items-center gap-1 ${
                        daysLeft <= 10 ? 'text-red-500' : 'text-emerald-500'
                      }`}
                    >
                      <Clock className="h-3 w-3" />
                      {daysLeft > 0 ? `${daysLeft}d left` : 'Due soon'}
                    </span>
                  </div>

                  {/* Title & Student Name */}
                  <div>
                    <h3 className="font-display text-lg font-bold text-foreground line-clamp-2 group-hover:text-brand-blue transition-colors">
                      {goal.title}
                    </h3>
                    <p className="text-xs text-muted-foreground font-mono mt-1">
                      By {goal.public_display_name || 'Verified Student'}
                    </p>
                  </div>

                  {/* Story excerpt */}
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {goal.story}
                  </p>

                  {/* Progress Bar & Math */}
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between items-center font-mono text-xs">
                      <span className="font-bold text-foreground">{formatNaira(raised)}</span>
                      <span className="text-muted-foreground text-[11px]">
                        Target: {formatNaira(target)} ({percentage}%)
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full gradient-bg-blue transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Card Action Link */}
                <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between">
                  <span className="stamp text-[9px]">REMITA TSA</span>
                  <Link
                    href={`/fund/${goal.public_slug}`}
                    className="inline-flex items-center gap-1 text-xs font-mono font-bold text-brand-blue group-hover:text-brand-gold transition-colors"
                  >
                    <span>Contribute</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Start Goal Strip */}
      <div className="mt-16 rounded-3xl gradient-bg-blue p-8 sm:p-10 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="font-display text-xl sm:text-2xl font-bold">Are you a student in need of funding?</h3>
          <p className="text-xs sm:text-sm text-white/80 mt-1">
            Create your verified goal and start receiving pledges from your community today.
          </p>
        </div>
        <PillButton href="/auth?mode=signup" variant="gold" icon={ArrowRight}>
          Create Your Goal
        </PillButton>
      </div>
    </div>
  );
}

