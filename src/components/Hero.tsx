import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { TypewriterText } from './TypewriterText';
import { HeroBg3D } from './HeroBg3D';

const colorOptions = [
  { bg: '#FFBE0B', text: 'slate-950' },
  { bg: '#FB5607', text: 'white' },
  { bg: '#4ecdc4', text: 'slate-950' },
  { bg: '#8e7dbe', text: 'white' },
  { bg: '#3A86FF', text: 'white' },
];

const Hero = () => {
  const [activeColorConfig, setActiveColorConfig] = useState(colorOptions[0]);
  const scrollToHome = () => {
    const element = document.getElementById('about-me');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative h-screen w-full flex items-center justify-start overflow-hidden bg-[#D5D5D5]" id="home">

      <HeroBg3D targetHue={activeColorConfig.bg} />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12">
        <div className="bg-white/40 backdrop-blur-md shadow-2xl border border-white/50 inline-block text-left px-8 py-8 md:px-12 md:py-10">
          <motion.h1
            className="text-2xl md:text-4xl font-bold leading-tight mb-4 text-slate-950"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            Nice to see you here!
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl font-bold mb-2 text-slate-950"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            Bryan González Alcíbar
          </motion.p>
          <motion.p
            className="text-xl md:text-2xl font-bold mb-2 text-slate-950"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <TypewriterText />
          </motion.p>
          <motion.div
            className="mt-10"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <motion.button
              className={`text-${activeColorConfig.text} px-8 py-4 flex items-center gap-2 transition-[padding] duration-300 group hover:pr-10 hover:pl-10 cursor-pointer`}
              onClick={scrollToHome}
              animate={{ backgroundColor: activeColorConfig.bg }}
              transition={{ duration: 0.8, ease: "linear" }}
            >
              Yes, tell me more
              <ChevronRight className='transition-transform duration-300 group-hover:translate-x-2 group-hover:rotate-90' />
            </motion.button>
          </motion.div>

          {/* Color Picker UI */}
          <motion.div
            className="mt-8 flex gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            {colorOptions.map((config) => (
              <button
                key={config.bg}
                onClick={() => setActiveColorConfig(config)}
                className={`w-8 h-8 rounded-full shadow-sm cursor-pointer transition-transform duration-200 hover:scale-110 ${activeColorConfig.bg === config.bg ? 'ring-2 ring-slate-950 ring-offset-2 ring-offset-white/40 scale-110' : ''}`}
                style={{ backgroundColor: config.bg }}
                aria-label={`Select color ${config.bg}`}
              />
            ))}
          </motion.div>
        </div>
      </div>

      {/* Smooth 80px gradient transition into the next section */}
      <div
        className="absolute bottom-0 left-0 w-full h-[120px] z-20 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%)' }}
      />
    </section>
  );
};

export default Hero;
