import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const Hero = () => {
  const scrollToHome = () => {
    const element = document.getElementById('about-me');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-cover bg-center " style={{ backgroundImage: 'url(assets/images/template/main-bg.jpg)' }} id="home">

      <div className="relative z-10 w-full px-6 md:px-12 mx-auto md:max-w-7xl mix-blend-difference">
        <motion.h1
          className="text-2xl md:text-4xl font-bold leading-tight mb-4 text-slate-100"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          Nice to see you here!
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl font-bold mb-2 text-slate-100"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          Looking for a<br />
          Senior Engineer / Engineering Manager?<br />
          You are in the right place.
        </motion.p>
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <button className="bg-slate-950 text-white px-8 py-4 flex items-center gap-2 transition-all group hover:pr-10 hover:pl-10 hover:bg-slate-800 cursor-pointer" onClick={scrollToHome}>
            Yes, tell me more
            <ChevronRight className='group-hover:translate-x-2 group-hover:rotate-90 transition-all' />
          </button>
        </motion.div>
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
