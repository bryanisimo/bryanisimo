import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { projects } from '../data/projects';
import { twMerge } from 'tailwind-merge';

const RemarcableProjects = ({ className }: { className?: string }) => {
  return (
    <section className={twMerge(`my-12 bg-slate-950 py-12 px-8 text-white max-w-xl mx-auto xl:max-w-full`, className)} id="projects">
      <div className="flex justify-between items-center mb-16">
        <h2 className="text-4xl font-bold">Remarkable Projects</h2>
      </div>

      <div className="flex flex-col gap-12">
        {projects.map((project) => (
          <Link to={`/project/${project.id}`} key={project.id}>
            <motion.div
              className="h-full p-12 bg-brand-gray rounded-sm cursor-pointer"
              whileHover={{ y: -10 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-3xl font-bold mb-6 italic">{project.title} {project.company !== project.title && `(${project.company})`}</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
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
