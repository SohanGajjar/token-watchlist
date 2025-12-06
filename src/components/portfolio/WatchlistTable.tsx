import { useState, useEffect, useRef, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { selectTokens, selectLoading, refreshTokenPrices } from '../../features/portfolio/portfolioSlice';
import { openAddTokenModal } from '../../features/ui/uiSlice';
import WatchlistTableRow from './WatchlistTableRow';
import WatchlistPagination from './WatchlistPagination';
import MobileTokenCard from './MobileTokenCard';
import { useIsMobile } from '../../hooks/use-mobile';
import { HiOutlineArrowPath, HiOutlinePlus, HiOutlineStar } from 'react-icons/hi2';

const ROW_HEIGHT = 64;
const HEADER_HEIGHT = 73;
const TABLE_HEADER_HEIGHT = 45;
const PAGINATION_HEIGHT = 60;
const MIN_ITEMS = 3;

export default function WatchlistTable() {
  const dispatch = useAppDispatch();
  const tokens = useAppSelector(selectTokens);
  const loading = useAppSelector(selectLoading);
  const isMobile = useIsMobile();
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState(MIN_ITEMS);
  const containerRef = useRef<HTMLDivElement>(null);

  const calculateItemsPerPage = useCallback(() => {
    if (!containerRef.current) return;
    
    const containerTop = containerRef.current.getBoundingClientRect().top;
    const viewportHeight = window.innerHeight;
    const availableHeight = viewportHeight - containerTop - HEADER_HEIGHT - TABLE_HEADER_HEIGHT - PAGINATION_HEIGHT - 16;
    
    const calculatedItems = Math.floor(availableHeight / ROW_HEIGHT);
    setItemsPerPage(Math.max(MIN_ITEMS, calculatedItems));
  }, []);

  useEffect(() => {
    calculateItemsPerPage();
    window.addEventListener('resize', calculateItemsPerPage);
    return () => window.removeEventListener('resize', calculateItemsPerPage);
  }, [calculateItemsPerPage]);

  const totalPages = Math.max(1, Math.ceil(tokens.length / itemsPerPage));
  const paginatedTokens = tokens.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  const handleRefresh = () => {
    dispatch(refreshTokenPrices());
  };

  const handleAddToken = () => {
    dispatch(openAddTokenModal());
  };

  return (
    <div ref={containerRef} className="card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 p-4 md:px-6 md:py-5">
        <div className="flex items-center gap-2">
          <HiOutlineStar className="w-5 h-5 text-primary fill-primary" />
          <h2 className="text-lg font-semibold text-foreground">Watchlist</h2>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={handleRefresh}
            disabled={loading || tokens.length === 0}
            className="btn-secondary py-2 px-2 md:px-4 disabled:opacity-50"
          >
            <HiOutlineArrowPath className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh Prices</span>
          </button>
          <button onClick={handleAddToken} className="btn-primary py-2">
            <HiOutlinePlus className="w-4 h-4" />
            <span>Add Token</span>
          </button>
        </div>
      </div>

      {/* Table */}
      {tokens.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 border-t border-card-border">
          <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mb-4">
            <HiOutlineStar className="w-7 h-7 text-muted-foreground" />
          </div>
          <h3 className="text-base font-medium text-foreground mb-2">No tokens yet</h3>
          <p className="text-muted-foreground text-sm text-center mb-6 max-w-sm">
            Your watchlist is empty. Add some tokens to start tracking your portfolio.
          </p>
          <button onClick={handleAddToken} className="btn-primary">
            <HiOutlinePlus className="w-4 h-4" />
            Add Token
          </button>
        </div>
      ) : (
        <>
          {/* Mobile View */}
          {isMobile ? (
            <div className="border-t border-card-border">
              {/* Mobile Table Header */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-secondary/30 border-b border-card-border">
                <span className="text-xs text-muted-foreground font-medium">Token</span>
                <div className="flex items-center gap-8">
                  <span className="text-xs text-muted-foreground font-medium">Price</span>
                  <span className="text-xs text-muted-foreground font-medium">Value</span>
                  <span className="w-5"></span>
                </div>
              </div>
              {/* Mobile Token List */}
              <div>
                {paginatedTokens.map((token) => (
                  <MobileTokenCard key={token.id} token={token} />
                ))}
              </div>
            </div>
          ) : (
            /* Desktop View */
            <div className="overflow-x-auto border-t border-card-border">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-card-border bg-secondary/30">
                    <th className="table-header text-left px-4 py-3">Token</th>
                    <th className="table-header text-left px-4 py-3">Price</th>
                    <th className="table-header text-left px-4 py-3">24h %</th>
                    <th className="table-header text-left px-4 py-3">Sparkline (7d)</th>
                    <th className="table-header text-left px-4 py-3">Holdings</th>
                    <th className="table-header text-left px-4 py-3">Value</th>
                    <th className="table-header text-left px-4 py-3 w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTokens.map((token) => (
                    <WatchlistTableRow
                      key={token.id}
                      token={token}
                      isEditing={editingId === token.id}
                      onStartEdit={() => setEditingId(token.id)}
                      onEndEdit={() => setEditingId(null)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <WatchlistPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={tokens.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}
