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

      {/* Indicators List */}
      <div className="max-w-4xl mx-auto px-8 pb-16">
        <div className="space-y-8">
          {indicators.map((indicator, index) => (
            <div key={indicator.id}>
              <div 
                className="py-6 px-6 cursor-pointer group transition-all duration-300 hover:bg-warm-white/5 hover:backdrop-blur-sm rounded-lg" 
                onClick={() => setLocation(`/indicator/${indicator.id}`)}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-2xl font-light text-warm-white group-hover:text-teal transition-colors duration-300">
                    {indicator.title}
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className={`trend-indicator ${getTrendClass(indicator.trend)} text-xl`}>
                      {getTrendIcon(indicator.trend)}
                    </span>
                    <span className="text-warm-white font-medium text-xl">{indicator.value}</span>
                  </div>
                </div>
                
                <p className="text-warm-white/70 mb-4 text-base leading-relaxed max-w-3xl">
                  {indicator.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-warm-white/60 bg-teal/20 px-3 py-1.5 rounded-full">
                    {indicator.category}
                  </span>
                  <div className="text-teal opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-2">
                    <span className="text-sm font-medium">Analyze →</span>
                  </div>
                </div>
              </div>
              
              {/* Subtle divider - only show between items, not after the last one */}
              {index < indicators.length - 1 && (
                <div className="h-px bg-gradient-to-r from-transparent via-warm-white/10 to-transparent"></div>
              )}
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
