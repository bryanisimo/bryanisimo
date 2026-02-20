import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { IconBrandLinkedin, IconBrandGithub, IconMail } from '@tabler/icons-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Disable scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const navLinks = [
    { label: 'hi!', href: 'home' },
    { label: 'experience', href: 'experience' },
    { label: 'remarkable projects', href: 'projects' },
  ];

  const socialLinks = [
    { icon: <IconBrandLinkedin size={24} />, href: 'https://linkedin.com', label: 'Linkedin' },
    { icon: <IconBrandGithub size={24} />, href: 'https://github.com', label: 'Github' },
    { icon: <IconMail size={24} />, href: 'mailto:contact@example.com', label: 'Email' },
  ];

  const handleNavClick = (href: string) => {
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: href } });
    } else {
      const element = document.getElementById(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsOpen(false);
  };

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 w-full z-[100] py-8 px-6 md:px-12 flex justify-between items-center mix-blend-difference pointer-events-none"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="pointer-events-auto">
          <Link to="/" className="text-xl font-bold tracking-tighter text-white">
            Bryanisimo.
          </Link>
        </div>

        <div className="pointer-events-auto">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 focus:outline-none group relative w-12 h-12 flex items-center justify-center cursor-pointer"
            aria-label="Toggle Menu"
          >
            <motion.div
              className="relative w-8 h-8 flex items-center justify-center"
              animate={isOpen ? { rotate: 180 } : { rotate: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <motion.div
                className="w-8 h-[2px] bg-white absolute"
                animate={isOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -4 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
              <motion.div
                className="w-8 h-[2px] bg-white absolute"
                animate={isOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 4 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </motion.div>
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, }}
            animate={{ opacity: 1, }}
            exit={{ opacity: 0, }}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[90] bg-brand-black flex flex-col items-center justify-center p-6"
          >
            <div className="flex flex-col items-center gap-8 mb-12 text-center">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.href)}
                  className="text-white text-2xl md:text-4xl font-bold hover:underline underline-offset-8 transition-all cursor-pointer"
                >
                  {link.label}
                </button>
              ))}
            </div>
            <motion.div
              className="w-24 h-px bg-white/20 mb-12"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.7 }}
            />
            <div className="flex gap-10">
              {socialLinks.map((social, idx) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-gray-400 transition-colors"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.8 + idx * 0.1,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  aria-label={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
