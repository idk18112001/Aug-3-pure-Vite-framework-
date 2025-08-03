import { Link } from "wouter";

interface NavbarProps {
  onSignupClick: () => void;
}

export default function Navbar({ onSignupClick }: NavbarProps) {
  return (
    <nav className="navbar fixed top-0 w-full z-50 py-4">
      <div className="flex items-center justify-center w-full px-8">
        <Link href="/" className="text-2xl font-light tracking-widest text-warm-white hover:text-teal transition-colors">
          LucidQuant
        </Link>
      </div>
    </nav>
  );
}
