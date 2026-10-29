import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '@/lib/auth-context';
import { ThemeProvider } from '@/lib/theme-context';
import { Navbar } from '@/components/navbar';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
  // NEXT_PUBLIC_SITE_URL should be set to the deployed origin (e.g. https://edufund.example).
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'EduFund — Every semester funded, before the deadline',
  description:
    'EduFund helps Nigerian university students and their sponsors plan, save towards, and collectively fund school fees and accommodation before payment deadlines.',
  openGraph: {
    title: 'EduFund — Every semester funded, before the deadline',
    description:
      'Plan, save towards, and collectively fund education before payment deadlines.',
    images: [{ url: '/api/og', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [{ url: '/api/og' }],
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
            <Navbar />
            <main className="min-h-[calc(100vh-4rem)]">{children}</main>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
