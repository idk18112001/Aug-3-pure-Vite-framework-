import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useToast } from "../hooks/use-toast";
import { supabase } from "../supabase-client";

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignupModal({ isOpen, onClose }: SignupModalProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      toast({
        title: "Check your email!",
        description: `We've sent a sign-in link to ${email}`,
      });
      
      setEmail("");
      onClose();
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: "Error",
        description: error.message?.includes('Database error') 
          ? "Please try signing up with Google instead, or contact support."
          : error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    
    try {
      // Use Supabase's built-in Google OAuth
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }

      // The redirect will happen automatically, so we don't need to do anything else
      console.log('Google OAuth initiated successfully');
    } catch (error: any) {
      console.error('Google OAuth error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to start Google authentication",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-[9999]"
      onClick={handleOverlayClick}
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)'
      }}
    >
      <div className="bg-navy border border-teal/20 rounded-xl p-8 max-w-md w-[90%] mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-light tracking-wide text-warm-white">Join LucidQuant</h3>
          <button 
            onClick={onClose}
            className="text-2xl text-warm-white/60 hover:text-warm-white transition-colors"
            disabled={isLoading}
          >
            ×
          </button>
        </div>

        {/* Google OAuth Button */}
        <div className="mb-6">
          <Button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full bg-white hover:bg-gray-100 text-gray-700 hover:text-gray-900 border border-gray-300 font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-3"
            variant="outline"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Gmail
          </Button>
        </div>

        {/* Divider */}
        <div className="relative my-6">
          <div className="w-full border-t border-warm-white/20"></div>
        </div>

        {/* Email Form */}
        <form onSubmit={handleEmailSubmit}>
          <div className="mb-6">
            <Label 
              htmlFor="email" 
              className="block text-sm font-medium mb-2 text-warm-white/80"
            >
              Email Address
            </Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="stock-search"
              placeholder="Enter your email"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full analyze-btn"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send Magic Link"}
          </Button>
        </form>
      </div>
    </div>
  );
}
