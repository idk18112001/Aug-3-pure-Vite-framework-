import { useLocation } from "wouter";
import { indicators } from "@/data/indicators";
import { useScrollAnimations } from "@/hooks/use-scroll-animations";
import AuthGuard from "../components/auth-guard";

export default function Indicators() {
  const [, setLocation] = useLocation();
  
  useScrollAnimations();

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '↗';
      case 'down': return '↘';
      default: return '→';
    }
  };

  const getTrendClass = (trend: string) => {
    switch (trend) {
      case 'up': return 'trend-up';
      case 'down': return 'trend-down';
      default: return 'trend-stable';
    }
  };

  const content = (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="mb-4">
          <button 
            onClick={() => setLocation('/explore')} 
            className="breadcrumb-link"
          >
            ← Back to Explore
          </button>
        </div>
        <h1 className="text-4xl md:text-5xl font-light mb-4 tracking-wide">Indicators</h1>
        <p className="text-lg text-warm-white/80 font-light">Unconventional signals that reveal market opportunities before they become mainstream</p>
      </div>

      {/* Indicators Grid */}
      <div className="max-w-7xl mx-auto px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {indicators.map((indicator) => (
            <div 
              key={indicator.id}
              className="data-card rounded-xl p-6 cursor-pointer group" 
              onClick={() => setLocation(`/indicator/${indicator.id}`)}
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-medium text-warm-white">{indicator.title}</h3>
                <span className={`trend-indicator ${getTrendClass(indicator.trend)} text-lg`}>
                  {getTrendIcon(indicator.trend)}
                </span>
              </div>
              <p className="text-warm-white/70 mb-4 text-sm">{indicator.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-warm-white/50 bg-teal/20 px-2 py-1 rounded">
                  {indicator.category}
                </span>
                <span className="text-warm-white font-medium">{indicator.value}</span>
              </div>
              <div className="mt-4 text-teal opacity-0 transition-opacity group-hover:opacity-100">
                <span>Analyze →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <AuthGuard>
      {content}
    </AuthGuard>
  );
}
