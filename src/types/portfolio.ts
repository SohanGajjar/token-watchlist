export interface TokenWatchItem {
  id: string;
  symbol: string;
  name: string;
  image: string;
  price: number;
  priceChange24hPct: number;
  sparkline7d: number[];
  holdings: number;
  value: number;
}

export interface PortfolioState {
  tokens: TokenWatchItem[];
  lastUpdated: string | null;
  loading: boolean;
  error: string | null;
}

export interface UIState {
  addTokenModalOpen: boolean;
  editingTokenId: string | null;
}
