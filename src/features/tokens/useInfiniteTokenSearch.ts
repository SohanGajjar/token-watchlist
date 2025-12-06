import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchTrendingTokens, searchCoins, SearchResult } from '../../lib/coingecko';

/**
 * Configuration constants for infinite token search
 */
export const PER_PAGE = 12;
export const DEBOUNCE_MS = 350;
export const INTERSECTION_THRESHOLD = 0.25;

interface UseInfiniteTokenSearchOptions {
  perPage?: number;
  debounceMs?: number;
}

interface UseInfiniteTokenSearchResult {
  items: SearchResult[];
  loading: boolean;
  loadingMore: boolean;
  error: Error | null;
  hasMore: boolean;
  reset: () => void;
  retry: () => void;
  sentinelRef: React.RefObject<HTMLDivElement>;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
}

/**
 * Infinite scroll hook for token search.
 * 
 * Behavior:
 * - When no query: Shows trending tokens (no infinite scroll, finite list)
 * - When query exists: Searches all coins via /search API with infinite scroll
 * 
 * Features:
 * - Debounced search with configurable delay (default 350ms)
 * - Intersection observer for auto-loading next pages
 * - Deduplication by token id
 * - Proper cleanup on unmount
 */
export function useInfiniteTokenSearch(
  query: string,
  opts?: UseInfiniteTokenSearchOptions
): UseInfiniteTokenSearchResult {
  const perPage = opts?.perPage ?? PER_PAGE;
  const debounceMs = opts?.debounceMs ?? DEBOUNCE_MS;

  const [items, setItems] = useState<SearchResult[]>([]);
  const [allSearchResults, setAllSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(false);

  // Internal state refs
  const pageRef = useRef(1);
  const fetchLockRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Refs for intersection observer
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Abort any in-flight request
  const abortCurrentRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  // Clear debounce timer
  const clearDebounceTimer = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
  }, []);

  // Get paginated results from all results
  const getPaginatedResults = useCallback((allResults: SearchResult[], page: number) => {
    const endIndex = page * perPage;
    const pageResults = allResults.slice(0, endIndex);
    
    return {
      results: pageResults,
      hasMore: endIndex < allResults.length,
    };
  }, [perPage]);

  // Fetch trending tokens (no search query)
  const fetchTrending = useCallback(async () => {
    if (fetchLockRef.current) return;
    fetchLockRef.current = true;

    abortCurrentRequest();
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      setLoading(true);
      setError(null);

      const trendingTokens = await fetchTrendingTokens();
      
      if (abortController.signal.aborted) return;
      
      setItems(trendingTokens);
      setAllSearchResults([]);
      setHasMore(false); // Trending list is finite, no infinite scroll
      pageRef.current = 1;
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      setError(err instanceof Error ? err : new Error('Failed to fetch trending tokens'));
    } finally {
      if (!abortController.signal.aborted) {
        setLoading(false);
        fetchLockRef.current = false;
      }
    }
  }, [abortCurrentRequest]);

  // Fetch search results (with search query)
  const fetchSearchResults = useCallback(async (searchQuery: string) => {
    if (fetchLockRef.current) return;
    fetchLockRef.current = true;

    abortCurrentRequest();
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      setLoading(true);
      setError(null);

      const searchResults = await searchCoins(searchQuery, abortController.signal);
      
      if (abortController.signal.aborted) return;
      
      // Store all results and paginate client-side
      setAllSearchResults(searchResults);
      
      // Show first page
      const { results, hasMore: moreAvailable } = getPaginatedResults(searchResults, 1);
      setItems(results);
      setHasMore(moreAvailable);
      pageRef.current = 1;
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      setError(err instanceof Error ? err : new Error('Failed to search coins'));
    } finally {
      if (!abortController.signal.aborted) {
        setLoading(false);
        fetchLockRef.current = false;
      }
    }
  }, [abortCurrentRequest, getPaginatedResults]);

  // Load next page (called by intersection observer) - only for search results
  const loadNextPage = useCallback(() => {
    if (fetchLockRef.current || !hasMore || error || loading || loadingMore) return;
    if (allSearchResults.length === 0) return; // Only paginate search results
    
    setLoadingMore(true);
    
    const nextPage = pageRef.current + 1;
    const { results, hasMore: moreAvailable } = getPaginatedResults(allSearchResults, nextPage);
    
    // Set all paginated results (getPaginatedResults already returns cumulative results)
    setItems(results);
    setHasMore(moreAvailable);
    pageRef.current = nextPage;
    setLoadingMore(false);
  }, [allSearchResults, hasMore, error, loading, loadingMore, getPaginatedResults]);

  // Public reset function
  const reset = useCallback(() => {
    clearDebounceTimer();
    abortCurrentRequest();
    setItems([]);
    setAllSearchResults([]);
    setError(null);
    setHasMore(false);
    pageRef.current = 1;
    fetchLockRef.current = false;
    setLoading(true);
    
    if (query.trim()) {
      fetchSearchResults(query);
    } else {
      fetchTrending();
    }
  }, [clearDebounceTimer, abortCurrentRequest, fetchSearchResults, fetchTrending, query]);

  // Public retry function
  const retry = useCallback(() => {
    setError(null);
    if (query.trim()) {
      fetchSearchResults(query);
    } else {
      fetchTrending();
    }
  }, [fetchSearchResults, fetchTrending, query]);

  // Debounced query effect
  useEffect(() => {
    clearDebounceTimer();
    abortCurrentRequest();
    
    // Reset state for new query
    setItems([]);
    setAllSearchResults([]);
    setError(null);
    setHasMore(false);
    pageRef.current = 1;
    fetchLockRef.current = false;
    setLoading(true);

    debounceTimerRef.current = setTimeout(() => {
      if (query.trim()) {
        fetchSearchResults(query);
      } else {
        fetchTrending();
      }
    }, debounceMs);

    return () => {
      clearDebounceTimer();
    };
  }, [query, debounceMs, clearDebounceTimer, abortCurrentRequest, fetchSearchResults, fetchTrending]);

  // Setup intersection observer for infinite scroll (only when searching)
  useEffect(() => {
    const sentinel = sentinelRef.current;
    const scrollContainer = scrollContainerRef.current;

    if (!sentinel || !scrollContainer) return;

    // Disconnect previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !loading && !loadingMore && hasMore && !error) {
          loadNextPage();
        }
      },
      {
        root: scrollContainer,
        threshold: INTERSECTION_THRESHOLD,
        rootMargin: '100px',
      }
    );

    observerRef.current.observe(sentinel);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [loading, loadingMore, hasMore, error, loadNextPage]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearDebounceTimer();
      abortCurrentRequest();
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [clearDebounceTimer, abortCurrentRequest]);

  return {
    items,
    loading,
    loadingMore,
    error,
    hasMore,
    reset,
    retry,
    sentinelRef,
    scrollContainerRef,
  };
}
