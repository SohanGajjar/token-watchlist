import { useState, useRef, useEffect } from 'react';
import { TokenWatchItem } from '../../types/portfolio';
import { formatCurrency, formatPercentage, cn } from '../../lib/utils';
import SparklineChart from './SparklineChart';
import { HiOutlineEllipsisVertical, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi2';
import { useAppDispatch } from '../../store/hooks';
import { updateHoldings, removeToken } from '../../features/portfolio/portfolioSlice';

interface WatchlistTableRowProps {
  token: TokenWatchItem;
  isEditing: boolean;
  onStartEdit: () => void;
  onEndEdit: () => void;
}

export default function WatchlistTableRow({
  token,
  isEditing,
  onStartEdit,
  onEndEdit,
}: WatchlistTableRowProps) {
  const dispatch = useAppDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const [editValue, setEditValue] = useState(token.holdings.toString());
  const menuRef = useRef<HTMLDivElement>(null);

  const isPositive = token.priceChange24hPct >= 0;

  useEffect(() => {
    setEditValue(token.holdings.toString());
  }, [token.holdings]);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSave = () => {
    const newHoldings = parseFloat(editValue) || 0;
    dispatch(updateHoldings({ tokenId: token.id, holdings: newHoldings }));
    onEndEdit();
  };

  const handleRemove = () => {
    dispatch(removeToken(token.id));
    setMenuOpen(false);
  };

  return (
    <tr className="border-b border-card-border hover:bg-secondary/20 transition-colors">
      {/* Token */}
      <td className="table-cell">
        <div className="flex items-center gap-3">
          <img
            src={token.image}
            alt={token.name}
            className="w-9 h-9 rounded-full bg-secondary"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/36';
            }}
          />
          <div className="flex items-center gap-1.5">
            <span className="font-medium text-foreground">{token.name}</span>
            <span className="text-muted-foreground">({token.symbol})</span>
          </div>
        </div>
      </td>

      {/* Price */}
      <td className="table-cell">
        <span className="text-foreground">{formatCurrency(token.price)}</span>
      </td>

      {/* 24h % */}
      <td className="table-cell">
        <span className={cn(
          'font-medium',
          isPositive ? 'positive-change' : 'negative-change'
        )}>
          {formatPercentage(token.priceChange24hPct)}
        </span>
      </td>

      {/* Sparkline */}
      <td className="table-cell">
        <SparklineChart
          data={token.sparkline7d}
          color={isPositive ? 'positive' : 'negative'}
        />
      </td>

      {/* Holdings */}
      <td className="table-cell">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <select
              value={editValue}
              className="bg-input border border-primary rounded px-2 py-1.5 text-foreground text-sm focus:outline-none appearance-none cursor-pointer min-w-[70px]"
              onChange={(e) => setEditValue(e.target.value)}
            >
              <option value="" disabled>Select</option>
              <option value="0.01">0.01</option>
              <option value="0.05">0.05</option>
              <option value="0.1">0.1</option>
              <option value="0.5">0.5</option>
              <option value="1">1</option>
              <option value="2.5">2.5</option>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
            <button
              onClick={handleSave}
              className="px-3 py-1.5 bg-primary text-primary-foreground text-sm font-medium rounded hover:brightness-110 transition"
            >
              Save
            </button>
          </div>
        ) : (
          <span className="text-foreground">{token.holdings.toFixed(4)}</span>
        )}
      </td>

      {/* Value */}
      <td className="table-cell">
        <span className="text-foreground font-medium">{formatCurrency(token.value)}</span>
      </td>

      {/* Actions */}
      <td className="table-cell relative">
        <div ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 hover:bg-secondary rounded transition-colors"
          >
            <HiOutlineEllipsisVertical className="w-5 h-5 text-muted-foreground" />
          </button>

          {menuOpen && (
            <div className="absolute right-4 top-full mt-1 bg-card border border-card-border rounded-lg shadow-xl z-20 py-1 min-w-[150px] animate-scale-in">
              <button
                onClick={() => {
                  onStartEdit();
                  setMenuOpen(false);
                }}
                className="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-secondary flex items-center gap-2 transition-colors"
              >
                <HiOutlinePencil className="w-4 h-4 text-muted-foreground" />
                Edit Holdings
              </button>
              <button
                onClick={handleRemove}
                className="w-full px-3 py-2 text-left text-sm text-destructive hover:bg-secondary flex items-center gap-2 transition-colors"
              >
                <HiOutlineTrash className="w-4 h-4" />
                Remove
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}
