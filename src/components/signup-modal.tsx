import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignupModal({ isOpen, onClose }: SignupModalProps) {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    toast({
      title: "Thank you for signing up!",
      description: `We'll be in touch with ${email} soon.`,
    });
    
    setEmail("");
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999]"
      onClick={handleOverlayClick}
    >
      <div className="bg-navy border border-teal/20 rounded-xl p-8 max-w-md w-[90%] mx-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-light tracking-wide text-warm-white">Join LucidQuant</h3>
          <button 
            onClick={onClose}
            className="text-2xl text-warm-white/60 hover:text-warm-white transition-colors"
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit}>
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
              className="stock-search"
              placeholder="Enter your email"
            />
          </div>
          <Button type="submit" className="w-full analyze-btn">
            Sign Up
          </Button>
        </form>
      </div>
    </div>
  );
}
