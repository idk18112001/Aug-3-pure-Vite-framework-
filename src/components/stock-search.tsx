import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Search, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { getStockPrice, analyzeStock, type StockPrice, type MarketAnalysis } from '../services/api';
import { useToast } from '../hooks/use-toast';

interface StockSearchProps {
  selectedIndicators: string[];
}

export default function StockSearch({ selectedIndicators }: StockSearchProps) {
  const [symbol, setSymbol] = useState('');
  const [loading, setLoading] = useState(false);
  const [stockData, setStockData] = useState<StockPrice | null>(null);
  const [analysis, setAnalysis] = useState<MarketAnalysis | null>(null);
  const { toast } = useToast();

  const searchStock = async () => {
    if (!symbol.trim()) {
      toast({
        title: 'Enter Stock Symbol',
        description: 'Please enter a valid stock symbol (e.g., AAPL, TSLA)',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      // Get stock price and analysis
      const [priceData, analysisData] = await Promise.all([
        getStockPrice(symbol.trim().toUpperCase()),
        analyzeStock(symbol.trim().toUpperCase(), selectedIndicators)
      ]);

      setStockData(priceData);
      setAnalysis(analysisData);

      toast({
        title: 'Analysis Complete',
        description: `Successfully analyzed ${symbol.toUpperCase()}`,
      });
    } catch (error) {
      console.error('Error searching stock:', error);
      toast({
        title: 'Search Failed',
        description: error instanceof Error ? error.message : 'Failed to fetch stock data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchStock();
    }
  };

  const getProbabilityColor = (type: 'bullish' | 'bearish' | 'neutral', value: number) => {
    if (value < 25) return 'bg-gray-100 text-gray-600';
    if (type === 'bullish') return value > 50 ? 'bg-green-100 text-green-700' : 'bg-green-50 text-green-600';
    if (type === 'bearish') return value > 50 ? 'bg-red-100 text-red-700' : 'bg-red-50 text-red-600';
    return 'bg-yellow-100 text-yellow-700';
  };

  const getProbabilityIcon = (type: 'bullish' | 'bearish' | 'neutral') => {
    if (type === 'bullish') return <TrendingUp className="w-4 h-4" />;
    if (type === 'bearish') return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Search Interface */}
      <Card className="bg-navy/30 border-warm-white/20">
        <CardHeader>
          <CardTitle className="text-warm-white flex items-center gap-2">
            <Search className="w-5 h-5" />
            Stock Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter stock symbol (e.g., AAPL, TSLA)"
              className="flex-1 bg-warm-white/10 border-warm-white/30 text-warm-white placeholder-warm-white/50"
            />
            <Button 
              onClick={searchStock}
              disabled={loading}
              className="bg-teal hover:bg-teal/80 text-navy"
            >
              {loading ? 'Analyzing...' : 'Analyze'}
            </Button>
          </div>
          
          {selectedIndicators.length > 0 && (
            <div className="mt-3">
              <p className="text-sm text-warm-white/70 mb-2">Analysis based on:</p>
              <div className="flex flex-wrap gap-2">
                {selectedIndicators.map((indicator) => (
                  <Badge key={indicator} variant="outline" className="text-xs">
                    {indicator.replace('-', ' ').toUpperCase()}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stock Price Display */}
      {stockData && (
        <Card className="bg-navy/30 border-warm-white/20">
          <CardHeader>
            <CardTitle className="text-warm-white">{stockData.symbol}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-warm-white/70">Current Price</p>
                <p className="text-2xl font-bold text-warm-white">${stockData.price.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-warm-white/70">Change</p>
                <p className={`text-lg font-semibold ${stockData.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {stockData.change >= 0 ? '+' : ''}${stockData.change.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-warm-white/70">Change %</p>
                <p className={`text-lg font-semibold ${stockData.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {stockData.changePercent >= 0 ? '+' : ''}{stockData.changePercent.toFixed(2)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-warm-white/70">Volume</p>
                <p className="text-lg font-semibold text-warm-white">
                  {(stockData.volume / 1000000).toFixed(1)}M
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Market Analysis */}
      {analysis && (
        <Card className="bg-navy/30 border-warm-white/20">
          <CardHeader>
            <CardTitle className="text-warm-white">Market Outlook</CardTitle>
            <p className="text-sm text-warm-white/70">
              Confidence Level: {analysis.confidence}%
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Probability Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`p-4 rounded-lg ${getProbabilityColor('bullish', analysis.bullishProbability)}`}>
                <div className="flex items-center gap-2 mb-2">
                  {getProbabilityIcon('bullish')}
                  <span className="font-semibold">Bullish Probability</span>
                </div>
                <div className="text-2xl font-bold">{analysis.bullishProbability}%</div>
              </div>
              
              <div className={`p-4 rounded-lg ${getProbabilityColor('bearish', analysis.bearishProbability)}`}>
                <div className="flex items-center gap-2 mb-2">
                  {getProbabilityIcon('bearish')}
                  <span className="font-semibold">Bearish Probability</span>
                </div>
                <div className="text-2xl font-bold">{analysis.bearishProbability}%</div>
              </div>
              
              <div className={`p-4 rounded-lg ${getProbabilityColor('neutral', analysis.rangeBoundProbability)}`}>
                <div className="flex items-center gap-2 mb-2">
                  {getProbabilityIcon('neutral')}
                  <span className="font-semibold">Range-bound Probability</span>
                </div>
                <div className="text-2xl font-bold">{analysis.rangeBoundProbability}%</div>
              </div>
            </div>

            {/* Analysis Reasoning */}
            <div>
              <h4 className="text-warm-white font-semibold mb-3">Analysis Reasoning</h4>
              <ul className="space-y-2">
                {analysis.reasoning.map((reason, index) => (
                  <li key={index} className="text-warm-white/80 text-sm flex items-start gap-2">
                    <span className="text-teal">•</span>
                    {reason}
                  </li>
                ))}
              </ul>
            </div>

            {/* Indicator Signals */}
            {Object.keys(analysis.indicatorSignals).length > 0 && (
              <div>
                <h4 className="text-warm-white font-semibold mb-3">Indicator Signals</h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(analysis.indicatorSignals).map(([indicator, signal]) => (
                    <Badge 
                      key={indicator}
                      className={`
                        ${signal === 'bullish' ? 'bg-green-100 text-green-700' : ''}
                        ${signal === 'bearish' ? 'bg-red-100 text-red-700' : ''}
                        ${signal === 'neutral' ? 'bg-gray-100 text-gray-600' : ''}
                      `}
                    >
                      {indicator.toUpperCase()}: {signal.toUpperCase()}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
