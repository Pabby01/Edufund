/**
 * Rate Limiter and Cooldown Utilities
 * Prevents spamming and double submissions on public campaign endpoints.
 */

const STORAGE_PREFIX = 'edufund_rate_limit_';

export function checkClientRateLimit(action: string, windowSeconds = 15): { allowed: boolean; remainingSeconds: number } {
  if (typeof window === 'undefined') {
    return { allowed: true, remainingSeconds: 0 };
  }

  const key = `${STORAGE_PREFIX}${action}`;
  const now = Date.now();
  const lastTimeStr = localStorage.getItem(key);

  if (!lastTimeStr) {
    localStorage.setItem(key, String(now));
    return { allowed: true, remainingSeconds: 0 };
  }

  const lastTime = parseInt(lastTimeStr, 10);
  const elapsedSeconds = Math.floor((now - lastTime) / 1000);

  if (elapsedSeconds < windowSeconds) {
    return {
      allowed: false,
      remainingSeconds: windowSeconds - elapsedSeconds,
    };
  }

  localStorage.setItem(key, String(now));
  return { allowed: true, remainingSeconds: 0 };
}

