import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { projects } from '../data/projects';
import { twMerge } from 'tailwind-merge';

const RemarcableProjects = ({ className }: { className?: string }) => {
  return (
    <section className={twMerge(`flex flex-col text-white bg-slate-950 p-8 rounded-3xl`, className)} id="projects">
      <div className="mb-8">
        <h2 className="text-4xl font-bold">Remarkable Projects</h2>
      </div>

      <div className="flex flex-col gap-6">
        {projects.map((project) => (
          <Link to={`/project/${project.id}`} key={project.id}>
            <motion.div
              className="h-full p-8 bg-slate-900 border border-white/10 rounded-xl cursor-pointer flex flex-col gap-4"
              whileHover={{ y: -5, backgroundColor: 'rgba(255,255,255,0.05)' }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-2xl font-bold">{project.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {project.summary ? project.summary.slice(0, 120) + "..." : ""}
              </p>
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RemarcableProjects;
