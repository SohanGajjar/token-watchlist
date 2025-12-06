import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { refreshTokenPrices, selectTokens, selectLastUpdated } from '../features/portfolio/portfolioSlice';
import Header from '../components/layout/Header';
import PageContainer from '../components/layout/PageContainer';
import PortfolioSummaryCard from '../components/portfolio/PortfolioSummaryCard';
import WatchlistTable from '../components/portfolio/WatchlistTable';
import AddTokenModal from '../components/tokens/AddTokenModal';

export default function Index() {
  const dispatch = useAppDispatch();
  const tokens = useAppSelector(selectTokens);
  const lastUpdated = useAppSelector(selectLastUpdated);

  // Fetch fresh prices on mount if we have tokens
  useEffect(() => {
    if (tokens.length > 0 && !lastUpdated) {
      dispatch(refreshTokenPrices());
    }
  }, []);

  // Also refresh if lastUpdated is stale (older than 5 minutes)
  useEffect(() => {
    if (tokens.length > 0 && lastUpdated) {
      const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
      if (new Date(lastUpdated).getTime() < fiveMinutesAgo) {
        dispatch(refreshTokenPrices());
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageContainer>
        <div className="flex flex-col gap-6 md:gap-8">
          <PortfolioSummaryCard />
          <WatchlistTable />
        </div>
      </PageContainer>
      <AddTokenModal />
    </div>
  );
}
