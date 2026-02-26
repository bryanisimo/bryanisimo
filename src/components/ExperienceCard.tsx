import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Experience } from '../data/experience';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { getAssetPath } from '../utils/paths';
// @ts-ignore
import NET from 'vanta/dist/vanta.net.min';

interface ExperienceCardProps {
  experience: Experience;
  index: number;
}

const ExperienceCard = ({ experience, index }: ExperienceCardProps) => {
  const vantaEffectRef = useRef<any>(null);
  const vantaRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Scroll logic for Mobile
  const { scrollYProgress } = useScroll({
    target: cardRef,
    // Start tracking when the top of the card hits 60% of the viewport.
    // End tracking when the top of the card hits the top of the viewport (0%).
    offset: ["start 60%", "start 0%"]
  });

  // Map the scroll progress (0 to 1) to a fake mouseX coordinate
  // We'll pass this to Vanta to simulate a hover/rotation
  const simulatedMouseX = useTransform(scrollYProgress, [0, 1], [-1, 1]);

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined' && window.matchMedia) {
        setIsMobile(window.matchMedia('(max-width: 768px)').matches);
      }
    };
    handleResize(); // initial check
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const initVanta = () => {
    if (!vantaEffectRef.current && vantaRef.current) {
      const effect = NET({
        el: vantaRef.current,
        THREE: THREE,
        color: experience.cardColor ?? 0x9ca3af,
        backgroundColor: experience.cardBackgroundColor ?? 0xffffff,
        points: 10,
        maxDistance: 20,
        spacing: 16,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
      });

      if (effect && effect.linesMesh && effect.linesMesh.material) {
        effect.linesMesh.material.vertexColors = true;
        effect.linesMesh.material.blending = THREE.NormalBlending;
        effect.linesMesh.material.needsUpdate = true;
      }

      vantaEffectRef.current = effect;
    }
  };

  const destroyVanta = () => {
    if (vantaEffectRef.current) {
      vantaEffectRef.current.destroy();
      vantaEffectRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      destroyVanta();
    };
  }, []);

  useEffect(() => {
    if (!isMobile) return;

    // Mobile scroll subscription
    const unsubscribe = scrollYProgress.onChange((latest) => {
      if (latest > 0 && latest <= 1) {
        // We are in the active scroll area (top of card is between 60% and 0% of viewport)
        if (!vantaEffectRef.current) {
          initVanta();
        }

        // Pass the simulated mouse coordinate
        if (vantaEffectRef.current) {
          vantaEffectRef.current.mouseX = simulatedMouseX.get();
          // Trigger a slight rotation/update effect on scroll manually since Vanta respects these coordinates
          if (vantaEffectRef.current.updateUniforms) {
            vantaEffectRef.current.updateUniforms();
          }
        }

        // Apply visual classes dynamically on mobile so it looks "hovered"
        if (cardRef.current) {
          cardRef.current.classList.add('mobile-hover-active');
        }
      } else {
        // Out of the active scroll area
        destroyVanta();
        if (cardRef.current) {
          cardRef.current.classList.remove('mobile-hover-active');
        }
      }
    });

    return () => unsubscribe();
  }, [scrollYProgress, isMobile]);

  const handleMouseEnter = () => {
    if (!isMobile) {
      initVanta();
    }
  };

  const pauseVanta = () => {
    if (vantaEffectRef.current) {
      vantaEffectRef.current.destroy();
      vantaEffectRef.current = null;
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      pauseVanta();
    }
  };

  return (
    <motion.div
      className="group relative ¡"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link to={`/experience/${experience.id}`} className="flex flex-col md:flex-col-reverse group">

        {/* Title and Role (Moved to the top) */}
        <h4 className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2 font-bold">
          {experience.company}
        </h4>
        <h5 className="text-2xl md:text-3xl font-bold group-hover:underline decoration-1 underline-offset-8 transition-all mb-6">
          {experience.role}
        </h5>
        {/*
                     [&.mobile-hover-active_.vanta-bg]:grayscale-0 [&.mobile-hover-active_.vanta-bg]:blur-none [&.mobile-hover-active_.vanta-bg]:opacity-100
                     [&.mobile-hover-active_.logo-img]:scale-110 [&.mobile-hover-active_.logo-img]:grayscale-0
                     [&.mobile-hover-active_.view-label]:opacity-100

                     transition-all duration-700 grayscale blur-[2px] opacity-70 md:group-hover:grayscale-0 md:group-hover:blur-none md:group-hover:opacity-100

                     */}
        <div
          ref={cardRef}
          className="aspect-[4/3] bg-white overflow-hidden relative transition-all duration-700"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Vanta Layer */}
          <div
            ref={vantaRef}
            className="vanta-bg absolute inset-0 w-full h-full"
          />

          {/* Logo Layer */}
          {(experience.companyLogoCard || experience.companyLogo) && (
            <img
              src={getAssetPath(experience.companyLogoCard || experience.companyLogo || '')}
              alt={`${experience.company} background`}
              className="logo-img absolute m-auto inset-0 w-[60%] h-[60%] object-contain transition-all duration-700 ease-out grayscale md:group-hover:scale-110 md:group-hover:grayscale-0 z-10"
            />
          )}

          {/* View Experience Label */}
          <div className="view-label absolute bottom-6 left-6 opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 z-20">
            <span className="px-3 py-1 bg-slate-950 text-white text-[10px] uppercase tracking-widest font-bold shadow-sm">View Job</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ExperienceCard;
