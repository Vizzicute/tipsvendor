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
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    const data = await response.json();
    
    const rates: ExchangeRate[] = [
      { currency: 'NGN', rate: data.rates.NGN, lastUpdated: new Date().toISOString() },
      { currency: 'GHS', rate: data.rates.GHS, lastUpdated: new Date().toISOString() },
      { currency: 'KES', rate: data.rates.KES, lastUpdated: new Date().toISOString() },
      { currency: 'XAF', rate: data.rates.XAF, lastUpdated: new Date().toISOString() },
      { currency: 'ZAR', rate: data.rates.ZAR, lastUpdated: new Date().toISOString() },
      { currency: 'UGX', rate: data.rates.UGX, lastUpdated: new Date().toISOString() },
    ];
    
    // Update cache
    exchangeRatesCache = rates;
    lastFetchTime = now;
    
    return rates;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    toast.error('Failed to fetch exchange rates');
    return exchangeRatesCache; // Return cached rates if available
  }
}

export function getExchangeRate(currency: string): number {
  const rate = exchangeRatesCache.find(r => r.currency === currency);
  return rate?.rate || 1;
}

export function calculateSubscriptionPrice(
  basePrice: number,
  subscriptionType: string,
  duration: string,
  country: string
): number {
  // Plan ratio
  let planRatio = 1;
  switch (subscriptionType) {
    case "investment": planRatio = 1; break;
    case "vip": planRatio = 1.6; break;
    case "mega": planRatio = 2; break;
    case "investment+vip": planRatio = 2.6; break;
    case "investment+mega": planRatio = 3; break;
    case "vip+mega": planRatio = 3.6; break;
    case "all": planRatio = 4.6; break;
    default: planRatio = 1;
  }

  // Duration ratio
  let durationRatio = 1;
  switch (duration) {
    case "10": durationRatio = 1; break;
    case "20": durationRatio = 1.8; break;
    case "30": durationRatio = 2.55; break;
    default: durationRatio = 1;
  }

  // Calculate base price with ratios
  const priceWithRatios = basePrice * planRatio * durationRatio;

  // Convert to local currency if needed
  if (country && country !== 'USD') {
    const exchangeRate = getExchangeRate(country);
    return priceWithRatios * exchangeRate;
  }

  return priceWithRatios;
}

export function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
} 