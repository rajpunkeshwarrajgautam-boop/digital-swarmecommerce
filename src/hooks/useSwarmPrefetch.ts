import { preload } from 'swr';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('An error occurred while fetching the data.');
  return res.json();
};

/**
 * useSwarmPrefetch: Pre-warming mechanism for high-velocity transitions
 */
export function useSwarmPrefetch() {
  const prefetch = (url: string) => {
    // Utilize SWR native preloading
    preload(url, fetcher);
  };

  return { prefetch };
}
