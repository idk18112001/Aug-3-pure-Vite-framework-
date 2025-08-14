import { useState, useEffect } from "react";
import { supabase } from "../supabase-client";
import { Button } from "./ui/button";
import SignupModal from "./signup-modal";

interface AuthGuardProps {
  children: React.ReactNode;
  showBlurredContent?: boolean;
}

export function AuthGuard({ children, showBlurredContent = true }: AuthGuardProps) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showSignupModal, setShowSignupModal] = useState(false);

  useEffect(() => {
    // Check initial session
    const checkUser = async () => {
      try {
        console.log('AuthGuard: Checking user session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('AuthGuard: Auth error:', error);
          setUser(null);
        } else {
          console.log('AuthGuard: Session check result:', session?.user?.email || 'No user');
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('AuthGuard: Session check failed:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('AuthGuard: Auth state changed:', event, session?.user?.email || 'No user');
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  // If user is authenticated, show content normally
  if (user) {
    console.log('AuthGuard: User is authenticated, showing content normally:', user.email);
    return <>{children}</>;
  }

  console.log('AuthGuard: User is not authenticated, showing blur effect. User state:', user);

  // If user is not authenticated, show blurred content with sign-up overlay
  return (
    <div className="relative">
      {/* Teaser Blurred Content Background - Visible but unreadable */}
      {showBlurredContent && (
        <div 
          className="pointer-events-none select-none"
          style={{
            filter: 'blur(8px) contrast(0.7) brightness(0.8)',
          }}
        >
          {children}
        </div>
      )}
      
      {/* Frosted Glass Overlay */}
      <div 
        className="absolute inset-0 flex items-center justify-center bg-white/20"
        style={{
          backdropFilter: 'blur(15px) saturate(120%)',
          WebkitBackdropFilter: 'blur(15px) saturate(120%)',
        }}
      >
        <div className="bg-white/95 backdrop-blur-md border border-white/20 rounded-xl p-8 max-w-md mx-4 text-center shadow-2xl">
          <div className="mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Create Your Free Account to Unlock
            </h2>
          </div>
          
          <Button 
            onClick={() => setShowSignupModal(true)}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 py-3 font-semibold transform hover:scale-105 transition-all duration-200"
          >
            Get Access Now
          </Button>
          
          <p className="text-xs text-gray-500 mt-4">
            Join thousands of investors making smarter decisions
          </p>
        </div>
      </div>

      {/* Sign-up Modal */}
      <SignupModal 
        isOpen={showSignupModal} 
        onClose={() => setShowSignupModal(false)} 
      />
    </div>
  );
}

export default AuthGuard;
