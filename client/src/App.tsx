import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";

import Navbar from "@/components/navbar";
import SignupModal from "@/components/signup-modal";
import Home from "@/pages/home";
import Explore from "@/pages/explore";
import Indicators from "@/pages/indicators";
import Metrics from "@/pages/metrics";
import IndicatorDetail from "@/pages/indicator-detail";
import MetricDetail from "@/pages/metric-detail";
import NotFound from "@/pages/not-found";

function Router() {
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

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
