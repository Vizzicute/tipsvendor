import { toast } from "sonner";

export interface ExchangeRate {
  currency: string;
  rate: number;
  lastUpdated: string;
}

const CACHE_DURATION = 3600000; // 1 hour in milliseconds
let exchangeRatesCache: ExchangeRate[] = [];
let lastFetchTime: number = 0;

export async function fetchExchangeRates(): Promise<ExchangeRate[]> {
  const now = Date.now();

  // Return cached rates if they're still valid
  if (exchangeRatesCache.length > 0 && now - lastFetchTime < CACHE_DURATION) {
    return exchangeRatesCache;
  }

  try {
    const response = await fetch(
      "https://api.exchangerate-api.com/v4/latest/NGN"
    );
    const data = await response.json();

    const rates: ExchangeRate[] = [
      {
        currency: "USD",
        rate: data.rates.USD,
        lastUpdated: new Date().toISOString(),
      },
      {
        currency: "GHS",
        rate: data.rates.GHS,
        lastUpdated: new Date().toISOString(),
      },
      {
        currency: "KES",
        rate: data.rates.KES,
        lastUpdated: new Date().toISOString(),
      },
      {
        currency: "XAF",
        rate: data.rates.XAF,
        lastUpdated: new Date().toISOString(),
      },
      {
        currency: "ZAR",
        rate: data.rates.ZAR,
        lastUpdated: new Date().toISOString(),
      },
      {
        currency: "UGX",
        rate: data.rates.UGX,
        lastUpdated: new Date().toISOString(),
      },
    ];

    // Update cache
    exchangeRatesCache = rates;
    lastFetchTime = now;

    return rates;
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
    toast.error("Failed to fetch exchange rates");
    return exchangeRatesCache; // Return cached rates if available
  }
}

export function getNGNExchangeRate(currency: string): number {
  const rate = exchangeRatesCache.find(r => r.currency === currency);
  return rate?.rate || 1;
}