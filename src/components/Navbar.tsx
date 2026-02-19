import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = () => {
    return (
        <motion.nav
            className="fixed top-0 left-0 w-full z-50 py-8 px-6 md:px-12 flex justify-between items-center mix-blend-difference pointer-events-none"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
            <div className="pointer-events-auto">
                <Link to="/" className="text-xl font-bold tracking-tighter text-white">
                    Bryanisimo.
                </Link>
            </div>

            <div className="flex gap-8 pointer-events-auto">
                {['hi!', 'works', 'about', 'contact'].map((item) => (
                    <Link
                        key={item}
                        to="/"
                        className="text-white text-sm font-medium hover:opacity-50 transition-opacity"
                    >
                        {item}
                    </Link>
                ))}
            </div>
        </motion.nav>
    );
};

export default Navbar;
