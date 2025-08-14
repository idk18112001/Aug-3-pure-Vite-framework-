import { useEffect } from "react";
import { useLocation } from "wouter";
import { supabase } from "../supabase-client";
import { useToast } from "../hooks/use-toast";

export function AuthCallback() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const error = urlParams.get('error');
        const message = urlParams.get('message');
        const tokenHash = urlParams.get('token_hash');
        const type = urlParams.get('type');

        if (error) {
          console.error('Auth callback error:', error, message);
          toast({
            variant: "destructive",
            title: "Authentication Failed",
            description: message || `Authentication error: ${error}`,
          });
          navigate("/");
          return;
        }

        // Handle custom OAuth magic link token
        if (tokenHash && type === 'magiclink') {
          console.log('Processing custom OAuth magic link...');
          
          const { data, error: verifyError } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: 'magiclink'
          });

          if (verifyError) {
            console.error('Magic link verification failed:', verifyError);
            toast({
              variant: "destructive",
              title: "Authentication Failed",
              description: "Failed to verify authentication token",
            });
            navigate("/");
            return;
          }

          console.log('Custom OAuth authentication successful:', data.user?.email);
          toast({
            title: "Welcome!",
            description: "Successfully signed in with Google",
          });
          navigate("/");
          return;
        }

        // Handle standard Supabase OAuth callback
        const { data, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session retrieval error:', sessionError);
          toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "Failed to retrieve user session",
          });
          navigate("/");
          return;
        }

        if (data.session?.user) {
          console.log('Authentication successful:', data.session.user.email);
          toast({
            title: "Welcome!",
            description: "Successfully signed in",
          });
        }

        navigate("/");

      } catch (error: any) {
        console.error('Auth callback processing error:', error);
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "An unexpected error occurred during authentication",
        });
        navigate("/");
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
}

export default AuthCallback;
