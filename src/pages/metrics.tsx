import { useLocation } from "wouter";
import { metrics } from "@/data/metrics";
import { useScrollAnimations } from "@/hooks/use-scroll-animations";

export default function Metrics() {
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
            onClick={() => setLocation('/explore')} 
            className="breadcrumb-link"
          >
            ← Back to Explore
          </button>
        </div>
        <h1 className="text-4xl md:text-5xl font-light mb-4 tracking-wide">Metrics</h1>
        <p className="text-lg text-warm-white/80 font-light">Alternative data points that traditional analysis overlooks, giving you the edge</p>
      </div>

      {/* Metrics Grid */}
      <div className="max-w-7xl mx-auto px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {metrics.map((metric) => (
            <div 
              key={metric.id}
              className="data-card rounded-xl p-6 cursor-pointer group" 
              onClick={() => setLocation(`/metric/${metric.id}`)}
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-medium text-warm-white">{metric.title}</h3>
                <span className={`trend-indicator ${getTrendClass(metric.trend)} text-lg`}>
                  {getTrendIcon(metric.trend)}
                </span>
              </div>
              <p className="text-warm-white/70 mb-4 text-sm">{metric.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-warm-white font-medium">{metric.value}</span>
                <span className={`text-sm ${getChangeClass(metric.change)}`}>
                  {metric.change}
                </span>
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
}
