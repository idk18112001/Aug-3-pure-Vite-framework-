export default function FloatingElements() {
  return (
    <>
      <div className="floating-element w-24 h-24 rounded-full top-20 right-20 hidden md:block animate-float"></div>
      <div 
        className="floating-element w-16 h-16 rounded-lg transform rotate-45 bottom-32 left-16 hidden md:block animate-float" 
        style={{ animationDelay: '1s' }}
      ></div>
    </>
  );
}
