import { PledgeFrequency, PledgeStatus } from './types';

export const KOBOS_PER_NAIRA = 100;

export function koboToNaira(kobo: number): number {
  return kobo / KOBOS_PER_NAIRA;
}

export function nairaToKobo(naira: number): number {
  return Math.round(naira * KOBOS_PER_NAIRA);
}

export function formatNaira(kobo: number): string {
  const naira = koboToNaira(kobo);
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(naira);
}

export function formatNairaPlain(naira: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(naira);
}

export function formatNairaShort(kobo: number): string {
  const naira = koboToNaira(kobo);
  if (naira >= 1_000_000) {
    return `₦${(naira / 1_000_000).toFixed(1)}M`;
  }
  if (naira >= 1_000) {
    return `₦${(naira / 1_000).toFixed(0)}K`;
  }
  return `₦${naira.toFixed(0)}`;
}

export function daysUntilDeadline(deadline: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dl = new Date(deadline);
  dl.setHours(0, 0, 0, 0);
  const diff = dl.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export interface FundingSummary {
  targetKobo: number;
  startingSavingsKobo: number;
  confirmedContributionsKobo: number;
  pledgedProjectedKobo: number;
  totalRaisedKobo: number;
  remainingGapKobo: number;
  percentageFunded: number;
  daysRemaining: number;
  requiredDailyKobo: number;
  requiredWeeklyKobo: number;
  requiredMonthlyKobo: number;
  readiness: 'on_track' | 'at_risk' | 'funding_gap' | 'overfunded' | 'completed';
}

export function computeFundingSummary(params: {
  targetKobo: number;
  startingSavingsKobo: number;
  confirmedContributionsKobo: number;
  pledgedProjectedKobo: number;
  deadline: string;
}): FundingSummary {
  const {
    targetKobo,
    startingSavingsKobo,
    confirmedContributionsKobo,
    pledgedProjectedKobo,
  } = params;

  const totalRaisedKobo = startingSavingsKobo + confirmedContributionsKobo;
  const remainingGapKobo = Math.max(0, targetKobo - totalRaisedKobo);
  const percentageFunded = targetKobo > 0 ? Math.min(100, (totalRaisedKobo / targetKobo) * 100) : 0;
  const daysRemaining = daysUntilDeadline(params.deadline);

  const safeDays = Math.max(1, daysRemaining);
  const requiredDailyKobo = Math.ceil(remainingGapKobo / safeDays);
  const requiredWeeklyKobo = Math.ceil(remainingGapKobo / Math.ceil(safeDays / 7));
  const requiredMonthlyKobo = Math.ceil(remainingGapKobo / Math.ceil(safeDays / 30));

  let readiness: FundingSummary['readiness'];
  if (totalRaisedKobo >= targetKobo) {
    readiness = 'completed';
  } else if (daysRemaining <= 0) {
    readiness = 'funding_gap';
  } else if (totalRaisedKobo + pledgedProjectedKobo >= targetKobo) {
    readiness = 'on_track';
  } else if (percentageFunded >= 50) {
    readiness = 'at_risk';
  } else {
    readiness = 'funding_gap';
  }

  return {
    targetKobo,
    startingSavingsKobo,
    confirmedContributionsKobo,
    pledgedProjectedKobo,
    totalRaisedKobo,
    remainingGapKobo,
    percentageFunded,
    daysRemaining,
    requiredDailyKobo,
    requiredWeeklyKobo,
    requiredMonthlyKobo,
    readiness,
  };
}

const FREQ_DAYS: Record<PledgeFrequency, number> = {
  daily: 1,
  weekly: 7,
  monthly: 30,
};

export function projectPledgeAmount(params: {
  amountPerKobo: number;
  frequency: PledgeFrequency;
  firstDate: string;
  endDate: string | null;
  deadline: string;
  status: PledgeStatus;
}): { projectedAmountKobo: number; projectedCount: number; scheduledDates: Date[] } {
  const { amountPerKobo, frequency, firstDate, endDate, deadline, status } = params;

  if (status === 'cancelled' || status === 'completed') {
    return { projectedAmountKobo: 0, projectedCount: 0, scheduledDates: [] };
  }

  const start = new Date(firstDate);
  start.setHours(0, 0, 0, 0);
  const dl = new Date(deadline);
  dl.setHours(0, 0, 0, 0);
  const end = endDate ? new Date(endDate) : dl;
  end.setHours(0, 0, 0, 0);

  const effectiveEnd = end < dl ? end : dl;
  if (start > effectiveEnd) {
    return { projectedAmountKobo: 0, projectedCount: 0, scheduledDates: [] };
  }

  const stepDays = FREQ_DAYS[frequency];
  const scheduledDates: Date[] = [];
  const current = new Date(start);

  while (current <= effectiveEnd) {
    scheduledDates.push(new Date(current));
    current.setDate(current.getDate() + stepDays);
  }

  const projectedCount = scheduledDates.length;
  const projectedAmountKobo = amountPerKobo * projectedCount;

  return { projectedAmountKobo, projectedCount, scheduledDates };
}

export function generateSlug(length: number = 8): string {
  const chars = 'abcdefghijkmnpqrstuvwxyz23456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
}

export function readinessLabel(readiness: FundingSummary['readiness']): string {
  switch (readiness) {
    case 'on_track': return 'On track';
    case 'at_risk': return 'At risk';
    case 'funding_gap': return 'Funding gap';
    case 'overfunded': return 'Surplus';
    case 'completed': return 'Fully funded';
  }
}

export function readinessColor(readiness: FundingSummary['readiness']): string {
  switch (readiness) {
    case 'on_track': return 'text-emerald-600 dark:text-emerald-400';
    case 'at_risk': return 'text-amber-600 dark:text-amber-400';
    case 'funding_gap': return 'text-red-600 dark:text-red-400';
    case 'overfunded': return 'text-blue-600 dark:text-blue-400';
    case 'completed': return 'text-emerald-600 dark:text-emerald-400';
  }
}
