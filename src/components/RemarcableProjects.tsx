import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { projects } from '../data/projects';

const RemarcableProjects = () => {
  return (
    <section className="my-24 container-custom" id="projects">
      <div className="flex justify-between items-center mb-16">
        <h2 className="text-4xl font-bold">Remarkable Projects</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
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
