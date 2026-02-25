import { Canvas } from '@react-three/fiber';
import { OrigamiSequence } from './OrigamiSequence';
import { useEffect, useRef, useState } from 'react';

const HeroBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0 } // Trigger as soon as 1px is visible/hidden
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <Canvas
        frameloop={isVisible ? "always" : "demand"}
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={1} />
        {/* Only render sequence children if visible, or let Canvas pause automatically via frameloop */}
        <OrigamiSequence isActive={isVisible} />
      </Canvas>
    </div>
  );
};

export default HeroBackground;
