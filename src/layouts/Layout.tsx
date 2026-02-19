import React from 'react';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { IconBrandLinkedin, IconBrandGithub, IconMail } from '@tabler/icons-react';

const Layout = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation();

    const socialLinks = [
        { icon: <IconBrandLinkedin size={24} />, href: 'https://linkedin.com', label: 'LinkedIn' },
        { icon: <IconBrandGithub size={24} />, href: 'https://github.com', label: 'GitHub' },
        { icon: <IconMail size={24} />, href: 'mailto:contact@example.com', label: 'Email' },
    ];

    return (
        <div className="min-h-screen">
            <Navbar />
            <AnimatePresence>
                <motion.div
                    key={location.key}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {children}
                </motion.div>
            </AnimatePresence>

            <footer className="py-24 container-custom border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="text-sm text-gray-400">
                    © {new Date().getFullYear()} Bryan González Alcíbar. All rights reserved.
                </div>
                <div className="flex gap-8">
                    {socialLinks.map((social) => (
                        <a
                            key={social.label}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-black transition-colors"
                            aria-label={social.label}
                        >
                            {social.icon}
                        </a>
                    ))}
                </div>
            </footer>
        </div>
    );
};

export default Layout;
