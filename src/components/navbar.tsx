import { Link } from "wouter";
import { useState, useEffect } from "react";
import { supabase } from "../supabase-client";
import { User } from "@supabase/supabase-js";
import UserAvatar from "./user-avatar";
import { Button } from "./ui/button";
import { useToast } from "../hooks/use-toast";

interface NavbarProps {
  onSignupClick: () => void;
}

export default function Navbar({ onSignupClick }: NavbarProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Check if user is new (created within last 24 hours) - you can customize this logic
  const isNewUser = user && user.created_at ? 
    (new Date().getTime() - new Date(user.created_at).getTime()) < 24 * 60 * 60 * 1000 : 
    false;

  const handleNotLoggedInClick = () => {
    toast({
      title: "You are not logged in",
      description: "Please sign up or log in to access your profile",
      variant: "destructive",
    });
  };

  return (
    <nav className="navbar fixed top-0 w-full z-50 py-4">
      <div className="flex items-center justify-between w-full px-8">
        <Link href="/" className="text-2xl font-light tracking-widest text-warm-white hover:text-teal transition-colors">
          LucidQuant
        </Link>
        
        <div className="flex items-center">
          {loading ? (
            <div className="w-10 h-10" /> // Placeholder while loading
          ) : user ? (
            <UserAvatar user={user} hasNotifications={Boolean(isNewUser)} />
          ) : (
            <Button
              onClick={handleNotLoggedInClick}
              className="w-10 h-10 bg-teal hover:bg-teal/80 text-navy font-semibold rounded-full transition-colors flex items-center justify-center border-2 border-teal"
            >
              +
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
