import { useAppSelector } from '../../store/hooks';
import {
  selectTokens,
  selectPortfolioTotal,
  selectLastUpdated,
} from '../../features/portfolio/portfolioSlice';
import { formatCurrency, formatLastUpdated } from '../../lib/utils';
import PortfolioDonutChart from './PortfolioDonutChart';
import { useIsMobile } from '../../hooks/use-mobile';

export default function PortfolioSummaryCard() {
  const tokens = useAppSelector(selectTokens);
  const totalValue = useAppSelector(selectPortfolioTotal);
  const lastUpdated = useAppSelector(selectLastUpdated);
  const isMobile = useIsMobile();

  return (
    <div className="card p-5 md:p-8">
      {isMobile ? (
        // Mobile Layout - Stacked
        <>
          <div className="flex flex-col">
            <span className="text-muted-foreground text-sm font-medium mb-2">
              Portfolio Total
            </span>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              {formatCurrency(totalValue)}
            </h1>
            <span className="text-muted-foreground text-sm mt-3">
              Last updated: {formatLastUpdated(lastUpdated)}
            </span>
          </div>

          <div className="flex flex-col mt-6">
            <span className="text-muted-foreground text-sm font-medium mb-4">
              Portfolio Total
            </span>
            <PortfolioDonutChart tokens={tokens} totalValue={totalValue} isMobile />
          </div>

          {/* Swipe indicator for mobile */}
          <div className="flex justify-center mt-6">
            <div className="w-32 h-1 bg-muted-foreground/30 rounded-full" />
          </div>
        </>
      ) : (
        // Desktop Layout - Side by side
        <div className="flex justify-between items-start">
          {/* Left side - Total Value */}
          <div className="flex flex-col">
            <span className="text-muted-foreground text-sm font-medium mb-2">
              Portfolio Total
            </span>
            <h1 className="text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
              {formatCurrency(totalValue)}
            </h1>
            <span className="text-muted-foreground text-sm mt-8">
              Last updated: {formatLastUpdated(lastUpdated)}
            </span>
          </div>

          {/* Right side - Donut Chart with legend */}
          <div className="flex flex-col items-end">
            <span className="text-muted-foreground text-sm font-medium mb-4">
              Portfolio Total
            </span>
            <PortfolioDonutChart tokens={tokens} totalValue={totalValue} />
          </div>
        </div>
      )}
    </div>
  );
}
