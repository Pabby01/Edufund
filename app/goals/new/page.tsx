'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { getSupabaseClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ProgressBar } from '@/components/progress-bar';
import { Badge } from '@/components/ui/badge';
import {
  Target, GraduationCap, Home, BookOpen, ArrowRight, ArrowLeft,
  CheckCircle2, Loader2, Eye, Calendar,
} from 'lucide-react';
import { nairaToKobo, formatNaira, daysUntilDeadline, computeFundingSummary } from '@/lib/finance';
import { EduFundLogo } from '@/components/edu-fund-logo';
import type { GoalCategory } from '@/lib/types';
import { toast } from 'sonner';

const categories: { value: GoalCategory; label: string; icon: typeof Target }[] = [
  { value: 'tuition', label: 'Tuition', icon: GraduationCap },
  { value: 'accommodation', label: 'Accommodation', icon: Home },
  { value: 'books', label: 'Books & Materials', icon: BookOpen },
  { value: 'other', label: 'Other education expense', icon: Target },
];

const nigerianUniversities = [
  'University of Lagos (UNILAG)',
  'University of Ibadan (UI)',
  'University of Nigeria, Nsukka (UNN)',
  'Obafemi Awolowo University (OAU)',
  'Ahmadu Bello University (ABU)',
  'University of Benin (UNIBEN)',
  'Covenant University',
  'Babcock University',
  'Lagos State University (LASU)',
  'Federal University of Technology, Akure (FUTA)',
  'Other',
];

