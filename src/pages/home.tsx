import { useLocation } from "wouter";
import FloatingElements from "@/components/floating-elements";
import Footer from "@/components/footer";
import { useOfferingsScroll } from "@/hooks/use-scroll-animations";

interface HomeProps {
  onSignupClick: () => void;
}

export default function Home({ onSignupClick }: HomeProps) {
  const [, setLocation] = useLocation();
  
  useOfferingsScroll();

  return (
    <div>
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative px-8 text-center">
        {/* Background overlay */}
        <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-teal/20 to-transparent"></div>
        
        <div className="max-w-6xl relative z-10">
          <h1 className="text-5xl md:text-7xl font-extralight mb-8 tracking-wide animate-fade-in-up gradient-text">
            Crafted for the
          </h1>
          <h2 className="text-5xl md:text-7xl font-light mb-12 tracking-wide animate-fade-in-delay">
            Unconventional
          </h2>
          
          <div className="animate-fade-in-delay-3">
            <button 
              onClick={() => setLocation('/explore')} 
              className="btn-ghost pulse-glow text-2xl md:text-3xl"
            >
              <span>Explore</span>
              <i className="fas fa-arrow-right ml-4 arrow transition-transform duration-300"></i>
            </button>
          </div>
        </div>

        <FloatingElements />
      </section>

      {/* Offerings Section - Layered Scroll */}
      <div className="offerings-container" id="offerings-container">
        {/* Spacer */}
        <div style={{ height: '100vh' }}></div>
        
        {/* First Offering */}
        <section className="offering-section" data-offering="0">
          <div className="max-w-4xl text-center px-8">
            <h2 className="text-4xl md:text-6xl font-light mb-8 tracking-wide">
              Act before it's everywhere
            </h2>
            <p className="text-lg md:text-xl font-light text-warm-white/80 max-w-3xl mx-auto">
              LucidQuant analyzes the data points everyone else overlooks. We find correlations in unexpected places and surface patterns before they become market consensus. Get early signals from sources others don't track.
            </p>
          </div>
        </section>

        {/* Second Offering */}
        <section className="offering-section" data-offering="1">
          <div className="max-w-4xl text-center px-8">
            <h2 className="text-4xl md:text-6xl font-light mb-8 tracking-wide">
              Go beyond the usual checks
            </h2>
            <p className="text-lg md:text-xl font-light text-warm-white/80 max-w-3xl mx-auto">
              While others focus on earnings and price charts, we explore alternative indicators that might tell a different story. Discover unconventional metrics that could reveal new investment angles you hadn't considered.
            </p>
          </div>
        </section>

        {/* Third Offering */}
        <section className="offering-section" data-offering="2">
          <div className="max-w-4xl text-center px-8">
            <h2 className="text-4xl md:text-6xl font-light mb-8 tracking-wide">
              Take the boldest risk reason allows
            </h2>
            <p className="text-lg md:text-xl font-light text-warm-white/80 max-w-3xl mx-auto">
              Smart risk isn't about gambling—it's about having better information. LucidQuant gives you the conviction to act on opportunities that appear risky to others. Make calculated moves with uncommon insight.
            </p>
          </div>
        </section>
      </div>

      {/* Signup Section */}
      <section className="min-h-screen flex items-center justify-center px-8">
        <div className="text-center">
          <h2 className="text-5xl md:text-7xl font-light mb-12 tracking-wide animate-fade-in-up">
            Start Today
          </h2>
          <div className="animate-fade-in-delay">
            <button 
              onClick={onSignupClick} 
              className="btn-ghost pulse-glow text-2xl md:text-3xl"
            >
              <span>Sign Up</span>
              <i className="fas fa-arrow-right ml-4 arrow transition-transform duration-300"></i>
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
