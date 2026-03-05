import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { TypewriterText } from './TypewriterText';
import { HeroBg3D, targetColors } from './HeroBg3D';

const Hero = () => {
  const [btnColor, setBtnColor] = useState(targetColors[0]);
  const scrollToHome = () => {
    const element = document.getElementById('about-me');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative h-screen w-full flex items-center justify-start overflow-hidden bg-[#D5D5D5]" id="home">

      <HeroBg3D onColorChange={setBtnColor} />

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
              className="text-white px-8 py-4 flex items-center gap-2 transition-[padding] duration-300 group hover:pr-10 hover:pl-10 cursor-pointer"
              onClick={scrollToHome}
              animate={{ backgroundColor: btnColor }}
              transition={{ duration: 1.5, ease: "linear" }}
            >
              Yes, tell me more
              <ChevronRight className='transition-transform duration-300 group-hover:translate-x-2 group-hover:rotate-90' />
            </motion.button>
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
