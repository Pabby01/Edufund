'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useInView, useReducedMotion, type Variants } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export const EASE_OUT = [0.2, 0.8, 0.2, 1] as const;
export const EASE_SPRING = [0.34, 1.56, 0.64, 1] as const;
export const EASE_INOUT = [0.7, 0, 0.2, 1] as const;

/* --------------------------------------------------------------------------
 * WordReveal — splits a heading into words that rise out of a mask, staggered.
 * Pass an array of lines; wrap a word in *asterisks* to accent it in gold.
 * ------------------------------------------------------------------------ */
export function WordReveal({
  lines,
  className,
  as: Tag = 'h2',
  delay = 0,
  accentClassName = 'text-brand-gold',
}: {
  lines: string[];
  className?: string;
  as?: 'h1' | 'h2' | 'h3';
  delay?: number;
  accentClassName?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, margin: '200px 0px 100px 0px' });
  const reduce = useReducedMotion();
  let wordIndex = 0;

  return (
    <Tag ref={ref} className={className} aria-label={lines.join(' ').replace(/\*/g, '')}>
      {lines.map((line, li) => (
        <span key={li} className="block" aria-hidden>
          {line.split(' ').map((raw, wi) => {
            const accent = raw.startsWith('*') && raw.endsWith('*');
            const word = accent ? raw.slice(1, -1) : raw;
            const i = wordIndex++;
            return (
              <span key={wi} className="inline-block overflow-hidden pb-[0.08em] -mb-[0.08em] align-bottom">
                <motion.span
                  className={cn('inline-block', accent && accentClassName)}
                  initial={reduce ? false : { y: '110%', rotate: 3 }}
                  animate={inView ? { y: '0%', rotate: 0 } : { y: '0%', rotate: 0 }}
                  transition={{ duration: 0.8, ease: EASE_OUT, delay: delay + i * 0.05 }}
                >
                  {word}
                </motion.span>
                {wi < line.split(' ').length - 1 && <span>&nbsp;</span>}
              </span>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}

/* --------------------------------------------------------------------------
 * Reveal — generic fade/rise-in on scroll.
 * ------------------------------------------------------------------------ */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.8, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.div>
  );
}

export const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT } },
};

/* --------------------------------------------------------------------------
 * PillButton — template-style CTA: dot · label · rotating icon cap.
 * ------------------------------------------------------------------------ */
export function PillButton({
  href,
  children,
  variant = 'primary',
  icon: Icon = ArrowUpRight,
  className,
  onClick,
}: {
  href?: string;
  children: React.ReactNode;
  variant?: 'primary' | 'gold' | 'ghost' | 'ink';
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
  onClick?: () => void;
}) {
  const styles: Record<string, { root: string; cap: string }> = {
    primary: {
      root: 'gradient-bg-blue text-white shadow-[0_12px_30px_-12px_hsl(var(--brand-blue)/0.7)]',
      cap: 'bg-white/15 text-white',
    },
    gold: {
      root: 'gradient-bg-gold text-[hsl(220_25%_12%)] shadow-[0_12px_30px_-12px_hsl(var(--brand-gold)/0.7)]',
      cap: 'bg-black/15',
    },
    ghost: {
      root: 'border border-border bg-background/60 text-foreground backdrop-blur hover:bg-muted',
      cap: 'bg-foreground text-background',
    },
    ink: {
      root: 'bg-foreground text-background',
      cap: 'bg-background text-foreground',
    },
  };
  const s = styles[variant];
  const inner = (
    <>
      <span className="pill-dot" />
      <span>{children}</span>
      <span className={cn('pill-cap', s.cap)}>
        <Icon className="h-4 w-4" />
      </span>
    </>
  );
  if (href) {
    return (
      <Link href={href} className={cn('pill-btn', s.root, className)} onClick={onClick}>
        {inner}
      </Link>
    );
  }
  return (
    <button type="button" className={cn('pill-btn', s.root, className)} onClick={onClick}>
      {inner}
    </button>
  );
}

/* --------------------------------------------------------------------------
 * useCountUp — animate a number when it scrolls into view.
 * ------------------------------------------------------------------------ */
export function useCountUp(target: number, duration = 1600) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  useEffect(() => {
    if (!inView || !ref.current) return;
    const el = ref.current;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString('en-NG');
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration]);
  return ref;
}

