import { useEffect } from 'react';

export function useOfferingsScroll() {
  useEffect(() => {
    const offeringsContainer = document.getElementById('offerings-container');
    const offeringSections = document.querySelectorAll('.offering-section');
    
    if (!offeringsContainer || offeringSections.length === 0) return;

    const handleScroll = () => {
      const containerRect = offeringsContainer.getBoundingClientRect();
      const containerHeight = offeringsContainer.offsetHeight;
      const viewportHeight = window.innerHeight;
      
      // Calculate scroll progress within the container (0 to 1)
      const scrollProgress = Math.max(0, Math.min(1, 
        (viewportHeight - containerRect.top) / (containerHeight - viewportHeight)
      ));
      
      // Update offering opacities based on scroll progress
      offeringSections.forEach((section, index) => {
        const sectionStart = index / offeringSections.length;
        const sectionEnd = (index + 1) / offeringSections.length;
        
        let opacity = 0;
        
        if (scrollProgress >= sectionStart && scrollProgress <= sectionEnd) {
          // Current section is visible
          const sectionProgress = (scrollProgress - sectionStart) / (sectionEnd - sectionStart);
          opacity = 1;
          
          // Fade out as we approach the end of this section
          if (sectionProgress > 0.8) {
            opacity = 1 - ((sectionProgress - 0.8) / 0.2);
          }
        } else if (scrollProgress > sectionEnd) {
          // Section has passed
          opacity = 0;
        } else {
          // Section hasn't started yet
          opacity = 0;
        }
        
        (section as HTMLElement).style.opacity = opacity.toString();
      });
    };

    window.addEventListener('scroll', handleScroll);
    
    // Initialize first section as visible
    if (offeringSections[0]) {
      (offeringSections[0] as HTMLElement).style.opacity = '1';
    }
    offeringSections.forEach((section, index) => {
      if (index > 0) {
        (section as HTMLElement).style.opacity = '0';
      }
    });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
}

export function useScrollAnimations() {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).style.opacity = '1';
          (entry.target as HTMLElement).style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);
    
    // Observe elements for scroll animations
    const animateElements = document.querySelectorAll('.data-card');
    animateElements.forEach(el => {
      (el as HTMLElement).style.opacity = '0';
      (el as HTMLElement).style.transform = 'translateY(30px)';
      (el as HTMLElement).style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);
}
