export interface Indicator {
  id: number;
  title: string;
  value: string;
  description: string;
  trend: 'up' | 'down' | 'stable';
  category: string;
  detailedDescription?: string;
  country?: string;
  unit?: string;
}

export const indicators: Indicator[] = [
  {
    id: 1,
    title: 'Baltic Dry Index',
    value: '1245.0',
    description: 'Global shipping rates as economic indicator',
    trend: 'up',
    category: 'Economic',
    detailedDescription: 'The Baltic Dry Index tracks the cost of shipping raw materials like coal, iron ore, and grain across major shipping routes, serving as a leading economic indicator. Rising values suggest increased global trade activity.',
    country: 'Global',
    unit: 'Index'
  },
  {
    id: 2,
    title: 'Insider Trading Patterns',
    value: '89.2',
    description: 'Corporate insider buying and selling activity',
    trend: 'up',
    category: 'Sentiment',
    detailedDescription: 'Tracks corporate insider buying and selling activity, providing insights into management confidence and potential future performance. High insider buying often signals positive outlook.',
    country: 'United States',
    unit: 'Index'
  },
  {
    id: 3,
    title: 'Consumer Price Index',
    value: '3.2%',
    description: 'Inflation rate and cost of living changes',
    trend: 'up',
    category: 'Economic',
    detailedDescription: 'The Consumer Price Index measures changes in the price level of consumer goods and services purchased by households. It is a key indicator of inflation and economic health.',
    country: 'United States',
    unit: 'Percentage'
  },
  {
    id: 4,
    title: 'Google Search Trends',
    value: '78.3',
    description: 'Public interest and search volume for financial terms',
    trend: 'stable',
    category: 'Behavioral',
    detailedDescription: 'Analyzes search volume for financial terms to gauge public interest and sentiment. Spikes often correlate with market volatility and investor attention.',
    country: 'Global',
    unit: 'Index'
  }
];
