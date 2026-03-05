import { motion, useScroll, useTransform, useInView } from 'framer-motion';
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
    // Start tracking when the top of the card enters 60% of the viewport.
    // End tracking when the bottom of the card exits the top 40% of the viewport.
    offset: ["start 60%", "end 40%"]
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

  const pauseVanta = () => {
    if (vantaEffectRef.current) {
      // Vanta stores the rAF id in .req. Canceling it stops the loop without destroying the instance.
      if (typeof window !== 'undefined' && vantaEffectRef.current.req) {
        cancelAnimationFrame(vantaEffectRef.current.req);
      }
    }
  };

  const playVanta = () => {
    if (vantaEffectRef.current) {
      // Vanta's animationLoop holds the requestAnimationFrame recursive call.
      if (vantaEffectRef.current.animationLoop && typeof vantaEffectRef.current.animationLoop === 'function') {
        vantaEffectRef.current.animationLoop();
      } else if (vantaEffectRef.current.play && typeof vantaEffectRef.current.play === 'function') {
        vantaEffectRef.current.play();
      }
    }
  };

  // Destop InView logic to prevent memory spike
  const isInView = useInView(cardRef, { once: true, margin: "100px" });

  // Mount logic for desktop
  useEffect(() => {
    if (!isMobile && isInView) {
      if (!vantaEffectRef.current) {
        initVanta();
        // Allow 1 frame to render so we don't blur a black screen, then pause.
        setTimeout(() => {
          pauseVanta();
        }, 100);
      }
    }

    return () => {
      destroyVanta();
    };
  }, [isMobile, isInView]);

  useEffect(() => {
    if (!isMobile) return;

    // Mobile scroll subscription
    const unsubscribe = scrollYProgress.onChange((latest) => {
      if (latest > 0 && latest <= 1) {
        // We are in the active scroll area (top of card is between 60% and 0% of viewport)
        if (!vantaEffectRef.current) {
          initVanta();
        } else {
          playVanta();
        }

        // Pass the simulated mouse coordinate
        if (vantaEffectRef.current) {
          vantaEffectRef.current.mouseX = simulatedMouseX.get();
        }

        // Apply visual classes dynamically on mobile so it looks "active"
        if (cardRef.current) {
          cardRef.current.classList.add('active-card');
        }
      } else {
        // Out of the active scroll area
        pauseVanta();
        if (cardRef.current) {
          cardRef.current.classList.remove('active-card');
        }
      }
    });

    return () => unsubscribe();
  }, [scrollYProgress, isMobile, simulatedMouseX]);

  const handleMouseEnter = () => {
    if (!isMobile) {
      if (!vantaEffectRef.current) initVanta();
      playVanta();
      if (cardRef.current) cardRef.current.classList.add('active-card');
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      pauseVanta();
      if (cardRef.current) cardRef.current.classList.remove('active-card');
    }
  };

  return (
    <motion.div
      className="group relative"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link to={`/experience/${experience.id}`} className="flex flex-col md:flex-col group">

        {/* Title and Role (Moved to the top) */}
        <div
          ref={cardRef}
          className="aspect-[4/3] bg-white overflow-hidden relative transition-all duration-700 [&.active-card_.vanta-bg]:grayscale-0 [&.active-card_.vanta-bg]:blur-none [&.active-card_.vanta-bg]:opacity-100 [&.active-card_.logo-img]:scale-110 [&.active-card_.logo-img]:grayscale-0 [&.active-card_.view-label]:opacity-100"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Vanta Layer */}
          <div
            ref={vantaRef}
            className="vanta-bg absolute inset-0 w-full h-full transition-all duration-700 grayscale blur-[3px] opacity-60"
          />

          {/* Logo Layer */}
          {(experience.companyLogoCard || experience.companyLogo) && (
            <img
              src={getAssetPath(experience.companyLogoCard || experience.companyLogo || '')}
              alt={`${experience.company} background`}
              className="logo-img absolute m-auto inset-0 w-[60%] h-[60%] object-contain transition-all duration-700 ease-out grayscale z-10"
            />
          )}

          {/* View Experience Label */}
          <div className="view-label absolute bottom-6 left-6 opacity-0 transition-opacity duration-300 z-20">
            <span className="px-3 py-1 bg-slate-950 text-white text-[10px] uppercase tracking-widest font-bold shadow-sm">View Job</span>
          </div>
        </div>
        <h5 className="text-2xl md:text-3xl font-bold group-hover:underline decoration-1 underline-offset-8 transition-all mb-1 mt-2">
          {experience.role}
        </h5>
        <h4 className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2 font-bold">
          {experience.company}
        </h4>
      </Link>
    </motion.div>
  );
};

export default ExperienceCard;
