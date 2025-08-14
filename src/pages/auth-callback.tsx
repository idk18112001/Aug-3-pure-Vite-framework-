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

        // Check for OAuth success parameter (from custom OAuth flow)
        const oauthSuccess = urlParams.get('oauth');
        
        if (oauthSuccess === 'success') {
          console.log('OAuth success detected, checking session...');
          
          // Check if user is already authenticated after custom OAuth
          const { data, error } = await supabase.auth.getSession();
          console.log('OAuth session check:', { user: data.session?.user?.email, error });

          if (data.session?.user) {
            console.log('✅ User successfully authenticated via custom OAuth:', data.session.user.email);
            toast({
              title: "Welcome to LucidQuant!",
              description: `Successfully signed in as ${data.session.user.email}`,
            });
            
            // Clean URL and redirect
            window.history.replaceState({}, document.title, '/');
            setLocation('/');
            return;
          } else {
            // If no session yet, wait a moment and try again
            console.log('No session found after OAuth, retrying...');
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const { data: retryData, error: retryError } = await supabase.auth.getSession();
            if (retryData.session?.user) {
              console.log('✅ User authenticated after retry:', retryData.session.user.email);
              toast({
                title: "Welcome to LucidQuant!",
                description: `Successfully signed in as ${retryData.session.user.email}`,
              });
              
              // Clean URL and redirect
              window.history.replaceState({}, document.title, '/');
              setLocation('/');
              return;
            }
          }
        }

        // Check if we have auth tokens in the URL (from magic link or OAuth)
        const hasAccessToken = window.location.hash.includes('access_token') || 
                              window.location.search.includes('access_token');
        const hasCode = urlParams.get('code'); // OAuth code

        if (hasAccessToken || hasCode) {
          console.log('Auth tokens detected, processing...', { hasAccessToken, hasCode });
          
          try {
            // For magic links (access_token in hash)
            if (hasAccessToken) {
              // Extract tokens from URL hash
              const hashTokens = new URLSearchParams(window.location.hash.substring(1));
              const accessToken = hashTokens.get('access_token');
              const refreshToken = hashTokens.get('refresh_token');
              
              if (accessToken) {
                console.log('Setting session with access token');
                const { data, error } = await supabase.auth.setSession({
                  access_token: accessToken,
                  refresh_token: refreshToken || '',
                });
                
                if (error) throw error;
                
                if (data.session?.user) {
                  console.log('✅ User successfully authenticated via magic link:', data.session.user.email);
                  toast({
                    title: "Welcome to LucidQuant!",
                    description: `Successfully signed in as ${data.session.user.email}`,
                  });
                  
                  // Clean URL and redirect
                  window.history.replaceState({}, document.title, '/');
                  setLocation('/');
                  return;
                }
              }
            }
            
            // For OAuth (code in query params)
            if (hasCode) {
              console.log('Processing OAuth code');
              const { data, error } = await supabase.auth.exchangeCodeForSession(hasCode);
              
              if (error) throw error;
              
              if (data.session?.user) {
                console.log('✅ User successfully authenticated via OAuth:', data.session.user.email);
                toast({
                  title: "Welcome to LucidQuant!",
                  description: `Successfully signed in as ${data.session.user.email}`,
                });
                
                // Clean URL and redirect
                window.history.replaceState({}, document.title, '/');
                setLocation('/');
                return;
              }
            }
          } catch (authError) {
            console.error('Token processing error:', authError);
            toast({
              title: "Authentication Error",
              description: "Failed to process authentication tokens",
              variant: "destructive",
            });
          }
        }

        // Check if user is already authenticated
        const { data, error } = await supabase.auth.getSession();
        console.log('Final session check:', { user: data.session?.user?.email, error });

        if (data.session?.user) {
          console.log('✅ User already authenticated:', data.session.user.email);
          toast({
            title: "Welcome back!",
            description: `Signed in as ${data.session.user.email}`,
          });
          
          // Clean URL and redirect
          window.history.replaceState({}, document.title, '/');
          setLocation('/');
          return;
        }

        if (error) {
          console.error('Session error:', error);
          toast({
            title: "Authentication Error", 
            description: error.message,
            variant: "destructive",
          });
        } else {
          console.log('No active session found, redirecting to home');
        }
        
        // Clean URL and redirect to home
        window.history.replaceState({}, document.title, '/');
        setLocation('/');
        
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
