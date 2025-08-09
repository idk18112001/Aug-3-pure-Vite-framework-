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
        // Handle the auth callback from URL hash/query params
        const { data, error } = await supabase.auth.getUser();
        
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

        if (data.user) {
          toast({
            title: "Welcome to LucidQuant!",
            description: `Successfully signed in as ${data.user.email}`,
          });
          // Redirect to home page
          setLocation('/');
        } else {
          // No user found, redirect to home
          setLocation('/');
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        toast({
          title: "Authentication Error",
          description: "Something went wrong during sign-in",
          variant: "destructive",
        });
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
