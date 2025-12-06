import { useState, useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { selectAddTokenModalOpen, closeAddTokenModal } from '../../features/ui/uiSlice';
import { addTokensToWatchlist, selectTokens } from '../../features/portfolio/portfolioSlice';
import { SearchResult } from '../../lib/coingecko';
import TokenSearchList from './TokenSearchList';
import { useIsMobile } from '../../hooks/use-mobile';
import { X } from 'lucide-react';

export default function AddTokenModal() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectAddTokenModalOpen);
  const existingTokens = useAppSelector(selectTokens);
  const isMobile = useIsMobile();
  const [selectedTokens, setSelectedTokens] = useState<SearchResult[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  // Refs for bottom sheet swipe-to-close on mobile
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const startYRef = useRef<number | null>(null);
  const currentTranslateRef = useRef<number>(0);

  // Reset selection when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedTokens([]);
      // reset transform
      if (sheetRef.current) {
        sheetRef.current.style.transform = '';
      }
      currentTranslateRef.current = 0;
    }
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleClose = () => {
    dispatch(closeAddTokenModal());
    setSelectedTokens([]);
  };

  const handleToggleToken = (token: SearchResult) => {
    // Check if already in watchlist
    if (existingTokens.some((t) => t.id === token.id)) {
      return; // Already in watchlist
    }

    setSelectedTokens((prev) => {
      const exists = prev.some((t) => t.id === token.id);
      if (exists) {
        return prev.filter((t) => t.id !== token.id);
      }
      return [...prev, token];
    });
  };

  const handleAddToWatchlist = async () => {
    if (selectedTokens.length === 0 || isAdding) return;

    setIsAdding(true);

    const tokensToAdd = selectedTokens.map((token) => ({
      id: token.id,
      symbol: token.symbol,
      name: token.name,
      image: token.large || token.thumb,
    }));

    try {
      await dispatch(addTokensToWatchlist(tokensToAdd));
      handleClose();
    } finally {
      setIsAdding(false);
    }
  };

  // Mobile touch handlers for swipe-to-close behavior
  const onTouchStart = (e: React.TouchEvent) => {
    startYRef.current = e.touches[0].clientY;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!sheetRef.current || startYRef.current == null) return;
    const deltaY = e.touches[0].clientY - startYRef.current;
    if (deltaY < 0) return; // don't drag up
    currentTranslateRef.current = deltaY;
    sheetRef.current.style.transform = `translateY(${deltaY}px)`;
    sheetRef.current.style.transition = 'none';
  };

  const onTouchEnd = () => {
    if (!sheetRef.current) return;
    const translate = currentTranslateRef.current;
    const threshold = 120; // px to trigger close
    sheetRef.current.style.transition = 'transform 200ms ease-out';
    if (translate > threshold) {
      // animate out and close
      sheetRef.current.style.transform = `translateY(100%)`;
      setTimeout(() => handleClose(), 180);
    } else {
      // reset
      sheetRef.current.style.transform = '';
      currentTranslateRef.current = 0;
    }
    startYRef.current = null;
  };

  if (!isOpen) return null;

  return (
    // Fullscreen overlay
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
      aria-hidden={!isOpen}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/45 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Mobile bottom sheet */}
      <div
        ref={sheetRef}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={isMobile ? onTouchStart : undefined}
        onTouchMove={isMobile ? onTouchMove : undefined}
        onTouchEnd={isMobile ? onTouchEnd : undefined}
        role="dialog"
        aria-modal="true"
        className={
          isMobile
            ? 'relative w-full max-h-[88vh] bg-card rounded-t-2xl shadow-2xl flex flex-col overflow-hidden transform translate-y-0 animate-slide-up'
            : 'relative w-[680px] max-h-[88vh] bg-card rounded-md shadow-lg flex flex-col overflow-hidden'
        }
        style={isMobile ? { margin: '0 auto' } : undefined}
      >
        {/* Drag handle + header */}
        <div className="px-4 pt-3 pb-2 flex items-center justify-between border-b border-card-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-1.5 bg-card-border rounded-full mr-2" aria-hidden />
            <h3 className="text-lg font-medium">Add Tokens</h3>
          </div>
          <button
            aria-label="Close"
            onClick={handleClose}
            className="p-2 rounded-md hover:bg-muted/50 active:scale-95"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content area */}
        <div
          className={
            isMobile
              ? 'flex-1 flex flex-col overflow-hidden px-4 pb-0'
              : 'h-[480px] flex flex-col overflow-hidden p-4'
          }
        >
          <div className="flex-1 overflow-auto -mr-2 pr-2">
            <TokenSearchList
              selectedTokens={selectedTokens}
              onToggleToken={handleToggleToken}
              existingTokenIds={existingTokens.map((t) => t.id)}
            />
          </div>
        </div>

        {/* Footer with safe-area and improved CTA */}
        <div
          className={
            isMobile
              ? 'p-4 pb-[calc(env(safe-area-inset-bottom)+16px)] border-t border-card-border bg-card flex flex-col gap-3'
              : 'p-4 border-t border-card-border flex justify-end bg-card'
          }
        >
          {/* Selected count + action on mobile */}
          {isMobile && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted">{selectedTokens.length} selected</div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedTokens([])}
                  className="text-sm px-3 py-2 rounded-md hover:bg-muted/20"
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          <button
            onClick={handleAddToWatchlist}
            disabled={selectedTokens.length === 0 || isAdding}
            className={
              isMobile
                ? 'btn-primary w-full py-3 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed'
                : 'btn-primary disabled:opacity-50 disabled:cursor-not-allowed'
            }
          >
            {isAdding ? 'Adding...' : 'Add to Watchlist'}
          </button>
        </div>
      </div>
    </div>
  );
}
