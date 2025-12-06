import { useMemo } from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface SparklineChartProps {
  data: number[];
  color?: 'positive' | 'negative' | 'neutral';
  width?: number;
  height?: number;
}

export default function SparklineChart({
  data,
  color = 'neutral',
  width = 100,
  height = 32,
}: SparklineChartProps) {
  // Downsample data if too many points
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    const maxPoints = 50;
    let sampledData = data;
    
    if (data.length > maxPoints) {
      const step = Math.floor(data.length / maxPoints);
      sampledData = data.filter((_, i) => i % step === 0);
    }
    
    return sampledData.map((value, index) => ({ value, index }));
  }, [data]);

  if (chartData.length === 0) {
    return (
      <div
        style={{ width, height }}
        className="flex items-center justify-center text-muted-foreground text-xs"
      >
        —
      </div>
    );
  }

  // Determine color based on trend or explicit color
  const getStrokeColor = () => {
    if (color === 'positive') return '#22C55E';
    if (color === 'negative') return '#EF4444';
    
    // Auto-detect based on first vs last value
    const first = data[0];
    const last = data[data.length - 1];
    if (last > first) return '#22C55E';
    if (last < first) return '#EF4444';
    return '#6B7280';
  };

  return (
    <div style={{ width, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={getStrokeColor()}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
