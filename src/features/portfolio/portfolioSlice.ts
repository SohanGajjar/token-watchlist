import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchMarketTokens, CoinMarketData } from '../../lib/coingecko';
import { TokenWatchItem, PortfolioState } from '../../types/portfolio';

// Initial state - preloaded state will be handled by store/index.ts
const initialState: PortfolioState = {
  tokens: [],
  lastUpdated: null,
  loading: false,
  error: null,
};

// Async thunk to refresh token prices
export const refreshTokenPrices = createAsyncThunk(
  'portfolio/refreshPrices',
  async (_, { getState }) => {
    const state = getState() as { portfolio: PortfolioState };
    const tokenIds = state.portfolio.tokens.map((t) => t.id);
    
    if (tokenIds.length === 0) {
      return [];
    }
    
    const marketData = await fetchMarketTokens(tokenIds);
    return marketData;
  }
);

// Async thunk to add tokens and fetch their data
export const addTokensToWatchlist = createAsyncThunk(
  'portfolio/addTokens',
  async (tokens: { id: string; symbol: string; name: string; image: string }[]) => {
    const tokenIds = tokens.map((t) => t.id);
    const marketData = await fetchMarketTokens(tokenIds);
    
    return tokens.map((token) => {
      const market = marketData.find((m) => m.id === token.id);
      return {
        id: token.id,
        symbol: token.symbol.toUpperCase(),
        name: token.name,
        image: token.image || market?.image || '',
        price: market?.current_price || 0,
        priceChange24hPct: market?.price_change_percentage_24h || 0,
        sparkline7d: market?.sparkline_in_7d?.price || [],
        holdings: 0,
        value: 0,
      };
    });
  }
);

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    updateHoldings: (
      state,
      action: PayloadAction<{ tokenId: string; holdings: number }>
    ) => {
      const token = state.tokens.find((t) => t.id === action.payload.tokenId);
      if (token) {
        token.holdings = action.payload.holdings;
        token.value = token.holdings * token.price;
      }
    },
    removeToken: (state, action: PayloadAction<string>) => {
      state.tokens = state.tokens.filter((t) => t.id !== action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Refresh prices
      .addCase(refreshTokenPrices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshTokenPrices.fulfilled, (state, action) => {
        state.loading = false;
        state.lastUpdated = new Date().toISOString();
        
        action.payload.forEach((market: CoinMarketData) => {
          const token = state.tokens.find((t) => t.id === market.id);
          if (token) {
            token.price = market.current_price;
            token.priceChange24hPct = market.price_change_percentage_24h;
            token.sparkline7d = market.sparkline_in_7d?.price || token.sparkline7d;
            token.value = token.holdings * token.price;
          }
        });
      })
      .addCase(refreshTokenPrices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to refresh prices';
      })
      // Add tokens
      .addCase(addTokensToWatchlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTokensToWatchlist.fulfilled, (state, action) => {
        state.loading = false;
        state.lastUpdated = new Date().toISOString();
        
        action.payload.forEach((newToken: TokenWatchItem) => {
          if (!state.tokens.find((t) => t.id === newToken.id)) {
            state.tokens.push(newToken);
          }
        });
      })
      .addCase(addTokensToWatchlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add tokens';
      });
  },
});

export const { updateHoldings, removeToken, clearError } = portfolioSlice.actions;

// Selectors
export const selectTokens = (state: { portfolio: PortfolioState }) =>
  state.portfolio.tokens;

export const selectPortfolioTotal = (state: { portfolio: PortfolioState }) =>
  state.portfolio.tokens.reduce((sum, token) => sum + token.value, 0);

export const selectLastUpdated = (state: { portfolio: PortfolioState }) =>
  state.portfolio.lastUpdated;

export const selectLoading = (state: { portfolio: PortfolioState }) =>
  state.portfolio.loading;

export const selectError = (state: { portfolio: PortfolioState }) =>
  state.portfolio.error;

export default portfolioSlice.reducer;
