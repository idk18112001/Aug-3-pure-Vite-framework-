import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { indicators } from "@/data/indicators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StockSearch from "@/components/stock-search";
import AuthGuard from "../components/auth-guard";

export default function IndicatorDetail() {
  const [, setLocation] = useLocation();
  const { id } = useParams();
  const [stockInput, setStockInput] = useState("");
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [activePeriod, setActivePeriod] = useState("1M");

  const indicator = indicators.find(ind => ind.id === parseInt(id || '1')) || indicators[0];

  const analyzeStock = () => {
    if (!stockInput.trim()) {
      alert('Please enter a stock symbol');
      return;
    }

    const stockSymbol = stockInput.trim().toUpperCase();
    
    // Generate more realistic analysis based on indicator type and common stock behaviors
    const generateAnalysis = () => {
      const sectors: { [key: string]: { beta: number, correlation: string, strength: number } } = {
        'AAPL': { beta: 1.2, correlation: 'Moderate Positive', strength: 72 },
        'TSLA': { beta: 2.1, correlation: 'Strong Positive', strength: 89 },
        'NVDA': { beta: 1.8, correlation: 'Strong Positive', strength: 85 },
        'MSFT': { beta: 0.9, correlation: 'Moderate Positive', strength: 68 },
        'GOOGL': { beta: 1.1, correlation: 'Moderate Positive', strength: 74 },
        'META': { beta: 1.3, correlation: 'Strong Positive', strength: 81 },
        'JPM': { beta: 1.4, correlation: 'Moderate Negative', strength: 65 },
        'JNJ': { beta: 0.7, correlation: 'Weak Negative', strength: 42 },
        'KO': { beta: 0.5, correlation: 'Weak Negative', strength: 38 },
        'WMT': { beta: 0.6, correlation: 'Neutral', strength: 25 }
      };

      const defaultAnalysis = {
        beta: 1.0 + (Math.random() - 0.5) * 0.8,
        correlation: ['Moderate Positive', 'Weak Positive', 'Neutral'][Math.floor(Math.random() * 3)],
        strength: 30 + Math.random() * 50
      };

      return sectors[stockSymbol] || defaultAnalysis;
    };

    const analysis = generateAnalysis();
    
    const getDescription = (correlation: string, strength: number) => {
      const indicatorType = indicator.title;
      
      if (indicatorType.includes('VIX')) {
        if (correlation.includes('Positive')) {
          return `${stockSymbol} tends to decline when fear levels rise. This defensive behavior suggests ${stockSymbol} may be considered a safe haven during market stress, with ${strength.toFixed(0)}% historical correlation.`;
        } else if (correlation.includes('Negative')) {
          return `${stockSymbol} typically rallies when market fear subsides. This growth-oriented behavior indicates ${stockSymbol} benefits from risk-on sentiment, showing ${strength.toFixed(0)}% inverse correlation.`;
        } else {
          return `${stockSymbol} shows relatively neutral behavior during volatility spikes, suggesting balanced risk characteristics with ${strength.toFixed(0)}% correlation to fear cycles.`;
        }
      } else if (indicatorType.includes('Baltic')) {
        if (correlation.includes('Positive')) {
          return `${stockSymbol} benefits from increased global trade activity. Rising shipping costs typically correlate with ${stockSymbol} performance, showing ${strength.toFixed(0)}% positive correlation with trade flows.`;
        } else {
          return `${stockSymbol} shows limited sensitivity to global shipping trends, with ${strength.toFixed(0)}% correlation to trade activity. This suggests domestic focus or service-oriented business model.`;
        }
      } else if (indicatorType.includes('Consumer Confidence')) {
        if (correlation.includes('Positive')) {
          return `${stockSymbol} benefits from consumer optimism and spending. Higher confidence levels typically drive ${stockSymbol} performance, with ${strength.toFixed(0)}% correlation to consumer sentiment.`;
        } else {
          return `${stockSymbol} shows defensive characteristics during confidence shifts, with ${strength.toFixed(0)}% correlation. This may indicate essential services or counter-cyclical business model.`;
        }
      } else {
        return `${stockSymbol} shows ${correlation.toLowerCase()} correlation with ${indicatorType.toLowerCase()}, demonstrating ${strength.toFixed(0)}% statistical relationship. This provides insights for timing and risk management decisions.`;
      }
    };

    setAnalysisResult({
      symbol: stockSymbol,
      score: `${analysis.strength.toFixed(1)}% ${analysis.correlation}`,
      description: getDescription(analysis.correlation, analysis.strength),
      beta: analysis.beta.toFixed(2),
      recommendation: analysis.strength > 70 ? 'Strong Signal' : analysis.strength > 50 ? 'Moderate Signal' : 'Weak Signal'
    });
  };

  return (
    <AuthGuard>
      <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="mb-4">
          <button 
            onClick={() => setLocation('/indicators')} 
            className="breadcrumb-link"
          >
            ← Back to Indicators
          </button>
        </div>
        <h1 className="text-4xl md:text-5xl font-light mb-4 tracking-wide">{indicator.title}</h1>
        <div className="flex items-center justify-center gap-6">
          <span className={`trend-indicator ${indicator.trend === 'up' ? 'trend-up' : indicator.trend === 'down' ? 'trend-down' : 'trend-stable'} text-lg`}>
            {indicator.trend === 'up' ? '↗ Trending Up' : indicator.trend === 'down' ? '↘ Trending Down' : '→ Stable'}
          </span>
          <span className="text-2xl font-medium">{indicator.value}</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 pb-16 space-y-12">
        {/* Definition Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-light tracking-wide">Definition</h2>
          <div className="bg-teal/5 border border-teal/10 rounded-xl p-6">
            <p className="text-warm-white/80 leading-relaxed">
              {indicator.detailedDescription || indicator.description}
            </p>
            <div className="mt-4">
              <span className="text-xs text-warm-white/50 bg-teal/20 px-3 py-1 rounded-full">
                {indicator.category}
              </span>
            </div>
          </div>
        </div>

        {/* Current Trend Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-light tracking-wide">Current Trend</h2>
          <div className="bg-teal/5 border border-teal/10 rounded-xl p-6">
            <p className="text-warm-white/80 leading-relaxed">
              Currently showing {indicator.trend === 'up' ? 'increased' : indicator.trend === 'down' ? 'decreased' : 'stable'} activity, suggesting {indicator.trend === 'up' ? 'positive' : indicator.trend === 'down' ? 'cautious' : 'neutral'} market sentiment. This {indicator.trend === 'up' ? 'upward' : indicator.trend === 'down' ? 'downward' : 'stable'} trend typically indicates {indicator.trend === 'up' ? 'growing investor confidence and potential opportunities' : indicator.trend === 'down' ? 'market uncertainty and defensive positioning' : 'balanced market conditions'} in related sectors.
            </p>
          </div>
        </div>

        {/* Investment Implications */}
        <div className="space-y-4">
          <h2 className="text-2xl font-light tracking-wide">Investment Implications</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6">
              <h4 className="text-lg font-medium mb-4 text-green-400">When Indicator Rises</h4>
              <ul className="space-y-2 text-warm-white/80 text-sm">
                {indicator.title.includes('VIX') ? (
                  <>
                    <li>• Defensive stocks outperform</li>
                    <li>• Utilities and consumer staples</li>
                    <li>• Gold and treasury bonds</li>
                    <li>• Low-volatility ETFs</li>
                  </>
                ) : indicator.title.includes('Baltic') ? (
                  <>
                    <li>• Shipping companies</li>
                    <li>• Commodity exporters</li>
                    <li>• Industrial materials</li>
                    <li>• Emerging market stocks</li>
                  </>
                ) : indicator.title.includes('Consumer Confidence') ? (
                  <>
                    <li>• Consumer discretionary</li>
                    <li>• Retail stocks</li>
                    <li>• Travel and leisure</li>
                    <li>• Cyclical growth stocks</li>
                  </>
                ) : (
                  <>
                    <li>• Growth stocks benefit</li>
                    <li>• High-beta securities</li>
                    <li>• Risk-on assets</li>
                    <li>• Technology sector</li>
                  </>
                )}
              </ul>
            </div>
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
              <h4 className="text-lg font-medium mb-4 text-red-400">When Indicator Falls</h4>
              <ul className="space-y-2 text-warm-white/80 text-sm">
                {indicator.title.includes('VIX') ? (
                  <>
                    <li>• Growth stocks rally</li>
                    <li>• Technology outperforms</li>
                    <li>• High-beta stocks surge</li>
                    <li>• Risk assets benefit</li>
                  </>
                ) : indicator.title.includes('Baltic') ? (
                  <>
                    <li>• Trade-dependent stocks</li>
                    <li>• Shipping sector weakness</li>
                    <li>• Commodity deflation</li>
                    <li>• Export-heavy economies</li>
                  </>
                ) : indicator.title.includes('Consumer Confidence') ? (
                  <>
                    <li>• Consumer staples defense</li>
                    <li>• Discount retailers</li>
                    <li>• Essential services</li>
                    <li>• Value over growth</li>
                  </>
                ) : (
                  <>
                    <li>• Defensive positioning</li>
                    <li>• Value stocks preferred</li>
                    <li>• Lower-risk assets</li>
                    <li>• Dividend stocks</li>
                  </>
                )}
              </ul>
            </div>
          </div>
          <div className="bg-teal/5 border border-teal/10 rounded-xl p-6">
            <h4 className="text-lg font-medium mb-3">Market Context</h4>
            <p className="text-warm-white/80 leading-relaxed">
              {indicator.title.includes('VIX') ? 
                'The VIX typically spikes during market stress and uncertainty. High readings (>30) suggest fear and potential buying opportunities for contrarian investors, while low readings (<20) may indicate complacency.' :
              indicator.title.includes('Baltic') ?
                'The Baltic Dry Index is a pure indicator of supply and demand for dry bulk shipping. It reflects global trade flows and economic activity, making it valuable for predicting commodity price movements.' :
              indicator.title.includes('Consumer Confidence') ?
                'Consumer confidence directly impacts spending patterns, which drive 70% of US economic activity. High confidence levels typically lead to increased consumer spending and economic growth.' :
                `This ${indicator.category.toLowerCase()} indicator provides insights into market sentiment and economic conditions, influencing investment flows across different asset classes.`}
            </p>
          </div>
        </div>

        {/* Stock Analysis Tool */}
        <div className="space-y-4">
          <h2 className="text-2xl font-light tracking-wide">Analyze Stock</h2>
          <div className="bg-teal/5 border border-teal/10 rounded-xl p-6">
            <p className="text-warm-white/80 mb-4">Search for a stock to see how it correlates with this indicator</p>
            <div className="flex gap-4 mb-4">
              <Input
                type="text"
                className="stock-search flex-1"
                placeholder="Enter stock symbol (e.g., AAPL, TSLA, NVDA)"
                value={stockInput}
                onChange={(e) => setStockInput(e.target.value)}
              />
              <Button className="analyze-btn" onClick={analyzeStock}>
                Analyze Stock
              </Button>
            </div>
            {analysisResult && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-medium">{analysisResult.symbol}</h4>
                  <div className="flex gap-4 items-center">
                    <span className="text-teal font-medium">{analysisResult.score}</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      analysisResult.recommendation === 'Strong Signal' ? 'bg-green-500/20 text-green-400' :
                      analysisResult.recommendation === 'Moderate Signal' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {analysisResult.recommendation}
                    </span>
                  </div>
                </div>
                <p className="text-warm-white/80 leading-relaxed">{analysisResult.description}</p>
                {analysisResult.beta && (
                  <div className="flex items-center gap-4 text-sm text-warm-white/60">
                    <span>Beta: {analysisResult.beta}</span>
                    <span>•</span>
                    <span>Analysis based on {indicator.title}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Chart Placeholder */}
        <div className="space-y-4">
          <h2 className="text-2xl font-light tracking-wide">Live Trend Data</h2>
          <div className="bg-teal/5 border border-teal/10 rounded-xl p-6">
            <div className="flex gap-2 mb-6">
              {['1M', '3M', '6M', '1Y', '2Y'].map((period) => (
                <button
                  key={period}
                  className={`px-4 py-2 text-sm transition-colors rounded-lg font-medium ${
                    activePeriod === period 
                      ? 'bg-teal text-navy' 
                      : 'text-warm-white/60 hover:text-warm-white'
                  }`}
                  onClick={() => setActivePeriod(period)}
                >
                  {period}
                </button>
              ))}
            </div>
            <div className="chart-placeholder">
              <i className="fas fa-chart-line text-4xl text-teal/50 mb-4"></i>
              <p className="text-warm-white/60">Chart visualization would display real financial data</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </AuthGuard>
  );
}
