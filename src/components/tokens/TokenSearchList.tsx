import { useState, useCallback } from "react";
import { SearchResult } from "../../lib/coingecko";
import { useInfiniteTokenSearch } from "../../features/tokens/useInfiniteTokenSearch";
import { HiOutlineStar, HiCheck } from "react-icons/hi2";
import { cn } from "../../lib/utils";
import TokenSearchListSkeleton from "./TokenSearchListSkeleton";

interface TokenSearchListProps {
  selectedTokens: SearchResult[];
  onToggleToken: (token: SearchResult) => void;
  existingTokenIds: string[];
}

export default function TokenSearchList({ selectedTokens, onToggleToken, existingTokenIds }: TokenSearchListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const {
    items: tokens,
    loading,
    loadingMore,
    error,
    hasMore,
    retry,
    sentinelRef,
    scrollContainerRef,
  } = useInfiniteTokenSearch(searchQuery);

  const isSelected = useCallback((tokenId: string) => selectedTokens.some((t) => t.id === tokenId), [selectedTokens]);

  const isExisting = useCallback((tokenId: string) => existingTokenIds.includes(tokenId), [existingTokenIds]);

  const showTopCoinsLabel = !searchQuery.trim() && tokens.length > 0 && !loading;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Search Input */}
      <div className="p-4 flex-shrink-0">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tokens (e.g., ETH, SOL)..."
          className="input-field"
          autoFocus
        />
      </div>

      {/* Token List - Scrollable Container */}
      <div 
        ref={(el) => { (scrollContainerRef as React.MutableRefObject<HTMLDivElement | null>).current = el; }} 
        className="flex-1 overflow-y-auto min-h-0"
      >
        {showTopCoinsLabel && (
          <div className="px-4 py-2 text-xs text-muted-foreground font-medium sticky top-0 bg-card z-10">Trending</div>
        )}

        {/* Initial Loading State with Skeletons */}
        {loading && tokens.length === 0 && <TokenSearchListSkeleton count={8} />}

        {/* Error State */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <p className="text-destructive text-sm mb-2">{error.message}</p>
            <button onClick={retry} className="text-sm text-primary hover:underline">
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && tokens.length === 0 && searchQuery && (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <p className="text-muted-foreground text-sm">No tokens found</p>
          </div>
        )}

        {/* Token List Items */}
        {!loading && tokens.length > 0 && (
          <div className="divide-y divide-card-border">
            {tokens.map((token) => {
              const selected = isSelected(token.id);
              const existing = isExisting(token.id);

              return (
                <button
                  key={token.id}
                  onClick={() => !existing && onToggleToken(token)}
                  disabled={existing}
                  className={cn(
                    "w-full px-4 py-3 flex items-center justify-between transition-colors",
                    existing ? "opacity-50 cursor-not-allowed" : "hover:bg-secondary/50",
                    selected && !existing && "bg-primary/5 border-l-2 border-l-primary",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={token.large || token.thumb}
                      alt={token.name}
                      className="w-8 h-8 rounded-full bg-secondary"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/32";
                      }}
                    />
                    <div className="text-left">
                      <span className="font-medium text-foreground">{token.name}</span>
                      <span className="text-muted-foreground ml-1.5">({token.symbol.toUpperCase()})</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {selected && <HiOutlineStar className="w-4 h-4 text-primary fill-primary" />}
                    <div
                      className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                        selected ? "border-primary bg-primary" : "border-muted-foreground/50",
                      )}
                    >
                      {selected && <HiCheck className="w-3 h-3 text-primary-foreground" />}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Sentinel for intersection observer & loading more indicator */}
        <div 
          ref={(el) => { (sentinelRef as React.MutableRefObject<HTMLDivElement | null>).current = el; }} 
          className="min-h-[20px]"
        >
          {loadingMore && <TokenSearchListSkeleton count={3} />}
          {!loadingMore && hasMore && !loading && !error && <div className="h-10" aria-hidden="true" />}
        </div>
      </div>
    </div>
  );
}
