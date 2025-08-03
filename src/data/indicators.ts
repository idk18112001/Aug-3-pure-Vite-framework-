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
    title: 'VIX Fear Index',
    value: '22.5',
    description: 'Market volatility and fear sentiment analysis',
    trend: 'stable',
    category: 'Sentiment',
    detailedDescription: 'The VIX, or Volatility Index, measures the market\'s expectation of 30-day volatility. Often called the "fear gauge," it spikes during market uncertainty and drops during calm periods. Values above 30 typically indicate high fear, while below 20 suggests complacency.',
    country: 'United States',
    unit: 'Index'
  },
  {
    id: 2,
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
    id: 3,
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
    id: 4,
    title: 'Consumer Confidence',
    value: '105.3',
    description: 'Consumer confidence index and sentiment',
    trend: 'stable',
    category: 'Economic',
    detailedDescription: 'Measures consumer attitudes regarding economic conditions and their willingness to spend money. Values above 100 indicate optimism, below 100 suggest pessimism.',
    country: 'United States',
    unit: 'Index'
  },
  {
    id: 5,
    title: 'Manufacturing PMI',
    value: '52.1',
    description: 'Manufacturing purchasing managers index',
    trend: 'up',
    category: 'Economic',
    detailedDescription: 'The Manufacturing Purchasing Managers Index indicates the economic health of the manufacturing sector. Values above 50 indicate expansion, below 50 suggest contraction.',
    country: 'United States',
    unit: 'Index'
  },
  {
    id: 6,
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
