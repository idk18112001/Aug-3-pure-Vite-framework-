import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMarketSummary, useStockData, useCryptoData } from '@/hooks/use-market-data';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';

interface MarketDashboardProps {
  className?: string;
}

export default function MarketDashboard({ className }: MarketDashboardProps) {
  const { data: marketSummary, isLoading: marketLoading } = useMarketSummary();
  const { data: cryptoData, isLoading: cryptoLoading } = useCryptoData(5);
  const { data: spyData } = useStockData('SPY');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(price);
  };

  const formatPercent = (percent: number) => {
    const formatted = percent.toFixed(2);
    return `${percent > 0 ? '+' : ''}${formatted}%`;
  };

  if (marketLoading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-300 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Market Indices */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <Activity className="mr-2" />
          Market Indices
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {marketSummary?.map((index) => (
            <Card key={index.symbol} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {index.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{formatPrice(index.price)}</p>
                    <div className={`flex items-center text-sm ${
                      index.change >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {index.change >= 0 ? (
                        <TrendingUp className="w-4 h-4 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 mr-1" />
                      )}
                      {formatPercent(index.changePercent)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Cryptocurrency */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <DollarSign className="mr-2" />
          Top Cryptocurrencies
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {cryptoData?.slice(0, 5).map((crypto: any) => (
            <Card key={crypto.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                  <img 
                    src={crypto.image} 
                    alt={crypto.name} 
                    className="w-5 h-5 mr-2"
                  />
                  {crypto.symbol?.toUpperCase()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <p className="text-xl font-bold">
                    {formatPrice(crypto.current_price)}
                  </p>
                  <div className={`flex items-center text-sm ${
                    crypto.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {crypto.price_change_percentage_24h >= 0 ? (
                      <TrendingUp className="w-4 h-4 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 mr-1" />
                    )}
                    {formatPercent(crypto.price_change_percentage_24h)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      {spyData && (
        <Card>
          <CardHeader>
            <CardTitle>Market Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-600">S&P 500</p>
                <p className="text-2xl font-bold">{formatPrice(spyData.price)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Change</p>
                <p className={`text-2xl font-bold ${
                  spyData.change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatPercent(spyData.changePercent)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Volume</p>
                <p className="text-2xl font-bold">
                  {(spyData.volume / 1000000).toFixed(1)}M
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Last Updated</p>
                <p className="text-sm">{spyData.timestamp}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
