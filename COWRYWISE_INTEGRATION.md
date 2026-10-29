# Cowrywise Embed API Integration Guide

## Status: Pending Access

The Cowrywise integration adapter is implemented but **credentials are not configured**. The app shows an honest "Cowrywise integration pending access" state throughout. No fake API responses are presented as real provider results.

## Architecture

The integration uses a **server-side provider adapter** (`lib/cowrywise-adapter.ts`) and a **Supabase Edge Function** (`supabase/functions/cowrywise-status/index.ts`) for health checks. All API calls use server-side secrets only — no credentials are ever exposed to the browser.

## Implemented Flows

| Flow | Status | Notes |
|------|--------|-------|
| Provider health check | Implemented | Edge function deployed |
| Account creation architecture | Implemented | Awaits credentials + documentation verification |
| Identity verification (KYC) | Architecture only | Must verify supported flow from docs |
| Product listing | Architecture only | Must verify endpoint from docs |
| Savings plan creation | Architecture only | Requires account + product + consent |
| Balance retrieval | Architecture only | Must verify endpoint from docs |
| Webhook verification | Architecture only | Signature method must be verified |
| Idempotency handling | Schema ready | `provider_webhook_events` table |

## Setup Steps

1. **Register** at [https://developers.cowrywise.com/](https://developers.cowrywise.com/)
2. **Create a sandbox application**
3. **Obtain credentials:**
   - API Key
   - API Secret
   - Webhook Secret
4. **Add credentials** as Supabase Edge Function secrets (via Supabase dashboard or CLI):
   - `COWRYWISE_API_KEY`
   - `COWRYWISE_API_SECRET`
   - `COWRYWISE_WEBHOOK_SECRET`
5. **Verify the sandbox base URL** from the official documentation
6. **Review each endpoint** before implementing the real API call:
   - Authentication method (Bearer token, API key header, etc.)
   - Required payload fields
   - Response schema
   - Error codes
   - Rate limits
7. **Test with sandbox values** only — never use production credentials in development

## Important Constraints

- **Do NOT assume every tuition deadline matches a locked savings product.** Some Cowrywise products have minimum lock durations. Product terms must be checked against the student's payment deadline using `isProductSuitableForDeadline()`.
- **Do NOT invest money automatically.** Investment requires:
  - A supported product
  - Explicit user consent
  - User eligibility
  - Required provider account verification
- **Do NOT claim KYC verification** until the provider confirms it. Verification is asynchronous.
- **Do NOT store raw BVN** in application tables, logs, or error reports.
- **Keep external account IDs separate** from internal user IDs.

## What NOT to Do

- Do not put Cowrywise credentials in `NEXT_PUBLIC_` environment variables
- Do not invent endpoints, response schemas, or API capabilities
- Do not fabricate KYC success, investment balances, or financial returns
- Do not imply an official partnership that does not exist
- Do not bypass webhook signature verification

## Webhook Handling

When credentials are configured:

1. Create a Supabase Edge Function to receive webhooks (`verify_jwt = false` for webhooks)
2. Verify the webhook signature using `COWRYWISE_WEBHOOK_SECRET`
3. Log the event in `provider_webhook_events` for idempotency
4. Process the event and update relevant tables
5. Return 200 OK only after successful processing

## Testing Provider Errors

The adapter includes error handling for:
- Missing credentials → returns `pending` status
- API errors → caught and returned with error message
- Invalid responses → validated before use
- Webhook verification failure → rejected by default

## Reference

- Official documentation: [https://developers.cowrywise.com/](https://developers.cowrywise.com/)
- Sandbox base URL (to verify): `https://sandbox-api.cowrywise.com`
