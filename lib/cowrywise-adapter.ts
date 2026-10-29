/**
 * Cowrywise Provider Adapter
 *
 * This module provides a server-side adapter for the Cowrywise Embed API.
 * It is designed to work with the sandbox environment.
 *
 * IMPORTANT: This adapter implements the architecture for integration but
 * does NOT make real API calls until credentials are configured. When
 * credentials are unavailable, it returns an honest "pending" status.
 *
 * No fake API responses are ever returned as real provider results.
 *
 * Required environment variables (server-side only, NEVER NEXT_PUBLIC):
 * - COWRYWISE_API_KEY: Sandbox API key
 * - COWRYWISE_API_SECRET: Sandbox API secret
 * - COWRYWISE_WEBHOOK_SECRET: Webhook signature verification secret
 *
 * Setup steps:
 * 1. Register at https://developers.cowrywise.com/
 * 2. Create a sandbox application
 * 3. Obtain API credentials
 * 4. Add credentials to Supabase Edge Function secrets
 * 5. Set COWRYWISE_API_KEY, COWRYWISE_API_SECRET, COWRYWISE_WEBHOOK_SECRET
 *
 * Official documentation: https://developers.cowrywise.com/
 */

export type ProviderStatus = 'available' | 'pending' | 'error';

export interface ProviderHealth {
  status: ProviderStatus;
  message: string;
  configured: boolean;
  sandboxUrl: string | null;
}

export interface ProviderAccountResult {
  success: boolean;
  externalAccountId?: string;
  verificationStatus?: string;
  error?: string;
  pending: boolean;
}

export interface ProviderProduct {
  code: string;
  name: string;
  type: string;
  minLockDays?: number;
  minAmountKobo?: number;
}

export interface ProviderProductsResult {
  success: boolean;
  products?: ProviderProduct[];
  error?: string;
  pending: boolean;
}

/**
 * Check if Cowrywise credentials are configured.
 * This runs server-side only.
 */
export function getProviderHealth(): ProviderHealth {
  const apiKey = process.env.COWRYWISE_API_KEY;
  const apiSecret = process.env.COWRYWISE_API_SECRET;

  if (!apiKey || !apiSecret) {
    return {
      status: 'pending',
      message: 'Cowrywise integration pending access. Credentials not configured.',
      configured: false,
      sandboxUrl: null,
    };
  }

  return {
    status: 'available',
    message: 'Cowrywise sandbox credentials detected.',
    configured: true,
    sandboxUrl: 'https://sandbox-api.cowrywise.com',
  };
}

/**
 * Create a Cowrywise investment account for an eligible user.
 *
 * Prerequisites (per documentation):
 * - Valid API credentials
 * - User consent
 * - Required user information submitted server-side
 *
 * If credentials are unavailable, returns an honest pending state.
 */
export async function createProviderAccount(params: {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
}): Promise<ProviderAccountResult> {
  const health = getProviderHealth();

  if (!health.configured) {
    return {
      success: false,
      pending: true,
      error: 'Cowrywise integration is pending access. No credentials configured.',
    };
  }

  // When credentials are available, this would make the actual API call.
  // The exact endpoint, payload, and authentication method must be verified
  // against the current official documentation at https://developers.cowrywise.com/
  // before implementing the real call.
  //
  // Example architecture (NOT executed without verified documentation):
  // const response = await fetch(`${health.sandboxUrl}/accounts`, {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Bearer ${await getAuthToken()}`,
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({ ... }),
  // });

  return {
    success: false,
    pending: true,
    error: 'API call implementation requires verified documentation review.',
  };
}

/**
 * List supported savings/investment products.
 *
 * Product terms must be checked against the student's payment deadline.
 * Some products have minimum lock durations that may not fit every deadline.
 */
export async function listProducts(): Promise<ProviderProductsResult> {
  const health = getProviderHealth();

  if (!health.configured) {
    return {
      success: false,
      pending: true,
      error: 'Cowrywise integration is pending access.',
    };
  }

  // Real implementation would fetch from the products endpoint.
  // Must verify endpoint and response schema from documentation.

  return {
    success: false,
    pending: true,
    error: 'Product listing requires verified documentation review.',
  };
}

/**
 * Verify webhook signature for authenticity.
 *
 * @param signature - The signature header from the webhook request
 * @param payload - The raw request body
 * @returns Whether the signature is valid
 */
export function verifyWebhookSignature(signature: string, payload: string): boolean {
  const secret = process.env.COWRYWISE_WEBHOOK_SECRET;

  if (!secret) {
    // Without a secret, we cannot verify — reject by default
    return false;
  }

  // Webhook signature verification method must be verified from
  // the official documentation. Different providers use HMAC-SHA256,
  // raw secret comparison, or other methods.
  //
  // DO NOT implement signature verification without confirming the
  // exact method from the documentation.
  return false;
}

/**
 * Check if a savings product is suitable for a given deadline.
 *
 * IMPORTANT: Not every tuition deadline can be matched to a locked
 * savings product. Products with minimum lock durations must be
 * checked against the student's payment deadline.
 */
export function isProductSuitableForDeadline(product: ProviderProduct, deadlineDays: number): boolean {
  if (product.minLockDays && deadlineDays < product.minLockDays) {
    return false;
  }
  return true;
}
