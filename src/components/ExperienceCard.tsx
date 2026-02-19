import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Experience } from '../data/experience';

interface ExperienceCardProps {
  experience: Experience;
  index: number;
}

const ExperienceCard = ({ experience, index }: ExperienceCardProps) => {
  return (
    <motion.div
      className="group"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link to={`/experience/${experience.id}`}>
        <div className="aspect-[4/3] bg-brand-gray overflow-hidden rounded-sm mb-6 relative group">
          <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-gray-300 font-bold text-2xl group-hover:scale-110 group-hover:text-gray-400 transition-all duration-700">
              {experience.company}
            </span>
          </div>

          {/* Subtle cursor-follow or hover effect could go here */}
          <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="px-3 py-1 bg-white text-[10px] uppercase tracking-widest font-bold">view project</span>
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
