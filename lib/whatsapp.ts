/**
 * WhatsApp Helper Utilities for Nigerian University Collective Funding.
 * Generates rich pre-formatted messages for one-click WhatsApp sharing,
 * sponsor progress updates, and automated pledge reminders.
 */

import { formatNaira } from './finance';

export interface CampaignShareProps {
  title: string;
  studentName?: string;
  institution?: string | null;
  targetKobo: number;
  raisedKobo: number;
  daysRemaining: number;
  url: string;
}

export function generateWhatsAppCampaignText({
  title,
  studentName,
  institution,
  targetKobo,
  raisedKobo,
  daysRemaining,
  url,
}: CampaignShareProps): string {
  const percent = Math.min(100, Math.round((raisedKobo / (targetKobo || 1)) * 100));
  const remainingKobo = Math.max(0, targetKobo - raisedKobo);

  const urgencyText =
    daysRemaining <= 0
      ? '⚠️ *DEADLINE PASSED — URGENT PORTAL CLOSURE*'
      : daysRemaining <= 7
      ? `🚨 *URGENT: ONLY ${daysRemaining} DAYS BEFORE PORTAL CLOSES!*`
      : `⏳ *${daysRemaining} days until bursary payment deadline*`;

  return (
    `🎓 *SUPPORT NIGERIAN STUDENT TUITION ON EDUFUND*\n\n` +
    `Hello friends & alumni! Please support *${studentName || 'this student'}* to fund their semester fees and avoid deregistration.\n\n` +
    `📖 *Campaign:* ${title}\n` +
    `🏛️ *Institution:* ${institution || 'Federal University'}\n` +
    `🎯 *Target Goal:* ${formatNaira(targetKobo)}\n` +
    `💰 *Raised So Far:* ${formatNaira(raisedKobo)} (${percent}% funded)\n` +
    `📉 *Remaining Gap:* ${formatNaira(remainingKobo)}\n` +
    `${urgencyText}\n\n` +
    `🔒 *100% Direct Bursary Settlement via Remita*\n` +
    `Zero cash to personal accounts. Monies are locked in Cowrywise until official university portal payment.\n\n` +
    `👉 *Pledge or contribute here:* \n${url}`
  );
}

export function openWhatsAppShare(props: CampaignShareProps) {
  const text = encodeURIComponent(generateWhatsAppCampaignText(props));
  window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
}

export interface PledgeReminderProps {
  sponsorName: string;
  studentName: string;
  goalTitle: string;
  institution?: string | null;
  amountKobo: number;
  frequency: string;
  daysRemaining: number;
  url: string;
}

export function generateWhatsAppPledgeReminderText({
  sponsorName,
  studentName,
  goalTitle,
  institution,
  amountKobo,
  frequency,
  daysRemaining,
  url,
}: PledgeReminderProps): string {
  return (
    `👋 *Hello ${sponsorName}!*\n\n` +
    `Friendly reminder from *EduFund* regarding your *${frequency} pledge of ${formatNaira(amountKobo)}* for *${studentName}* (${goalTitle}) at ${institution || 'the university'}.\n\n` +
    `⏳ The semester portal deadline is in *${daysRemaining} days*.\n\n` +
    `Your contribution will be locked in the student's Cowrywise vault and disbursed directly to the school bursary via Remita.\n\n` +
    `👉 *Fulfill your pledge here with one click:* \n${url}\n\n` +
    `Thank you for keeping an indigent Nigerian student in school! 🎓`
  );
}

export function openWhatsAppPledgeReminder(props: PledgeReminderProps) {
  const text = encodeURIComponent(generateWhatsAppPledgeReminderText(props));
  window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
}

