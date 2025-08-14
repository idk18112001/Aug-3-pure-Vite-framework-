import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';

interface ChartData {
  date: string;
  price: number;
  indicator: number;
}

interface IndicatorChartProps {
  symbol?: string;
  indicatorName: string;
  period: string;
}

export default function IndicatorChart({ symbol, indicatorName, period }: IndicatorChartProps) {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (symbol) {
      generateChartData();
    }
  }, [symbol, period]);

  const generateChartData = () => {
    setLoading(true);
    
    // Generate realistic chart data based on period
    const periods = {
      '1M': 30,
      '3M': 90,
      '6M': 180,
      '1Y': 365,
      '2Y': 730
    };
    
    const days = periods[period as keyof typeof periods] || 30;
    const chartData: ChartData[] = [];
    
    // Base values
    let basePrice = 150 + Math.random() * 100;
    let baseIndicator = 1000 + Math.random() * 500;
    
    // Generate data points with some correlation
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Add some trend and volatility
      const trend = Math.sin((days - i) / days * Math.PI * 2) * 0.1;
      const noise = (Math.random() - 0.5) * 0.05;
      
      basePrice *= (1 + trend + noise);
      baseIndicator *= (1 + trend * 0.5 + noise * 0.3);
      
      chartData.push({
        date: date.toISOString().split('T')[0],
        price: Math.round(basePrice * 100) / 100,
        indicator: Math.round(baseIndicator * 100) / 100
      });
    }
    
    setData(chartData);
    setLoading(false);
  };

  // Generate default data when no symbol is provided
  useEffect(() => {
    if (!symbol) {
      generateChartData();
    }
  }, [period]);

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center bg-navy/20 rounded-xl">
        <div className="text-warm-white/60">Loading chart data...</div>
      </div>
    );
  }

  return (
    <div className="h-64 bg-navy/20 rounded-xl p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis 
            dataKey="date" 
            stroke="#94a3b8"
            fontSize={12}
            tickFormatter={(value) => {
              const date = new Date(value);
              return `${date.getMonth() + 1}/${date.getDate()}`;
            }}
          />
          <YAxis 
            yAxisId="price"
            orientation="left"
            stroke="#10b981" 
            fontSize={12}
          />
          <YAxis 
            yAxisId="indicator"
            orientation="right"
            stroke="#3b82f6"
            fontSize={12}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '8px',
              color: '#f1f5f9'
            }}
            formatter={(value: any, name: string) => [
              `$${parseFloat(value).toFixed(2)}`,
              name === 'price' ? (symbol || 'Stock Price') : indicatorName
            ]}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Line 
            yAxisId="price"
            type="monotone" 
            dataKey="price" 
            stroke="#10b981" 
            strokeWidth={2}
            dot={false}
            name="price"
          />
          <Line 
            yAxisId="indicator"
            type="monotone" 
            dataKey="indicator" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={false}
            name="indicator"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
