import { useState, useRef, useEffect } from 'react';
import { TokenWatchItem } from '../../types/portfolio';
import { formatCurrency } from '../../lib/utils';
import { HiOutlineEllipsisVertical, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi2';
import { useAppDispatch } from '../../store/hooks';
import { updateHoldings, removeToken } from '../../features/portfolio/portfolioSlice';

interface MobileTokenCardProps {
  token: TokenWatchItem;
}

export default function MobileTokenCard({ token }: MobileTokenCardProps) {
  const dispatch = useAppDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(token.holdings.toString());
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEditValue(token.holdings.toString());
  }, [token.holdings]);

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
    setIsEditing(false);
  };

  const handleRemove = () => {
    dispatch(removeToken(token.id));
    setMenuOpen(false);
  };

  return (
    <div className="flex items-center justify-between py-3 px-4 border-b border-card-border">
      {/* Token Info */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <img
          src={token.image}
          alt={token.name}
          className="w-9 h-9 rounded-full bg-secondary flex-shrink-0"
        />
        <div className="min-w-0">
          <div className="flex items-center gap-1">
            <span className="font-medium text-foreground text-sm truncate">{token.name}</span>
            <span className="text-muted-foreground text-sm flex-shrink-0">({token.symbol})</span>
          </div>
        </div>
      </div>

      {/* Price & Value */}
      <div className="flex items-center gap-4">
        <div className="text-right min-w-[80px]">
          <span className="text-foreground text-sm">{formatCurrency(token.price)}</span>
        </div>
        <div className="text-right min-w-[80px]">
          <span className="text-foreground text-sm font-medium">{formatCurrency(token.value)}</span>
        </div>
        
        {/* Menu */}
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1 hover:bg-secondary rounded transition-colors"
          >
            <HiOutlineEllipsisVertical className="w-5 h-5 text-muted-foreground" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 bg-card border border-card-border rounded-lg shadow-xl z-20 py-1 min-w-[150px] animate-scale-in">
              <button
                onClick={() => {
                  setIsEditing(true);
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
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setIsEditing(false)}>
          <div className="bg-card border border-card-border rounded-xl p-4 w-full max-w-xs" onClick={e => e.stopPropagation()}>
            <h3 className="text-foreground font-medium mb-3">Edit Holdings</h3>
            <input
              type="number"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="input-field mb-3"
              autoFocus
            />
            <div className="flex gap-2">
              <button onClick={() => setIsEditing(false)} className="btn-secondary flex-1 justify-center">
                Cancel
              </button>
              <button onClick={handleSave} className="btn-primary flex-1 justify-center">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
