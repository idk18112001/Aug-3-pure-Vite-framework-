import { useLocation } from "wouter";

export default function Explore() {
  const [, setLocation] = useLocation();

  return (
    <div>
      

      {/* Split View */}
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Left Half - Indicators */}
        <div 
          className="explore-half flex-1 cursor-pointer relative overflow-hidden flex items-center justify-center p-12 border-b md:border-b-0 md:border-r border-teal/10 min-h-[50vh] md:min-h-screen" 
          onClick={() => setLocation('/indicators')}
        >
          <div className="text-center relative z-10">
            <div className="text-6xl text-teal mb-6 explore-icon transition-transform duration-300">
              <i className="fas fa-chart-line"></i>
            </div>
            <h2 className="text-3xl md:text-5xl font-light mb-4 tracking-wide explore-title transition-colors duration-500">
              Indicators
            </h2>
            <p className="text-warm-white/60 font-light max-w-sm mx-auto">
              Unconventional signals that reveal market opportunities before they become mainstream
            </p>
          </div>
          
          {/* Animated Background Pattern */}
          <div className="absolute w-32 h-32 border border-teal rounded-full top-10 right-10 opacity-10 animate-float"></div>
        </div>

        {/* Right Half - Metrics */}
        <div 
          className="explore-half flex-1 cursor-pointer relative overflow-hidden flex items-center justify-center p-12 min-h-[50vh] md:min-h-screen" 
          onClick={() => setLocation('/metrics')}
        >
          <div className="text-center relative z-10">
            <div className="text-6xl text-teal mb-6 explore-icon transition-transform duration-300">
              <i className="fas fa-chart-bar"></i>
            </div>
            <h2 className="text-3xl md:text-5xl font-light mb-4 tracking-wide explore-title transition-colors duration-500">
              Metrics
            </h2>
            <p className="text-warm-white/60 font-light max-w-sm mx-auto">
              Alternative data points that traditional analysis overlooks, giving you the edge
            </p>
          </div>
          
          {/* Animated Background Pattern */}
          <div 
            className="absolute w-24 h-24 border border-teal rounded-lg transform rotate-45 bottom-10 left-10 opacity-10 animate-float" 
            style={{ animationDelay: '1.5s' }}
          ></div>
        </div>
      </div>
    </div>
  );
}
