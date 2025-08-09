import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { supabase } from '../supabase-client';
import { useToast } from '../hooks/use-toast';
import { Button } from '../components/ui/button';
import { User } from '@supabase/supabase-js';

export default function Portfolio() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        setLocation('/');
        return;
      }

      setUser(session.user);
      setLoading(false);
    };

    getUser();
  }, [setLocation]);

  const handleConnectBroker = async () => {
    setConnecting(true);

    try {
      // This is where you would integrate with brokerage APIs
      // For now, we'll show a placeholder message
      toast({
        title: "Broker Integration Coming Soon",
        description: "We're working on partnerships with major brokerages. Stay tuned!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to connect broker",
        variant: "destructive",
      });
    } finally {
      setConnecting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="text-warm-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-navy pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-navy border border-teal/20 rounded-xl p-8 shadow-2xl">
          <h1 className="text-2xl font-light text-warm-white mb-8">Portfolio Management</h1>

          {/* Portfolio Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-warm-white/5 rounded-lg p-6 border border-teal/10">
              <h3 className="text-lg font-medium text-warm-white mb-2">Total Value</h3>
              <p className="text-2xl font-light text-teal">--</p>
              <p className="text-sm text-warm-white/60">Connect broker to view</p>
            </div>
            
            <div className="bg-warm-white/5 rounded-lg p-6 border border-teal/10">
              <h3 className="text-lg font-medium text-warm-white mb-2">Holdings</h3>
              <p className="text-2xl font-light text-teal">--</p>
              <p className="text-sm text-warm-white/60">Connect broker to view</p>
            </div>
            
            <div className="bg-warm-white/5 rounded-lg p-6 border border-teal/10">
              <h3 className="text-lg font-medium text-warm-white mb-2">Performance</h3>
              <p className="text-2xl font-light text-teal">--</p>
              <p className="text-sm text-warm-white/60">Connect broker to view</p>
            </div>
          </div>

          {/* Broker Connection */}
          <div className="bg-warm-white/5 rounded-lg p-8 border border-teal/10 text-center">
            <div className="max-w-md mx-auto">
              <h2 className="text-xl font-medium text-warm-white mb-4">
                Connect Your Brokerage
              </h2>
              
              <p className="text-warm-white/70 mb-6">
                Sync your portfolio data for comprehensive analysis and insights
              </p>

              <Button
                onClick={handleConnectBroker}
                disabled={connecting}
                className="analyze-btn mb-4"
              >
                {connecting ? "Connecting..." : "Connect Broker"}
              </Button>

              <p className="text-sm text-warm-white/60">
                Connect your brokerage account for seamless portfolio synchronization
              </p>

              {/* Supported Brokers */}
              <div className="mt-8">
                <h3 className="text-sm font-medium text-warm-white/80 mb-4">
                  Supported Brokers (Coming Soon)
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs text-warm-white/60">
                  <div className="bg-warm-white/5 rounded p-3 border border-teal/5">
                    Interactive Brokers
                  </div>
                  <div className="bg-warm-white/5 rounded p-3 border border-teal/5">
                    TD Ameritrade
                  </div>
                  <div className="bg-warm-white/5 rounded p-3 border border-teal/5">
                    E*TRADE
                  </div>
                  <div className="bg-warm-white/5 rounded p-3 border border-teal/5">
                    Schwab
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Portfolio Analytics Placeholder */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-warm-white/5 rounded-lg p-6 border border-teal/10">
              <h3 className="text-lg font-medium text-warm-white mb-4">Asset Allocation</h3>
              <div className="h-32 bg-warm-white/5 rounded border border-teal/5 flex items-center justify-center">
                <p className="text-warm-white/60 text-sm">Chart will appear after connecting broker</p>
              </div>
            </div>

            <div className="bg-warm-white/5 rounded-lg p-6 border border-teal/10">
              <h3 className="text-lg font-medium text-warm-white mb-4">Performance Chart</h3>
              <div className="h-32 bg-warm-white/5 rounded border border-teal/5 flex items-center justify-center">
                <p className="text-warm-white/60 text-sm">Chart will appear after connecting broker</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
