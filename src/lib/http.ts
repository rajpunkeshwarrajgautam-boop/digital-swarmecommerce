type RetryableFetchOptions = RequestInit & {
  timeoutMs?: number;
  retries?: number;
  retryDelayMs?: number;
};

const RETRYABLE_STATUS_CODES = new Set([408, 425, 429, 500, 502, 503, 504]);

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchWithRetry(
  input: string | URL,
  {
    timeoutMs = 8000,
    retries = 2,
    retryDelayMs = 500,
    ...init
  }: RetryableFetchOptions = {}
) {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(input, {
        ...init,
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!RETRYABLE_STATUS_CODES.has(response.status) || attempt === retries) {
        return response;
      }
    } catch (error) {
      clearTimeout(timeout);

      const err =
        error instanceof Error ? error : new Error('Unknown network failure');
      lastError = err;

      if (attempt === retries) {
        throw err;
      }
    }

    await sleep(retryDelayMs * (attempt + 1));
  }

  throw lastError ?? new Error('Retryable request failed');
}
