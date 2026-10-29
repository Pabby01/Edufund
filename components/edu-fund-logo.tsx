import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  showWordmark?: boolean;
  size?: number;
}

export function EduFundLogo({ className, showWordmark = true, size = 32 }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <defs>
          <linearGradient id="ef-grad-blue" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1e6fd9" />
            <stop offset="1" stopColor="#0a4fa3" />
          </linearGradient>
          <linearGradient id="ef-grad-gold" x1="10" y1="6" x2="30" y2="34" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f4c95d" />
            <stop offset="1" stopColor="#d4a017" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="40" height="40" rx="10" fill="url(#ef-grad-blue)" />
        <path
          d="M12 14c4-3 12-3 16 0"
          stroke="url(#ef-grad-gold)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="20" cy="22" r="6.5" fill="url(#ef-grad-gold)" />
        <path
          d="M20 18.5v7M16.5 22h7"
          stroke="#0a4fa3"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M14 28c3 2 9 2 12 0"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.8"
        />
      </svg>
      {showWordmark && (
        <span className="font-bold text-lg tracking-tight">
          <span className="text-[hsl(var(--brand-blue))]">Edu</span>
          <span className="text-[hsl(var(--brand-gold))]">Fund</span>
        </span>
      )}
    </div>
  );
}
