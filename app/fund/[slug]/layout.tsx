import type { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import { formatNaira, daysUntilDeadline } from '@/lib/finance';

function getServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key',
    {
      auth: {
        persistSession: false,
      },
    }
  );
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = params;
  try {
    const supabase = getServerClient();
    const { data: goal } = await supabase
      .from('education_goals')
      .select('*')
      .eq('public_slug', slug)
      .maybeSingle();

    if (!goal) {
      return {
        title: 'EduFund Student Campaign',
        description: 'Fund Nigerian university tuition and hostels directly and debt-free.',
      };
    }

    const siteOrigin = process.env.NEXT_PUBLIC_SITE_URL || 'https://edufund.app';
    const daysLeft = goal.deadline ? daysUntilDeadline(goal.deadline) : 30;
    const targetFormatted = formatNaira(goal.target_amount_kobo || 0);
    const raisedFormatted = formatNaira(goal.starting_savings_kobo || 0);
    const pct = (goal.target_amount_kobo || 0) > 0
      ? Math.min(100, Math.round(((goal.starting_savings_kobo || 0) / goal.target_amount_kobo) * 100))
      : 0;

    const ogSearchParams = new URLSearchParams({
      title: goal.title || 'Student Tuition Campaign',
      school: goal.institution || 'Nigerian University',
      name: goal.public_display_name || 'Verified Scholar',
      target: targetFormatted,
      raised: raisedFormatted,
      percent: `${pct}%`,
      days: daysLeft > 0 ? `${daysLeft} days left` : 'Deadline today',
      category: goal.category ? goal.category.toUpperCase() : 'TUITION',
    });

    const ogImageUrl = `${siteOrigin}/api/og?${ogSearchParams.toString()}`;

    return {
      title: `${goal.title} — ${goal.public_display_name || 'Student'} on EduFund`,
      description: `Support ${goal.public_display_name || 'this student'} to fund their fees at ${goal.institution || 'university'} before payment deadlines. Direct Remita bursary settlement.`,
      openGraph: {
        title: `${goal.title} — ${goal.public_display_name || 'Student'}`,
        description: `Support this student on EduFund. 100% verified bursary disbursement.`,
        url: `${siteOrigin}/fund/${slug}`,
        siteName: 'EduFund',
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: goal.title,
          },
        ],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${goal.title} — ${goal.public_display_name || 'Student'}`,
        description: `Verified education funding goal on EduFund.`,
        images: [ogImageUrl],
      },
    };
  } catch {
    return {
      title: 'EduFund Student Campaign',
      description: 'Fund Nigerian university tuition and hostels directly and debt-free.',
    };
  }
}

export default function CampaignLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
