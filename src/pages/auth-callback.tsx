import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { supabase } from '../supabase-client';
import { useToast } from '../hooks/use-toast';

export default function AuthCallback() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the current URL to check for auth parameters
        const currentUrl = window.location.href;
        console.log('Auth callback URL:', currentUrl);

        // Check for error parameters in both URL query and hash
        const urlParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        
        const errorParam = urlParams.get('error') || hashParams.get('error');
        const errorDescription = urlParams.get('error_description') || hashParams.get('error_description');
        
        if (errorParam) {
          console.error('Auth error from URL:', errorParam, errorDescription);
          
          let errorMessage = "Authentication failed";
          if (errorParam === 'access_denied') {
            errorMessage = "Access was denied. Please try again.";
          } else if (errorDescription) {
            errorMessage = errorDescription.replace(/\+/g, ' ');
          }
          
          toast({
            title: "Authentication Error",
            description: errorMessage,
            variant: "destructive",
          });
          
          // Clean URL and redirect
          window.history.replaceState({}, document.title, '/');
          setLocation('/');
          return;
        }

        // Handle Supabase OAuth callback - let Supabase handle everything
        const { data, error } = await supabase.auth.getSession();
        console.log('Session check result:', { user: data.session?.user?.email, error });

        if (data.session?.user) {
          console.log('✅ User successfully authenticated:', data.session.user.email);
          toast({
            title: "Welcome to LucidQuant!",
            description: `Successfully signed in as ${data.session.user.email}`,
          });
          
          // Clean URL and redirect to home page
          window.history.replaceState({}, document.title, '/');
          setLocation('/');
        } else {
          console.log('No active session found, redirecting to home');
          // Clean URL and redirect to home
          window.history.replaceState({}, document.title, '/');
          setLocation('/');
        }
        
      } catch (error) {
        console.error('Unexpected error:', error);
        toast({
          title: "Authentication Error",
          description: "Something went wrong during sign-in",
          variant: "destructive",
        });
        
        // Clean URL and redirect
        window.history.replaceState({}, document.title, '/');
        setLocation('/');
      }
    };

    handleAuthCallback();
  }, [setLocation, toast]);

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal mx-auto mb-4"></div>
        <p className="text-warm-white">Completing sign-in...</p>
      </div>
    </div>
  );
}
