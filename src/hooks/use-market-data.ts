import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { alphaVantageAPI, coinGeckoAPI, dataCache, StockData, EconomicIndicator } from '@/lib/api';

// Hook for fetching stock data
export function useStockData(symbol: string) {
  return useQuery({
    queryKey: ['stock', symbol],
    queryFn: () => dataCache.get(
      `stock-${symbol}`, 
      () => alphaVantageAPI.getQuote(symbol),
      5 // Cache for 5 minutes
    ),
    enabled: !!symbol,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook for fetching multiple stocks
export function useMultipleStocks(symbols: string[]) {
  return useQuery({
    queryKey: ['stocks', symbols],
    queryFn: async () => {
      const promises = symbols.map(symbol => 
        dataCache.get(`stock-${symbol}`, () => alphaVantageAPI.getQuote(symbol), 5)
      );
      const results = await Promise.all(promises);
      return results.filter(Boolean); // Remove null results
    },
    enabled: symbols.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook for economic indicators
export function useEconomicIndicator(indicator: string) {
  return useQuery({
    queryKey: ['economic', indicator],
    queryFn: () => dataCache.get(
      `economic-${indicator}`, 
      () => alphaVantageAPI.getEconomicIndicator(indicator),
      60 // Cache for 1 hour
    ),
    enabled: !!indicator,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}

// Hook for crypto data
export function useCryptoData(limit: number = 10) {
  return useQuery({
    queryKey: ['crypto', limit],
    queryFn: () => dataCache.get(
      `crypto-top-${limit}`, 
      () => coinGeckoAPI.getTopCryptos(limit),
      10 // Cache for 10 minutes
    ),
    staleTime: 10 * 60 * 1000,
  });
}

// Hook for real-time market summary
export function useMarketSummary() {
  const majorIndices = ['SPY', 'QQQ', 'DIA', 'IWM']; // ETFs tracking major indices
  
  return useQuery({
    queryKey: ['market-summary'],
    queryFn: async () => {
      const promises = majorIndices.map(symbol => 
        alphaVantageAPI.getQuote(symbol)
      );
      const results = await Promise.all(promises);
      return results.filter(Boolean).map((stock, index) => ({
        ...stock,
        name: getIndexName(majorIndices[index])
      }));
    },
    staleTime: 2 * 60 * 1000, // 2 minutes for market summary
    refetchInterval: 2 * 60 * 1000, // Auto-refetch every 2 minutes during market hours
  });
}

// Helper function to get friendly index names
function getIndexName(symbol: string): string {
  const names: Record<string, string> = {
    'SPY': 'S&P 500',
    'QQQ': 'NASDAQ 100',
    'DIA': 'Dow Jones',
    'IWM': 'Russell 2000'
  };
  return names[symbol] || symbol;
}

// Hook for custom indicators (you can expand this)
export function useCustomIndicators() {
  const [indicators, setIndicators] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCustomData = async () => {
      setLoading(true);
      try {
        // Example: Fetch VIX (volatility index), treasury rates, etc.
        const vixData = await alphaVantageAPI.getQuote('^VIX');
        const goldData = await alphaVantageAPI.getQuote('GLD');
        
        setIndicators([
          { name: 'VIX (Fear Index)', data: vixData },
          { name: 'Gold (GLD)', data: goldData },
        ].filter(item => item.data)); // Remove failed fetches
      } catch (error) {
        console.error('Error fetching custom indicators:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomData();
  }, []);

  return { indicators, loading };
}

// Hook for sector performance
export function useSectorPerformance() {
  const sectorETFs = [
    { symbol: 'XLF', name: 'Financials' },
    { symbol: 'XLT', name: 'Technology' },
    { symbol: 'XLE', name: 'Energy' },
    { symbol: 'XLH', name: 'Healthcare' },
    { symbol: 'XLI', name: 'Industrials' },
    { symbol: 'XLU', name: 'Utilities' },
    { symbol: 'XLB', name: 'Materials' },
    { symbol: 'XLP', name: 'Consumer Staples' },
    { symbol: 'XLY', name: 'Consumer Discretionary' },
  ];

  return useQuery({
    queryKey: ['sectors'],
    queryFn: async () => {
      const promises = sectorETFs.map(async sector => {
        const data = await alphaVantageAPI.getQuote(sector.symbol);
        return data ? { ...sector, data } : null;
      });
      const results = await Promise.all(promises);
      return results.filter(Boolean);
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}
