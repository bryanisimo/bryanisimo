import React from 'react';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation();

    return (
        <div className="min-h-screen">
            <Navbar />
            <AnimatePresence mode="wait">
                <motion.div
                    key={location.key}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
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
                    {['LinkedIn', 'GitHub', 'Email'].map((social) => (
                        <a key={social} href="#" className="text-sm font-bold hover:underline underline-offset-4">
                            {social}
                        </a>
                    ))}
                </div>
            </footer>
        </div>
    );
};

export default Layout;
