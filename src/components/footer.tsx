export default function Footer() {
  return (
    <footer className="py-16 px-8 border-t border-teal/10">
      <div className="max-w-7xl mx-auto text-center">
        <div className="text-2xl font-light mb-8 tracking-wide">LucidQuant</div>
        <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-12 mb-8">
          <a href="#" className="text-warm-white/60 hover:text-teal transition-colors">Privacy Policy</a>
          <a href="#" className="text-warm-white/60 hover:text-teal transition-colors">Terms of Service</a>
          <a href="#" className="text-warm-white/60 hover:text-teal transition-colors">Contact</a>
        </div>
        <p className="text-warm-white/40 text-sm mt-8">© 2024 LucidQuant. All rights reserved.</p>
      </div>
    </footer>
  );
}
