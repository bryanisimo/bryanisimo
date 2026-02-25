import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Experience } from '../data/experience';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
// @ts-ignore
import NET from 'vanta/dist/vanta.net.min';

interface ExperienceCardProps {
  experience: Experience;
  index: number;
}

const ExperienceCard = ({ experience, index }: ExperienceCardProps) => {
  const vantaEffectRef = useRef<any>(null);
  const vantaRef = useRef<HTMLDivElement>(null);

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

  return (
    <motion.div
      className="group"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link to={`/experience/${experience.id}`}>
        <div
          className="aspect-[4/3] bg-white overflow-hidden rounded-sm mb-6 relative group border border-gray-100"
          onMouseEnter={initVanta}
          onMouseLeave={destroyVanta}
        >
          {/* Vanta Layer */}
          <div
            ref={vantaRef}
            className="absolute inset-0 w-full h-full transition-all duration-700 grayscale blur-[2px] opacity-70 group-hover:grayscale-0 group-hover:blur-none group-hover:opacity-100"
          />

          {/* Logo Layer */}
          {(experience.companyLogoCard || experience.companyLogo) && (
            <img
              src={experience.companyLogoCard || experience.companyLogo}
              alt={`${experience.company} background`}
              className="absolute m-auto inset-0 w-[60%] h-[60%] object-contain transition-all duration-700 ease-out grayscale group-hover:scale-110 group-hover:grayscale-0 z-10"
            />
          )}

          {/* View Experience Label */}
          <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
            <span className="px-3 py-1 bg-slate-950 text-white text-[10px] uppercase tracking-widest font-bold shadow-sm">View experience</span>
          </div>
        </div>

        <h4 className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2 font-bold">
          {experience.company}
        </h4>
        <h5 className="text-2xl md:text-3xl font-bold group-hover:underline decoration-1 underline-offset-8 transition-all">
          {experience.role}
        </h5>
      </Link>
    </motion.div>
  );
};

export default ExperienceCard;
