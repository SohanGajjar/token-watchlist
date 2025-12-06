const BASE_URL = 'https://api.coingecko.com/api/v3';

export interface CoinMarketData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  sparkline_in_7d?: {
    price: number[];
  };
}

export interface SearchResult {
  id: string;
  symbol: string;
  name: string;
  thumb: string;
  large?: string;
}

export interface TrendingCoin {
  item: {
    id: string;
    coin_id: number;
    name: string;
    symbol: string;
    thumb: string;
    large: string;
  };
}

/**
 * Fetch market data for specific tokens (used for watchlist price updates)
 * API: /coins/markets
 */
export async function fetchMarketTokens(ids: string[]): Promise<CoinMarketData[]> {
  if (ids.length === 0) return [];
  
  const idsParam = ids.join(',');
  const response = await fetch(
    `${BASE_URL}/coins/markets?vs_currency=usd&ids=${idsParam}&order=market_cap_desc&sparkline=true&price_change_percentage=24h`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch market data');
  }
  
  return response.json();
}
/**
 * Fetch trending tokens (used for Add Token modal when no search query)
 * API: /search/trending
 */
export async function fetchTrendingTokens(): Promise<SearchResult[]> {
  const response = await fetch(`${BASE_URL}/search/trending`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch trending tokens');
  }
  
  const data = await response.json();
  return (data.coins || []).map((coin: TrendingCoin) => ({
    id: coin.item.id,
    symbol: coin.item.symbol,
    name: coin.item.name,
    thumb: coin.item.thumb,
    large: coin.item.large,
  }));
}

/**
 * Search for coins by query (used for Add Token modal search)
 * API: /search
 * Returns all coins matching the search query
 */
export async function searchCoins(query: string, signal?: AbortSignal): Promise<SearchResult[]> {
  if (!query.trim()) return [];
  
  const response = await fetch(
    `${BASE_URL}/search?query=${encodeURIComponent(query.trim())}`,
    { signal }
  );
  
  if (!response.ok) {
    throw new Error('Failed to search coins');
  }
  
  const data = await response.json();
  return (data.coins || []).map((coin: { id: string; symbol: string; name: string; thumb: string; large?: string }) => ({
    id: coin.id,
    symbol: coin.symbol,
    name: coin.name,
    thumb: coin.thumb,
    large: coin.large,
  }));
}
