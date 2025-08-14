import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { indicators } from "@/data/indicators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StockSearch from "@/components/stock-search";
import IndicatorChart from "@/components/indicator-chart";
import AuthGuard from "../components/auth-guard";

export default function IndicatorDetail() {
  const [, setLocation] = useLocation();
  const { id } = useParams();
  const [activePeriod, setActivePeriod] = useState("1M");
  const [analyzedSymbol, setAnalyzedSymbol] = useState<string>("");

  const indicator = indicators.find(ind => ind.id === parseInt(id || '1')) || indicators[0];
  
  // Get indicator-specific analysis parameters
  const getIndicatorAnalysisParams = (indicatorId: number): string[] => {
    switch (indicatorId) {
      case 1: // Baltic Dry Index
        return ['crude-oil', 'economic-data'];
      case 2: // Insider Trading Patterns
        return ['insider-activity'];
      case 3: // Consumer Price Index
        return ['cpi', 'economic-data'];
      case 4: // Google Search Trends
        return ['sentiment-analysis'];
      default:
        return ['cpi', 'insider-activity'];
    }
  };

  const selectedIndicators = getIndicatorAnalysisParams(indicator.id);

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
          <h2 className="text-2xl font-light tracking-wide">Real-Time Stock Analysis</h2>
          <div className="bg-teal/5 border border-teal/10 rounded-xl p-6">
            <p className="text-warm-white/80 mb-6">
              Analyze any stock in real-time using our comprehensive API integration. 
              Get bullish/bearish probabilities based on {indicator.title.toLowerCase()} and other market indicators.
            </p>
            <StockSearch 
              indicators={selectedIndicators} 
              onSymbolAnalyzed={setAnalyzedSymbol}
            />
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
            <IndicatorChart 
              symbol={analyzedSymbol}
              indicatorName={indicator.title}
              period={activePeriod}
            />
          </div>
        </div>
      </div>
    </div>
    </AuthGuard>
  );
}
