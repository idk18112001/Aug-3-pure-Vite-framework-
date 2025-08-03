import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { metrics } from "@/data/metrics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function MetricDetail() {
  const [, setLocation] = useLocation();
  const { id } = useParams();
  const [stockInput, setStockInput] = useState("");
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [activePeriod, setActivePeriod] = useState("1M");
  const [activeToggle, setActiveToggle] = useState("50 Day Average");

  const metric = metrics.find(met => met.id === parseInt(id || '1')) || metrics[0];

  const analyzeStock = () => {
    if (!stockInput.trim()) {
      alert('Please enter a stock symbol');
      return;
    }

    const stockSymbol = stockInput.trim().toUpperCase();
    
    // Generate realistic analysis based on metric type and stock characteristics
    const generateAnalysis = () => {
      const sectors: { [key: string]: { score: number, correlation: string, activity: string } } = {
        'AAPL': { score: 78, correlation: 'Moderate Positive', activity: 'High' },
        'TSLA': { score: 92, correlation: 'Strong Positive', activity: 'Very High' },
        'NVDA': { score: 88, correlation: 'Strong Positive', activity: 'High' },
        'MSFT': { score: 71, correlation: 'Moderate Positive', activity: 'Moderate' },
        'GOOGL': { score: 76, correlation: 'Moderate Positive', activity: 'High' },
        'META': { score: 84, correlation: 'Strong Positive', activity: 'High' },
        'JPM': { score: 65, correlation: 'Moderate Positive', activity: 'Moderate' },
        'JNJ': { score: 45, correlation: 'Weak Positive', activity: 'Low' },
        'KO': { score: 32, correlation: 'Neutral', activity: 'Low' },
        'WMT': { score: 38, correlation: 'Weak Positive', activity: 'Low' }
      };

      const defaultAnalysis = {
        score: 40 + Math.random() * 45,
        correlation: ['Moderate Positive', 'Weak Positive', 'Neutral'][Math.floor(Math.random() * 3)],
        activity: ['Moderate', 'Low'][Math.floor(Math.random() * 2)]
      };

      return sectors[stockSymbol] || defaultAnalysis;
    };

    const analysis = generateAnalysis();
    
    const getDescription = (correlation: string, score: number, activity: string) => {
      const metricType = metric.title;
      
      if (metricType.includes('Promoter')) {
        if (correlation.includes('Strong')) {
          return `${stockSymbol} shows significant promoter activity patterns with ${score.toFixed(0)}% correlation. Recent promoter holding changes often precede major price movements. Current activity level: ${activity}.`;
        } else if (correlation.includes('Moderate')) {
          return `${stockSymbol} demonstrates moderate promoter engagement with ${score.toFixed(0)}% correlation. Promoter holding changes provide useful signals for investment timing. Activity level: ${activity}.`;
        } else {
          return `${stockSymbol} shows limited promoter holding volatility with ${score.toFixed(0)}% correlation. Stable ownership structure may indicate mature company dynamics. Activity level: ${activity}.`;
        }
      } else if (metricType.includes('Bulk')) {
        if (correlation.includes('Strong')) {
          return `${stockSymbol} frequently experiences significant bulk dealing activity with ${score.toFixed(0)}% correlation. Large block transactions often signal institutional interest changes. Current activity: ${activity}.`;
        } else {
          return `${stockSymbol} shows ${correlation.toLowerCase()} bulk dealing patterns with ${score.toFixed(0)}% correlation. Institutional activity provides insights into smart money positioning. Activity level: ${activity}.`;
        }
      } else if (metricType.includes('Insider')) {
        if (correlation.includes('Strong')) {
          return `${stockSymbol} exhibits high insider trading activity with ${score.toFixed(0)}% correlation. Management transactions often reflect internal outlook and upcoming catalysts. Activity level: ${activity}.`;
        } else {
          return `${stockSymbol} shows ${correlation.toLowerCase()} insider activity patterns with ${score.toFixed(0)}% correlation. Management trading provides moderate signals for investment decisions. Activity level: ${activity}.`;
        }
      } else { // Trading Volume
        const period = activeToggle;
        if (correlation.includes('Strong')) {
          return `${stockSymbol} demonstrates strong volume patterns on ${period.toLowerCase()} basis with ${score.toFixed(0)}% correlation. High trading volumes often precede significant price movements and indicate institutional interest.`;
        } else {
          return `${stockSymbol} shows ${correlation.toLowerCase()} volume correlation with ${score.toFixed(0)}% correlation on ${period.toLowerCase()} basis. Volume analysis provides insights into liquidity and market interest levels.`;
        }
      }
    };

    setAnalysisResult({
      symbol: stockSymbol,
      score: `${analysis.score.toFixed(1)}% ${analysis.correlation}`,
      description: getDescription(analysis.correlation, analysis.score, analysis.activity),
      activity: analysis.activity,
      recommendation: analysis.score > 75 ? 'High Activity' : analysis.score > 55 ? 'Moderate Activity' : 'Low Activity',
      period: metric.hasToggle ? activeToggle : undefined
    });
  };

  const getChangeClass = (change: string) => {
    if (change.startsWith('+')) return 'text-green-400';
    if (change.startsWith('-')) return 'text-red-400';
    return 'text-gray-400';
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="mb-4">
          <button 
            onClick={() => setLocation('/metrics')} 
            className="breadcrumb-link"
          >
            ← Back to Metrics
          </button>
        </div>
        <h1 className="text-4xl md:text-5xl font-light mb-4 tracking-wide">{metric.title}</h1>
        {metric.hasToggle && metric.toggleOptions && (
          <div className="flex justify-center gap-2 mb-6">
            {metric.toggleOptions.map((option) => (
              <button
                key={option}
                className={`px-4 py-2 text-sm transition-colors rounded-lg font-medium ${
                  activeToggle === option 
                    ? 'bg-teal text-navy' 
                    : 'text-warm-white/60 hover:text-warm-white border border-teal/20'
                }`}
                onClick={() => setActiveToggle(option)}
              >
                {option}
              </button>
            ))}
          </div>
        )}
        <div className="flex items-center justify-center gap-6">
          <span className={`trend-indicator ${metric.trend === 'up' ? 'trend-up' : metric.trend === 'down' ? 'trend-down' : 'trend-stable'} text-lg`}>
            {metric.trend === 'up' ? '↗ Trending Up' : metric.trend === 'down' ? '↘ Trending Down' : '→ Stable'}
          </span>
          <span className="text-2xl font-medium">
            {metric.hasToggle ? (activeToggle === "50 Day Average" ? metric.value : "2156.3M") : metric.value}
          </span>
          <span className={`text-lg ${getChangeClass(metric.change)}`}>
            {metric.change}
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 pb-16 space-y-12">
        {/* Definition Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-light tracking-wide">Definition</h2>
          <div className="bg-teal/5 border border-teal/10 rounded-xl p-6">
            <p className="text-warm-white/80 leading-relaxed">
              {metric.detailedDescription || metric.description}
            </p>
          </div>
        </div>

        {/* Current Trend Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-light tracking-wide">Current Trend</h2>
          <div className="bg-teal/5 border border-teal/10 rounded-xl p-6">
            <p className="text-warm-white/80 leading-relaxed">
              Currently showing {metric.trend === 'up' ? 'increased' : metric.trend === 'down' ? 'decreased' : 'stable'} activity with a {metric.change} change. This {metric.trend === 'up' ? 'upward' : metric.trend === 'down' ? 'downward' : 'stable'} movement suggests {metric.trend === 'up' ? 'heightened market participation and potential shifts in investor behavior' : metric.trend === 'down' ? 'reduced activity and cautious market sentiment' : 'balanced market conditions'}.
            </p>
          </div>
        </div>

        {/* Investment Implications */}
        <div className="space-y-4">
          <h2 className="text-2xl font-light tracking-wide">Investment Implications</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6">
              <h4 className="text-lg font-medium mb-4 text-green-400">Positive Signals</h4>
              <ul className="space-y-2 text-warm-white/80 text-sm">
                {metric.title.includes('Promoter') ? (
                  <>
                    <li>• Increased promoter buying</li>
                    <li>• Management confidence</li>
                    <li>• Long-term growth outlook</li>
                    <li>• Aligned stakeholder interests</li>
                  </>
                ) : metric.title.includes('Bulk') ? (
                  <>
                    <li>• Institutional accumulation</li>
                    <li>• Large investor interest</li>
                    <li>• Potential price discovery</li>
                    <li>• Strategic positioning</li>
                  </>
                ) : metric.title.includes('Insider') ? (
                  <>
                    <li>• Management buying activity</li>
                    <li>• Positive internal outlook</li>
                    <li>• Information advantage signals</li>
                    <li>• Leadership confidence</li>
                  </>
                ) : (
                  <>
                    <li>• High liquidity levels</li>
                    <li>• Increased market interest</li>
                    <li>• Better price discovery</li>
                    <li>• Institutional participation</li>
                  </>
                )}
              </ul>
            </div>
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
              <h4 className="text-lg font-medium mb-4 text-red-400">Cautionary Signals</h4>
              <ul className="space-y-2 text-warm-white/80 text-sm">
                {metric.title.includes('Promoter') ? (
                  <>
                    <li>• Promoter stake reduction</li>
                    <li>• Funding requirements</li>
                    <li>• Strategic restructuring</li>
                    <li>• Diversification needs</li>
                  </>
                ) : metric.title.includes('Bulk') ? (
                  <>
                    <li>• Large block selling</li>
                    <li>• Institutional exit</li>
                    <li>• Position unwinding</li>
                    <li>• Liquidity events</li>
                  </>
                ) : metric.title.includes('Insider') ? (
                  <>
                    <li>• Executive selling activity</li>
                    <li>• Personal diversification</li>
                    <li>• Profit-taking behavior</li>
                    <li>• Liquidity requirements</li>
                  </>
                ) : (
                  <>
                    <li>• Low trading volumes</li>
                    <li>• Reduced market interest</li>
                    <li>• Poor price discovery</li>
                    <li>• Limited liquidity</li>
                  </>
                )}
              </ul>
            </div>
          </div>
          <div className="bg-teal/5 border border-teal/10 rounded-xl p-6">
            <h4 className="text-lg font-medium mb-3">Analysis Framework</h4>
            <p className="text-warm-white/80 leading-relaxed">
              {metric.title.includes('Promoter') ? 
                'Promoter holding changes are critical indicators of management confidence. Increasing stakes typically signal positive outlook while reductions may indicate capital needs or strategic shifts. Combined with fundamental analysis, these patterns provide valuable investment insights.' :
              metric.title.includes('Bulk') ?
                'Bulk dealings represent significant institutional activity that can precede major price movements. High activity levels often indicate changing institutional sentiment and potential upcoming catalysts or events affecting stock valuations.' :
              metric.title.includes('Insider') ?
                'Insider trading patterns provide unique insights as company insiders have access to material non-public information. While not always predictive, patterns of insider buying often signal management confidence in future performance.' :
                `${metric.title} analysis helps identify liquidity patterns and market participation levels. ${activeToggle} provides different timeframes for trend analysis, offering both short-term and long-term perspective on trading activity.`}
            </p>
          </div>
        </div>

        {/* Stock Analysis Tool */}
        <div className="space-y-4">
          <h2 className="text-2xl font-light tracking-wide">Analyze Stock</h2>
          <div className="bg-teal/5 border border-teal/10 rounded-xl p-6">
            <p className="text-warm-white/80 mb-4">Search for a stock to see how it correlates with this metric</p>
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
                      analysisResult.recommendation === 'High Activity' ? 'bg-green-500/20 text-green-400' :
                      analysisResult.recommendation === 'Moderate Activity' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {analysisResult.recommendation}
                    </span>
                  </div>
                </div>
                <p className="text-warm-white/80 leading-relaxed">{analysisResult.description}</p>
                <div className="flex items-center gap-4 text-sm text-warm-white/60">
                  {analysisResult.activity && <span>Activity Level: {analysisResult.activity}</span>}
                  {analysisResult.period && (
                    <>
                      <span>•</span>
                      <span>Period: {analysisResult.period}</span>
                    </>
                  )}
                  <span>•</span>
                  <span>Analysis based on {metric.title}</span>
                </div>
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
  );
}
