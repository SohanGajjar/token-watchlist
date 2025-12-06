import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { TokenWatchItem } from '../../types/portfolio';
import { getTokenColor } from '../../lib/utils';

interface PortfolioDonutChartProps {
  tokens: TokenWatchItem[];
  totalValue: number;
  isMobile?: boolean;
}

export default function PortfolioDonutChart({ tokens, totalValue, isMobile = false }: PortfolioDonutChartProps) {
  const data = tokens
    .filter((token) => token.value > 0)
    .map((token, index) => ({
      name: token.symbol,
      value: token.value,
      color: getTokenColor(index),
      percentage: totalValue > 0 ? (token.value / totalValue) * 100 : 0,
    }));

  // If no data, show empty state
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="w-40 h-40 md:w-48 md:h-48 rounded-full border-2 border-dashed border-card-border flex items-center justify-center">
          <span className="text-muted-foreground text-sm">No holdings</span>
        </div>
      </div>
    );
  }

  // Mobile - Chart on top, legend below
  if (isMobile) {
    return (
      <div className="flex flex-col items-center w-full">
        <div className="w-44 h-44">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex flex-col gap-1.5 w-full mt-4">
          {tokens.slice(0, 6).map((token, index) => {
            const percentage = totalValue > 0 ? (token.value / totalValue) * 100 : 0;
            return (
              <div key={token.id} className="flex items-center justify-between gap-4">
                <span
                  className="text-sm font-medium"
                  style={{ color: getTokenColor(index) }}
                >
                  {token.name} ({token.symbol})
                </span>
                <span className="text-muted-foreground text-sm">
                  {percentage.toFixed(1)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Desktop - Chart and legend side by side
  return (
    <div className="flex items-start gap-8">
      <div className="w-40 h-40 lg:w-48 lg:h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={75}
              paddingAngle={2}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {/* Legend - Right of chart */}
      <div className="flex flex-col gap-1.5 min-w-[180px]">
        {tokens.slice(0, 6).map((token, index) => {
          const percentage = totalValue > 0 ? (token.value / totalValue) * 100 : 0;
          return (
            <div key={token.id} className="flex items-center justify-between gap-6">
              <span
                className="text-sm font-medium"
                style={{ color: getTokenColor(index) }}
              >
                {token.name} ({token.symbol})
              </span>
              <span className="text-muted-foreground text-sm">
                {percentage.toFixed(1)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
