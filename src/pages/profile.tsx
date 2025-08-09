import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { supabase } from '../supabase-client';
import { useToast } from '../hooks/use-toast';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { User } from '@supabase/supabase-js';

export default function Profile() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        setLocation('/');
        return;
      }

      setUser(session.user);
      setFullName(session.user.user_metadata?.full_name || '');
      setEmail(session.user.email || '');
      setPhone(session.user.user_metadata?.phone || '');
      setLoading(false);
    };

    getUser();
  }, [setLocation]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setUpdating(true);

    try {
      const { error } = await supabase.auth.updateUser({
        email: email,
        data: {
          full_name: fullName,
          phone: phone,
        }
      });

      if (error) throw error;

      toast({
        title: "Profile updated successfully",
        description: "Your profile information has been saved.",
      });
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    
    if (!confirmed) return;

    setDeleting(true);

    try {
      // Note: Supabase doesn't have a direct delete user method for security
      // You would typically implement this via a database function or Edge Function
      toast({
        title: "Account deletion requested",
        description: "Please contact support to complete account deletion.",
        variant: "destructive",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete account",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="text-warm-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-navy pt-20 pb-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-navy border border-teal/20 rounded-xl p-8 shadow-2xl">
          <h1 className="text-2xl font-light text-warm-white mb-8">Profile Settings</h1>

          <form onSubmit={handleUpdateProfile} className="space-y-6">
            {/* Full Name */}
            <div>
              <Label htmlFor="fullName" className="block text-sm font-medium mb-2 text-warm-white/80">
                Full Name
              </Label>
              <Input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="stock-search"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="block text-sm font-medium mb-2 text-warm-white/80">
                Email Address
              </Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="stock-search"
                placeholder="Enter your email"
              />
              <p className="text-xs text-warm-white/60 mt-1">
                Changing your email will require verification
              </p>
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="phone" className="block text-sm font-medium mb-2 text-warm-white/80">
                Phone Number
              </Label>
              <Input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="stock-search"
                placeholder="Enter your phone number"
              />
            </div>

            {/* Update Button */}
            <Button
              type="submit"
              disabled={updating}
              className="w-full analyze-btn"
            >
              {updating ? "Updating..." : "Update Profile"}
            </Button>
          </form>

          {/* Danger Zone */}
          <div className="mt-12 pt-8 border-t border-red-500/20">
            <h2 className="text-xl font-light text-red-400 mb-4">Danger Zone</h2>
            <p className="text-warm-white/60 text-sm mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <Button
              onClick={handleDeleteAccount}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2 rounded-lg transition-colors"
            >
              {deleting ? "Processing..." : "Delete Account"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
