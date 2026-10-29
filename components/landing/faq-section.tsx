'use client';

import React, { useState } from 'react';
import { WordReveal } from './primitives';
import { ChevronDown } from 'lucide-react';

interface FAQ {
  q: string;
  a: string;
}

const faqs: FAQ[] = [
  {
    q: 'How do funds reach my university or campus landlord?',
    a: 'When an education goal reaches 100% funding, the student uploads their verified Remita Retrieval Reference (RRR) or official departmental payment invoice. Funds are verified and disbursed directly to settle school portal bills with zero cash diversion.',
  },
  {
    q: 'How do sponsor pledges work?',
    a: 'A pledge is a commitment from an alumni, mentor, or family member to contribute a set amount on a daily, weekly, or monthly schedule. Automated reminders notify sponsors before their committed dates, projecting the student gap to zero before penalty deadlines.',
  },
  {
    q: 'Does EduFund take a cut from student tuition?',
    a: 'No. EduFund is built for student empowerment. 100% of every contributed kobo goes directly toward the verified educational invoice.',
  },
  {
    q: 'How does the Cowrywise integration protect my money?',
    a: 'Funds saved by the student are linked to Cowrywise target savings products with locked withdrawal parameters aligned with university portal closure dates. This prevents impulsive withdrawals while earning daily interest that offsets the remaining gap.',
  },
  {
    q: 'Can sponsors contribute from outside Nigeria (Diaspora)?',
    a: 'Yes. The platform architecture integrates international card checkout via Paystack and Flutterwave, allowing relatives and alumni associations abroad to sponsor students using their local or foreign cards.',
  },
  {
    q: 'Can a student create separate goals for tuition and accommodation?',
    a: 'Yes. Students can manage distinct goals under different tracks (Tuition, Hostels, STEM Materials, Final Project) with individual deadlines and customized sharing links.',
  },
];

export function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (i: number) => {
    setOpenIdx(openIdx === i ? null : i);
  };

  return (
    <section className="relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8 border-b border-border/40">
      <div className="relative mx-auto max-w-4xl space-y-12">
        <div className="space-y-3">
          <div className="eyebrow">
            FREQUENTLY ASKED QUESTIONS
          </div>
          <WordReveal
            lines={[
              'Questions at',
              'the campus desk.',
            ]}
            className="display-md text-neutral-950 dark:text-white"
          />
          <p className="text-base text-muted-foreground">
            Clear answers on portal deadlines, sponsor pledges, and verified disbursements.
          </p>
        </div>

        {/* Accordion list */}
        <div className="divide-y divide-border/60 border-y border-border/60">
          {faqs.map((faq, i) => {
            const isOpen = openIdx === i;

            return (
              <div key={i} className="py-5">
                <button
                  onClick={() => toggle(i)}
                  className="flex w-full items-center justify-between text-left font-bold text-base sm:text-lg text-neutral-900 dark:text-white transition-colors hover:text-brand-blue"
                >
                  <span className="flex items-center gap-3">
                    <span className="font-mono text-xs text-brand-gold">Q{i + 1}</span>
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 transition-transform duration-300 text-muted-foreground ${
                      isOpen ? 'rotate-180 text-brand-gold' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="mt-3 pl-8 text-sm text-muted-foreground leading-relaxed animate-fade-up">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

