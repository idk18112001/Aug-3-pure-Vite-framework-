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
    title: 'Promoter Holding Change',
    value: '65.4%',
    change: '+2.1%',
    description: 'Changes in promoter shareholding patterns indicating management confidence and strategic decisions',
    trend: 'up',
    detailedDescription: 'Changes in promoter shareholding patterns indicating management confidence and strategic decisions. Higher promoter holdings typically suggest confidence in the company\'s future prospects, while reductions may indicate funding needs or diversification strategies.'
  },
  {
    id: 2,
    title: 'Bulk Dealings',
    value: '1247',
    change: '-1.8%',
    description: 'Large block transactions and institutional activity indicating major investor sentiment shifts',
    trend: 'down',
    detailedDescription: 'Large block transactions and institutional activity indicating major investor sentiment shifts. High bulk dealing activity can signal significant institutional interest or divestment, often preceding major price movements.'
  },
  {
    id: 3,
    title: 'Insider Activity',
    value: '89.2',
    change: '+5.6%',
    description: 'Corporate insider trading patterns and activity levels showing internal company perspectives',
    trend: 'up',
    detailedDescription: 'Corporate insider trading patterns and activity levels showing internal company perspectives. Insider buying often indicates positive internal outlook while selling may suggest profit-taking or personal liquidity needs.'
  },
  {
    id: 4,
    title: 'Stock Trading Volume Average',
    value: '1542.8M',
    change: '+3.4%',
    description: 'Trading volume indicator showing market liquidity and interest levels',
    trend: 'up',
    detailedDescription: 'Trading volume indicator showing market liquidity and interest levels. Higher volumes typically indicate increased market interest and better price discovery, while lower volumes may suggest reduced liquidity.',
    hasToggle: true,
    toggleOptions: ['50 Day Average', '200 Day Average']
  }
];
