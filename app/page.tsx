'use client';

import React from 'react';
import { HeroSection } from '@/components/landing/hero-section';
import { MarqueeRibbon } from '@/components/landing/marquee-ribbon';
import { TracksSection } from '@/components/landing/tracks-section';
import { SpotlightSection } from '@/components/landing/spotlight-section';
import { SemesterStacks } from '@/components/landing/semester-stacks';
import { TimelineSyllabus } from '@/components/landing/timeline-syllabus';
import { ImpactNumbers } from '@/components/landing/impact-numbers';
import { ReceiptWall } from '@/components/landing/receipt-wall';
import { StudioStory } from '@/components/landing/studio-story';
import { FreeGuide } from '@/components/landing/free-guide';
import { FAQSection } from '@/components/landing/faq-section';
import { CTABanner } from '@/components/landing/cta-banner';
import { Footer } from '@/components/footer';

export default function LandingPage() {
  return (
    <div className="flex flex-col bg-background text-foreground selection:bg-brand-gold/30">
      {/* Hero Section with 3D Goal Perspective and Perforated Receipt */}
      <HeroSection />

      {/* Marquee Ribbon Ticker */}
      <MarqueeRibbon />

      {/* Four Funding Tracks Section (Replaces Aisles) */}
      <TracksSection />

      {/* Featured Student Campaign Spotlight */}
      <SpotlightSection />

      {/* Sticky Overlapping Semester Stacks Scroll */}
      <SemesterStacks />

      {/* Student Roadmap & Milestone Syllabus */}
      <TimelineSyllabus />

      {/* Impact in Numbers & Weekly Analytics */}
      <ImpactNumbers />

      {/* Wall of Verified Receipts & Testimonials */}
      <ReceiptWall />

      {/* Behind EduFund & The Mission */}
      <StudioStory />

      {/* Free Sponsorship Playbook Download */}
      <FreeGuide />

      {/* Frequently Asked Questions */}
      <FAQSection />

      {/* Closing Call to Action Banner */}
      <CTABanner />

      {/* Footer */}
      <Footer />
    </div>
  );
}
