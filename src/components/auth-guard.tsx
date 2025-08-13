import React from "react";

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  return (
    <div className="relative">
      <div 
        className="pointer-events-none select-none"
        style={{
          filter: "blur(8px) contrast(0.7) brightness(0.8)",
        }}
      >
        {children}
      </div>
      
      <div 
        className="absolute inset-0 flex items-center justify-center bg-white/20"
        style={{
          backdropFilter: "blur(15px)",
          WebkitBackdropFilter: "blur(15px)",
        }}
      >
        <div className="bg-white/95 rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Create Your Free Account to Unlock
          </h2>
          <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold">
            Get Access Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthGuard;
