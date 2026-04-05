import useSWR, { SWRConfiguration } from 'swr';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    throw error;
  }
  return res.json();
};

/**
 * useSwarmSWR: High-Velocity Data Sync Protocol (God Mode Architect Edit)
 * Bridged completely to Vercel's battle-tested 'swr' library.
 */
export function useSwarmSWR<T = unknown>(url: string | null, config?: SWRConfiguration) {
  const { data, error, mutate, isLoading, isValidating } = useSWR<T>(url, fetcher, config);

  return {
    data,
    isLoading,
    error,
    mutate,
    revalidate: mutate,
    isValidating
  };
}
