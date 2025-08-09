import { useState, useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { supabase } from '../supabase-client';
import { useToast } from '../hooks/use-toast';
import { User } from '@supabase/supabase-js';

interface UserAvatarProps {
  user: User;
  hasNotifications?: boolean;
}

export default function UserAvatar({ user, hasNotifications = false }: UserAvatarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Get user's initials
  const getInitials = (email: string, name?: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return email.charAt(0).toUpperCase();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Logged out successfully",
        description: "You've been signed out of your account.",
      });
      
      setIsDropdownOpen(false);
      // Refresh the page to reset auth state
      window.location.href = '/';
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to log out",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="w-12 h-12 rounded-full bg-teal hover:bg-teal/80 text-navy font-semibold text-lg transition-colors flex items-center justify-center relative"
      >
        {getInitials(user.email || '', user.user_metadata?.full_name)}
        
        {/* Notification Dot */}
        {hasNotifications && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-navy"></span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-navy border border-teal/20 rounded-lg shadow-xl z-50">
          <div className="py-2">
            {/* User Info */}
            <div className="px-4 py-2 border-b border-warm-white/10">
              <p className="text-sm text-warm-white font-medium">
                {user.user_metadata?.full_name || 'User'}
              </p>
              <p className="text-xs text-warm-white/60 truncate">
                {user.email}
              </p>
            </div>

            {/* Menu Items */}
            <Link href="/profile">
              <a 
                className="block px-4 py-2 text-sm text-warm-white hover:bg-teal/10 transition-colors"
                onClick={() => setIsDropdownOpen(false)}
              >
                Profile
              </a>
            </Link>
            
            <Link href="/portfolio">
              <a 
                className="block px-4 py-2 text-sm text-warm-white hover:bg-teal/10 transition-colors"
                onClick={() => setIsDropdownOpen(false)}
              >
                Portfolio
              </a>
            </Link>

            <hr className="border-warm-white/10 my-1" />
            
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-warm-white hover:bg-red-500/10 hover:text-red-400 transition-colors"
            >
              Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
