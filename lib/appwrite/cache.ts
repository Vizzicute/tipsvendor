type CacheEntry = { data: any; timestamp: number };
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 1 day

const cache: Record<string, CacheEntry> = {};

export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  duration: number = CACHE_DURATION
): Promise<T> {
  const now = Date.now();
  const entry = cache[key];

  if (entry && now - entry.timestamp < duration) {
    return entry.data;
  }

  const data = await fetcher();
  cache[key] = { data, timestamp: now };
  return data;
}