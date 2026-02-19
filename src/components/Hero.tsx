import { motion } from 'framer-motion';
import HeroBackground from './HeroBackground';
import { ChevronRight } from 'lucide-react';

const Hero = () => {
    const scrollToHome = () => {
        window.scrollTo({
            top: document.getElementById('about-me')?.offsetTop,
            behavior: 'smooth'
        });
    };

    return (
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
            <HeroBackground />

            <div className="relative z-10 text-center w-full px-6 md:px-12">
                <motion.h1
                    className="text-4xl md:text-6xl font-bold leading-tight mb-4"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                >
                    What a nice surprise to see you here 🤓
                </motion.h1>
                <motion.h2
                    className="text-2xl md:text-4xl font-bold leading-tight"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                >
                    Senior Engineer / Engineering Manager
                </motion.h2>
                <motion.div
                    className="mt-12"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                >
                    <button className="bg-brand-black text-white px-8 py-4 flex items-center gap-2 transition-all group hover:pr-10 hover:pl-10 mx-auto cursor-pointer" onClick={scrollToHome}>
                        Tell me more
                        <ChevronRight className='group-hover:translate-x-2 group-hover:rotate-90 transition-all' />
                    </button>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
