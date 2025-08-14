export interface Metric {
  id: number;
  title: string;
  value: string;
  change: string;
  description: string;
  trend: 'up' | 'down' | 'stable';
  detailedDescription?: string;
  hasToggle?: boolean;
  toggleOptions?: string[];
}

export const metrics: Metric[] = [
  {
    id: 1,
    title: 'Insider Activity',
    value: '89.2',
    change: '+5.6%',
    description: 'Corporate insider trading patterns and activity levels showing internal company perspectives',
    trend: 'up',
    detailedDescription: 'Corporate insider trading patterns and activity levels showing internal company perspectives. Insider buying often indicates positive internal outlook while selling may suggest profit-taking or personal liquidity needs. High insider buying activity typically correlates with future stock performance.'
  },
  {
    id: 2,
    title: 'Bulk/Block Deals',
    value: '1,247',
    change: '-1.8%',
    description: 'Large block transactions and institutional activity indicating major investor sentiment shifts',
    trend: 'down',
    detailedDescription: 'Large block transactions and institutional activity indicating major investor sentiment shifts. High bulk dealing activity can signal significant institutional interest or divestment, often preceding major price movements. These deals provide insights into institutional investor behavior.'
  },
  {
    id: 3,
    title: 'NSE F&O Data - Short Interest % vs Long Interest %',
    value: '42% / 58%',
    change: '+2.3%',
    description: 'Futures and Options positioning showing market sentiment through short vs long interest ratio',
    trend: 'up',
    detailedDescription: 'Futures and Options positioning showing market sentiment through short vs long interest ratio. Higher long interest suggests bullish sentiment while increased short interest indicates bearish outlook. This ratio helps gauge institutional and retail investor positioning.',
    hasToggle: true,
    toggleOptions: ['Short Interest %', 'Long Interest %', 'Net Position']
  }
];