export default function NewGoalPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const supabase = getSupabaseClient();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<GoalCategory>('tuition');
  const [institution, setInstitution] = useState('');
  const [session, setSession] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [startingSavings, setStartingSavings] = useState('');
  const [deadline, setDeadline] = useState('');
  const [story, setStory] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [publicDisplayName, setPublicDisplayName] = useState('');
  const [consentPublic, setConsentPublic] = useState(false);
  const [publishNow, setPublishNow] = useState(false);

  if (authLoading) {
    return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }
  if (!user) {
    router.push('/auth');
    return null;
  }

  const validateStep1 = () => {
    if (title.trim().length < 3) { toast.error('Goal title must be at least 3 characters'); return false; }
    if (!institution) { toast.error('Please select your institution'); return false; }
    if (!session.trim()) { toast.error('Please enter your academic session'); return false; }
    return true;
  };

  const validateStep2 = () => {
    const target = parseFloat(targetAmount);
    if (!target || target <= 0) { toast.error('Target amount must be a positive number'); return false; }
    const savings = parseFloat(startingSavings) || 0;
    if (savings < 0) { toast.error('Starting savings cannot be negative'); return false; }
    if (!deadline) { toast.error('Please select a payment deadline'); return false; }
    const days = daysUntilDeadline(deadline);
    if (days < 0) { toast.error('Deadline cannot be in the past'); return false; }
    return true;
  };

  const validateStep3 = () => {
    if (publishNow && !consentPublic) { toast.error('You must consent to public display to publish'); return false; }
    if (publishNow && publicDisplayName.trim().length < 2) { toast.error('Public display name must be at least 2 characters to publish'); return false; }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep((s) => Math.min(3, s + 1));
  };

  const handlePrev = () => setStep((s) => Math.max(1, s - 1));

  const handleSubmit = async () => {
    if (!validateStep1() || !validateStep2() || !validateStep3()) return;
    setSubmitting(true);

    const targetKobo = nairaToKobo(parseFloat(targetAmount));
    const savingsKobo = nairaToKobo(parseFloat(startingSavings) || 0);

    // Generate unique slug if publishing
    let slug: string | null = null;
    if (publishNow) {
      slug = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 6);
    }

    const { data, error } = await supabase
      .from('education_goals')
      .insert({
        user_id: user.id,
        title: title.trim(),
        category,
        institution,
        session: session.trim(),
        target_amount_kobo: targetKobo,
        starting_savings_kobo: savingsKobo,
        deadline,
        story: story.trim() || null,
        cover_image_url: coverImageUrl.trim() || null,
        visibility: publishNow ? 'published' : 'draft',
        public_slug: slug,
        public_display_name: publicDisplayName.trim() || null,
        consent_public: consentPublic,
      })
      .select()
      .single();

    if (error) {
      toast.error('Failed to create goal: ' + error.message);
      setSubmitting(false);
      return;
    }

    toast.success(publishNow ? 'Goal created and published!' : 'Goal created as draft!');
    router.push(`/goals/${data.id}`);
  };

  const targetKobo = nairaToKobo(parseFloat(targetAmount) || 0);
  const savingsKobo = nairaToKobo(parseFloat(startingSavings) || 0);
  const previewSummary = targetKobo > 0 ? computeFundingSummary({
    targetKobo,
    startingSavingsKobo: savingsKobo,
    confirmedContributionsKobo: 0,
    pledgedProjectedKobo: 0,
    deadline: deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  }) : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Create an education goal</h1>
        <p className="mt-1 text-muted-foreground">Set up your funding target and share it with your community.</p>
      </div>

      {/* Step indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {['Details', 'Amount & Deadline', 'Review & Publish'].map((label, i) => (
            <div key={label} className="flex items-center">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                step > i + 1 ? 'bg-brand-blue text-white' : step === i + 1 ? 'bg-brand-blue/10 text-brand-blue border-2 border-brand-blue' : 'bg-muted text-muted-foreground'
              }`}>
                {step > i + 1 ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
              </div>
              <span className={`ml-2 text-sm font-medium ${step === i + 1 ? 'text-foreground' : 'text-muted-foreground'}`}>
                {label}
              </span>
              {i < 2 && <div className={`mx-3 h-0.5 w-8 sm:w-16 ${step > i + 1 ? 'bg-brand-blue' : 'bg-border'}`} />}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Details */}
      {step === 1 && (
        <Card className="card-3d animate-fade-up">
          <CardHeader>
            <CardTitle>Goal details</CardTitle>
            <CardDescription>Tell us what you&apos;re raising funds for.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Goal title</Label>
              <Input id="title" placeholder="e.g. Second semester tuition 2026" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Expense category</Label>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setCategory(cat.value)}
                      className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all ${
                        category === cat.value
                          ? 'border-brand-blue bg-brand-blue/5 text-brand-blue'
                          : 'border-border hover:border-brand-blue/40'
                      }`}
                    >
                      <Icon className="h-6 w-6" />
                      <span className="text-xs font-medium">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="institution">University / Institution</Label>
              <Select value={institution} onValueChange={setInstitution}>
                <SelectTrigger id="institution"><SelectValue placeholder="Select your institution" /></SelectTrigger>
                <SelectContent>
                  {nigerianUniversities.map((uni) => (
                    <SelectItem key={uni} value={uni}>{uni}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="session">Academic session / Semester</Label>
              <Input id="session" placeholder="e.g. 2025/2026 Second Semester" value={session} onChange={(e) => setSession(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="story">Your story (optional)</Label>
              <Textarea id="story" placeholder="Share why this goal matters to you. Sponsors connect with authentic stories." value={story} onChange={(e) => setStory(e.target.value)} rows={4} maxLength={1000} />
              <p className="text-xs text-muted-foreground">{story.length}/1000 characters</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Amount & Deadline */}
      {step === 2 && (
        <Card className="card-3d animate-fade-up">
          <CardHeader>
            <CardTitle>Amount & deadline</CardTitle>
            <CardDescription>Set your funding target and payment deadline.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="target">Total target amount (NGN)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">₦</span>
                <Input id="target" type="number" placeholder="450000" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} className="pl-8" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="savings">Amount already saved (NGN)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">₦</span>
                <Input id="savings" type="number" placeholder="50000" value={startingSavings} onChange={(e) => setStartingSavings(e.target.value)} className="pl-8" />
              </div>
              <p className="text-xs text-muted-foreground">Self-reported savings you&apos;ve already put aside.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Payment deadline</Label>
              <Input id="deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="coverImage">Cover image URL (optional)</Label>
              <Input id="coverImage" type="url" placeholder="https://..." value={coverImageUrl} onChange={(e) => setCoverImageUrl(e.target.value)} />
            </div>

            {/* Live calculation preview */}
            {previewSummary && targetKobo > 0 && (
              <div className="rounded-xl border bg-muted/30 p-4">
                <h4 className="mb-3 text-sm font-semibold">Funding preview</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Target</span><span className="font-medium">{formatNaira(previewSummary.targetKobo)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Starting savings</span><span className="font-medium">{formatNaira(previewSummary.startingSavingsKobo)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Funding gap</span><span className="font-medium text-red-500">{formatNaira(previewSummary.remainingGapKobo)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Days remaining</span><span className="font-medium">{previewSummary.daysRemaining}</span></div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between"><span className="text-muted-foreground">Required daily</span><span className="font-medium">{formatNaira(previewSummary.requiredDailyKobo)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Required weekly</span><span className="font-medium">{formatNaira(previewSummary.requiredWeeklyKobo)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Required monthly</span><span className="font-medium">{formatNaira(previewSummary.requiredMonthlyKobo)}</span></div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 3: Review & Publish */}
      {step === 3 && (
        <div className="space-y-4">
          <Card className="card-3d animate-fade-up">
            <CardHeader>
              <CardTitle>Review & publish</CardTitle>
              <CardDescription>Review your goal and choose whether to publish it.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Summary */}
              <div className="rounded-xl border bg-muted/30 p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Badge>{categories.find((c) => c.value === category)?.label}</Badge>
                  {publishNow && <Badge variant="default">Will be published</Badge>}
                </div>
                <h3 className="text-lg font-semibold">{title || 'Untitled goal'}</h3>
                <p className="text-sm text-muted-foreground">{institution} · {session}</p>
                <div className="grid grid-cols-2 gap-2 pt-2 text-sm">
                  <div><span className="text-muted-foreground">Target:</span> <span className="font-medium">{formatNaira(targetKobo)}</span></div>
                  <div><span className="text-muted-foreground">Saved:</span> <span className="font-medium">{formatNaira(savingsKobo)}</span></div>
                  <div><span className="text-muted-foreground">Deadline:</span> <span className="font-medium">{deadline || '—'}</span></div>
                  <div><span className="text-muted-foreground">Gap:</span> <span className="font-medium text-red-500">{formatNaira(Math.max(0, targetKobo - savingsKobo))}</span></div>
                </div>
              </div>

              {/* Publication settings */}
              <div className="space-y-3 rounded-xl border p-4">
                <div className="flex items-center gap-2">
                  <Checkbox id="publish" checked={publishNow} onCheckedChange={(v) => setPublishNow(v === true)} />
                  <Label htmlFor="publish" className="cursor-pointer">Publish this campaign now</Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Published campaigns get a shareable link. You can keep this as a draft and publish later.
                </p>

                {publishNow && (
                  <div className="space-y-3 border-t pt-3">
                    <div className="space-y-2">
                      <Label htmlFor="publicName">Public display name</Label>
                      <Input id="publicName" placeholder="e.g. Ada O. (first name + initial recommended)" value={publicDisplayName} onChange={(e) => setPublicDisplayName(e.target.value)} />
                      <p className="text-xs text-muted-foreground">This name appears on your public campaign. Don&apos;t use your full legal name unless you consent.</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Checkbox id="consent" checked={consentPublic} onCheckedChange={(v) => setConsentPublic(v === true)} />
                      <Label htmlFor="consent" className="cursor-pointer text-sm">
                        I consent to my display name, institution, session, and campaign details being publicly visible.
                      </Label>
                    </div>
                  </div>
                )}
              </div>

              {/* Preview card */}
              {publishNow && consentPublic && (
                <div className="rounded-xl border bg-card p-4">
                  <p className="mb-2 text-xs font-medium text-muted-foreground">Campaign preview</p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-blue/10">
                      <GraduationCap className="h-6 w-6 text-brand-blue" />
                    </div>
                    <div>
                      <p className="font-medium">{publicDisplayName || 'Your name'}</p>
                      <p className="text-xs text-muted-foreground">{institution}</p>
                    </div>
                  </div>
                  {previewSummary && (
                    <div className="mt-3">
                      <ProgressBar value={previewSummary.percentageFunded} showLabel />
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-xs text-muted-foreground">
            <strong className="text-amber-600 dark:text-amber-400">Demo notice:</strong> EduFund is a hackathon prototype.
            All contributions are simulated. No real funds are held or transferred.
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-6 flex items-center justify-between">
        <Button variant="outline" onClick={handlePrev} disabled={step === 1}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        {step < 3 ? (
          <Button onClick={handleNext} className="gradient-bg-blue text-white hover:opacity-90">
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={submitting} className="gradient-bg-blue text-white hover:opacity-90">
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {publishNow ? 'Create & publish' : 'Create as draft'}
          </Button>
        )}
      </div>
    </div>
  );
}
