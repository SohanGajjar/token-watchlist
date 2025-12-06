import { configureStore } from '@reduxjs/toolkit';
import portfolioReducer from '../features/portfolio/portfolioSlice';
import uiReducer from '../features/ui/uiSlice';
import { PortfolioState } from '../types/portfolio';

interface PersistedState {
  portfolio?: PortfolioState;
}

// Load state from localStorage - watchlist is independent of wallet connection
const loadState = (): PersistedState => {
  try {
    const serializedState = localStorage.getItem('portfolioState');
    if (serializedState) {
      const parsed = JSON.parse(serializedState);
      if (parsed.portfolio) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to load state from localStorage:', err);
  }
  
  // Return empty watchlist if no persisted state
  return {
    portfolio: {
      tokens: [],
      lastUpdated: null,
      loading: false,
      error: null,
    },
  };
};

// Save state to localStorage
const saveState = (state: RootState) => {
  try {
    const serializedState = JSON.stringify({
      portfolio: {
        tokens: state.portfolio.tokens,
        lastUpdated: state.portfolio.lastUpdated,
        loading: false,
        error: null,
      },
    });
    localStorage.setItem('portfolioState', serializedState);
  } catch (err) {
    console.error('Failed to save state to localStorage:', err);
  }
};

const persistedState = loadState();

export const store = configureStore({
  reducer: {
    portfolio: portfolioReducer,
    ui: uiReducer,
  },
  preloadedState: persistedState,
});

// Subscribe to store changes and save to localStorage
let timeoutId: NodeJS.Timeout | null = null;
store.subscribe(() => {
  // Debounce localStorage saves
  if (timeoutId) clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    saveState(store.getState());
  }, 500);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
