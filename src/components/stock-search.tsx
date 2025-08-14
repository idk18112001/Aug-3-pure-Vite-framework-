import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { analyzeStock } from '../services/api';
import { useToast } from '../hooks/use-toast';

interface MarketAnalysis {
  symbol: string;
  bullishProbability: number;
  bearishProbability: number;
  rangeBoundProbability: number;
  confidence: number;
  reasoning: string;
  indicators: {
    cpi: number;
    crudeOil: number;
    insiderActivity: string;
    sentiment: string;
  };
}

interface StockSearchProps {
  indicators?: string[];
  onSymbolAnalyzed?: (symbol: string) => void;
}

export default function StockSearch({ indicators = ['cpi', 'insider-activity'], onSymbolAnalyzed }: StockSearchProps) {
  const [symbol, setSymbol] = useState('');
  const [analysis, setAnalysis] = useState<MarketAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!symbol.trim()) {
      toast({
        title: "Error",
        description: "Please enter a stock symbol",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const result = await analyzeStock(symbol.trim().toUpperCase());
      setAnalysis(result);
      
      // Notify parent component about the analyzed symbol
      if (onSymbolAnalyzed) {
        onSymbolAnalyzed(result.symbol);
      }
      
      toast({
        title: "Analysis Complete",
        description: `Successfully analyzed ${result.symbol}`,
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze stock. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAnalyze();
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="flex gap-3">
        <Input
          type="text"
          placeholder="Enter stock symbol (e.g., AAPL, TSLA, NVDA)"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 bg-white/10 border-teal/30 text-white placeholder:text-white/60 focus:border-teal focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-teal/20"
        />
        <Button 
          onClick={handleAnalyze}
          disabled={loading}
          className="bg-teal hover:bg-teal/80 text-navy font-medium px-6"
        >
          {loading ? 'Analyzing...' : 'Analyze'}
        </Button>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-4">
          {/* Probability Cards */}
          <div className="grid grid-cols-3 gap-4">
            {/* Bullish Card */}
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">
                {analysis.bullishProbability}%
              </div>
              <div className="text-sm text-green-300">Bullish</div>
              <div className="w-full bg-green-500/20 rounded-full h-2 mt-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${analysis.bullishProbability}%` }}
                />
              </div>
            </div>

            {/* Bearish Card */}
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-red-400 mb-1">
                {analysis.bearishProbability}%
              </div>
              <div className="text-sm text-red-300">Bearish</div>
              <div className="w-full bg-red-500/20 rounded-full h-2 mt-2">
                <div 
                  className="bg-red-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${analysis.bearishProbability}%` }}
                />
              </div>
            </div>

            {/* Range-Bound Card */}
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-1">
                {analysis.rangeBoundProbability}%
              </div>
              <div className="text-sm text-yellow-300">Range-Bound</div>
              <div className="w-full bg-yellow-500/20 rounded-full h-2 mt-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${analysis.rangeBoundProbability}%` }}
                />
              </div>
            </div>
          </div>

          {/* Confidence Score */}
          <div className="bg-teal/5 border border-teal/10 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-warm-white/80">Confidence Score</span>
              <span className="text-lg font-semibold text-teal">{analysis.confidence}%</span>
            </div>
            <div className="w-full bg-teal/20 rounded-full h-2">
              <div 
                className="bg-teal h-2 rounded-full transition-all duration-500"
                style={{ width: `${analysis.confidence}%` }}
              />
            </div>
          </div>

          {/* Analysis Reasoning */}
          <div className="bg-navy/30 border border-teal/10 rounded-xl p-4">
            <h4 className="text-lg font-medium text-warm-white mb-3">Analysis Reasoning</h4>
            <p className="text-warm-white/80 leading-relaxed">{analysis.reasoning}</p>
          </div>

          {/* Key Indicators */}
          <div className="bg-navy/30 border border-teal/10 rounded-xl p-4">
            <h4 className="text-lg font-medium text-warm-white mb-3">Key Indicators</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-warm-white/60">CPI Index:</span>
                <span className="text-warm-white ml-2">{analysis.indicators.cpi.toFixed(1)}</span>
              </div>
              <div>
                <span className="text-warm-white/60">Crude Oil:</span>
                <span className="text-warm-white ml-2">${analysis.indicators.crudeOil.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-warm-white/60">Insider Activity:</span>
                <span className={`ml-2 capitalize ${
                  analysis.indicators.insiderActivity === 'bullish' ? 'text-green-400' :
                  analysis.indicators.insiderActivity === 'bearish' ? 'text-red-400' :
                  'text-yellow-400'
                }`}>
                  {analysis.indicators.insiderActivity}
                </span>
              </div>
              <div>
                <span className="text-warm-white/60">Search Sentiment:</span>
                <span className={`ml-2 capitalize ${
                  analysis.indicators.sentiment === 'rising' ? 'text-green-400' :
                  analysis.indicators.sentiment === 'declining' ? 'text-red-400' :
                  'text-yellow-400'
                }`}>
                  {analysis.indicators.sentiment}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
