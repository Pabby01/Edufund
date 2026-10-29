# EduFund

> Every semester funded, one contribution at a time.

EduFund helps Nigerian university students and their sponsors plan, save towards, and collectively fund school fees and off-campus accommodation before payment deadlines.

Built for the **Cowrywise Ambassadors Innovation Challenge 2026**.

## Quick Start

The app runs automatically — Supabase credentials are pre-configured by Bolt.

1. Sign up at `/auth` to create a student account.
2. Create an education goal at `/goals/new`.
3. Publish the goal to get a shareable campaign link.
4. Share the link (`/fund/[slug]`) with sponsors.
5. Sponsors can contribute (demo) or pledge future support without an account.

## Features

### Student Journey
- Email/password authentication via Supabase Auth
- Multi-step goal creation form with validation
- Dashboard with funding progress, deadlines, and readiness status
- Goal management (edit, publish, archive, delete)
- Accurate NGN savings calculations (integer kobo, no floating-point)
- Pledge management (view, pause, resume, cancel, mark complete)
- Settings: profile, notification preferences, privacy controls

### Sponsor Experience
- Public campaign page at `/fund/[slug]` — no account required
- Transparent progress: target, confirmed contributions, self-saved, gap
- Demo contribution flow with preset and custom amounts
- Pledge system with daily/weekly/monthly frequencies
- Encouragement notes with public display consent
- Share via Web Share API or copy-link fallback
- Pledge projection: shows if pledge covers the gap by deadline

### Admin Dashboard
- Campaign list and status breakdown
- Contribution status (demo vs verified vs pending)
- Active/cancelled pledge overview
- Note moderation (approve/hide pending notes)
- Cowrywise integration health status
- Reminder system status

## Tech Stack
- Next.js 13 with TypeScript
- Tailwind CSS with shadcn/ui components
- Supabase (PostgreSQL, Auth, Row Level Security, Edge Functions)
- Recharts for visualizations
- Lucide icons
- Zod for validation

## Database

Migrations are applied automatically via the Supabase MCP tool. Tables:

| Table | Purpose |
|-------|---------|
| profiles | Student profile data (extends auth.users) |
| education_goals | Funding goals (tuition, accommodation, etc.) |
| contributions | Demo and real contributions |
| pledges | Sponsor commitments (not payments) |
| encouragement_notes | Messages with moderation |
| pledge_schedules | Projected contribution dates |
| reminder_preferences | Per-pledge reminder settings |
| reminder_events | Reminder log for deduplication |
| provider_accounts | Cowrywise account linkage |
| provider_savings_plans | Provider savings plans |
| provider_webhook_events | Webhook idempotency log |
| audit_events | Security audit log |

### Money Handling
All amounts stored as **integer kobo** (1 NGN = 100 kobo). No floating-point arithmetic for financial totals.

### Row Level Security
- Users can read/update only their own profiles
- Students manage only their own goals
- Public visitors read only published campaigns with consent
- Sponsors can create contributions and pledges via public forms
- Users cannot mark their own payments as verified
- Provider tables are service-role only
- Audit events are service-role only

## Admin Access

Admin access is controlled by the `is_admin` flag on the profiles table. To grant admin access:

```sql
UPDATE profiles SET is_admin = true WHERE id = 'USER_UUID';
```

In production, enforce this server-side via JWT role claims (`raw_app_meta_data`).

## Demo vs Real

| Feature | Status |
|---------|--------|
| Authentication | Real (Supabase Auth) |
| Database persistence | Real (Supabase PostgreSQL) |
| Goal CRUD | Real |
| Contributions | Demo (simulated, labelled clearly) |
| Pledges | Real data model (commitments, not payments) |
| Reminders | Demo preview (email delivery not configured) |
| Cowrywise integration | Pending (adapter ready, credentials needed) |

## Demo Script

1. **Student creates account** at `/auth?mode=signup`
2. **Creates a goal** at `/goals/new` — e.g. "Second semester tuition" ₦450,000, deadline in 60 days
3. **Publishes the goal** — gets a shareable link
4. **Sponsor A opens the link**, clicks "Pledge future support" — pledges ₦5,000/month
5. **Sponsor B opens the link**, clicks "Give to this student" — gives ₦20,000 demo contribution
6. **Progress updates immediately** — percentage funded increases, gap decreases
7. **Student sees the change** on their dashboard — funding gap reduced

## Deployment

The app is configured for Netlify deployment:

```bash
npm run build
```

The `netlify.toml` file is pre-configured with the Next.js plugin.

## Cowrywise Integration Guide

See [COWRYWISE_INTEGRATION.md](./COWRYWISE_INTEGRATION.md) for the full setup guide.

## Security

- No service-role keys in frontend code
- RLS enabled on all tables
- No payment-card details collected
- No BVN or sensitive identity data in public forms
- No secrets in NEXT_PUBLIC environment variables
- Webhook signature verification architecture ready

## License

Hackathon prototype — not for production use without proper payment provider integration and security review.
# Edufund
