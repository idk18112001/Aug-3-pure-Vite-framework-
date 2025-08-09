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
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth error:', error);
          toast({
            title: "Authentication Error",
            description: error.message,
            variant: "destructive",
          });
          setLocation('/');
          return;
        }

        if (data.session) {
          toast({
            title: "Welcome to LucidQuant!",
            description: "You've been successfully signed in.",
          });
          // Redirect to dashboard or home
          setLocation('/');
        } else {
          setLocation('/');
        }
      } catch (error) {
        console.error('Unexpected error:', error);
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
