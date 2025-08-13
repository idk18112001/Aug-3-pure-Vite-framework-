import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { useState, useEffect } from "react";
import { useToast } from "./hooks/use-toast";

import Navbar from "./components/navbar";
import SignupModal from "./components/signup-modal";
import Home from "./pages/home";
import Explore from "./pages/explore";
import Indicators from "./pages/indicators";
import Metrics from "./pages/metrics";
import IndicatorDetail from "./pages/indicator-detail";
import MetricDetail from "./pages/metric-detail";
import Profile from "./pages/profile";
import Portfolio from "./pages/portfolio";
import AuthCallback from "./pages/auth-callback";
import NotFound from "./pages/not-found";

function Router() {
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const { toast } = useToast();

  // Handle auth errors on any page
  useEffect(() => {
    const handleAuthErrors = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      
      const errorParam = urlParams.get('error') || hashParams.get('error');
      const errorDescription = urlParams.get('error_description') || hashParams.get('error_description');
      
      if (errorParam) {
        console.log('Auth error detected:', errorParam, errorDescription);
        
        let errorMessage = "Authentication failed";
        if (errorParam === 'access_denied') {
          errorMessage = "Access was denied. Please try again.";
        } else if (errorParam === 'auth_failed') {
          errorMessage = "Authentication failed. Please try again.";
        } else if (errorDescription) {
          errorMessage = errorDescription.replace(/\+/g, ' ');
        }
        
        toast({
          title: "Authentication Error",
          description: errorMessage,
          variant: "destructive",
        });
        
        // Clean the URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    };

    handleAuthErrors();
  }, [toast]);

  return (
    <div className="min-h-screen">
      <Navbar onSignupClick={() => setIsSignupModalOpen(true)} />
      <Switch>
        <Route path="/" component={() => <Home onSignupClick={() => setIsSignupModalOpen(true)} />} />
        <Route path="/explore" component={Explore} />
        <Route path="/indicators" component={Indicators} />
        <Route path="/metrics" component={Metrics} />
        <Route path="/indicator/:id" component={IndicatorDetail} />
        <Route path="/metric/:id" component={MetricDetail} />
        <Route path="/profile" component={Profile} />
        <Route path="/portfolio" component={Portfolio} />
        <Route path="/auth/callback" component={AuthCallback} />
        <Route component={NotFound} />
      </Switch>
      <SignupModal 
        isOpen={isSignupModalOpen} 
        onClose={() => setIsSignupModalOpen(false)} 
      />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
