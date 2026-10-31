import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '@/lib/auth-context';
import { ThemeProvider } from '@/lib/theme-context';
import { AppShell } from '@/components/app-shell';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://edufund.app'),
  title: {
    default: 'EduFund — Every semester funded, before the deadline',
    template: '%s | EduFund',
  },
  description:
    'EduFund helps Nigerian university students and their sponsors plan, save towards, and collectively fund school fees and campus accommodation before payment deadlines with Cowrywise locked vaults and Remita direct settlements.',
  applicationName: 'EduFund',
  keywords: [
    'Nigerian university tuition',
    'school fees funding',
    'Remita bursary payment',
    'Cowrywise savings',
    'educational crowdfunding',
    'UNILAG tuition',
    'UI fees',
    'OAU hostel',
    'student micro-pledges',
    'tuition deadline',
    'Alumni squads',
  ],
  authors: [{ name: 'EduFund / Cowrywise Ambassadors Innovation 2026' }],
  creator: 'EduFund',
  publisher: 'EduFund',
  category: 'fintech',
  icons: {
    icon: '/icon',
    apple: '/apple-icon',
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#126DE2' },
    { media: '(prefers-color-scheme: dark)', color: '#0F131A' },
  ],
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: '/',
    siteName: 'EduFund',
    title: 'EduFund — Every semester funded, before the deadline',
    description:
      'Plan, save towards, and collectively fund university education before payment deadlines. Direct Remita TSA clearance & Cowrywise vault yield match.',
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: 'EduFund — Verified Nigerian Higher Education Funding Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EduFund — Every semester funded, before the deadline',
    description:
      'Direct Remita TSA settlement, Cowrywise locked vaults, and student pledge circles for Nigerian university scholars.',
    creator: '@cowrywise',
    site: '@cowrywise',
    images: ['/api/og'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Gabarito:wght@500;600;700;800;900&family=Manrope:wght@400;500;600;700;800&family=Azeret+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('edufund-theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;if(t==='dark'||(!t&&d)){document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-screen selection:bg-brand-gold/30">
        <ThemeProvider>
          <AuthProvider>
            <AppShell>{children}</AppShell>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
