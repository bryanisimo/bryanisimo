import { motion } from 'framer-motion';

const RemarcableProjects = () => {
  return (
    <section className="my-24 container-custom" id="projects">
      <div className="flex justify-between items-center mb-16">
        <h2 className="text-4xl font-bold">Remarkable Projects</h2>
        <button className="text-sm font-bold uppercase tracking-widest hover:underline">view all</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <motion.div
          className="p-12 bg-brand-gray rounded-sm"
          whileHover={{ y: -10 }}
          transition={{ duration: 0.5 }}
        >
          <h4 className="text-sm text-gray-500 mb-4 uppercase tracking-widest">FALL 2023</h4>
          <h3 className="text-3xl font-bold mb-6 italic">Clarapoints (Clara)</h3>
          <p className="text-gray-600 leading-relaxed">
            Achieved a 60% reduction in rewards spending through a custom reward system delivered in 30 days.
          </p>
        </motion.div>
        <motion.div
          className="p-12 bg-brand-gray rounded-sm"
          whileHover={{ y: -10 }}
          transition={{ duration: 0.5 }}
        >
          <h4 className="text-sm text-gray-500 mb-4 uppercase tracking-widest">FALL 2023</h4>
          <h3 className="text-3xl font-bold mb-6 italic">Stranger Fest (Netflix)</h3>
          <p className="text-gray-600 leading-relaxed">
            Custom Next.js scheduling system handling 10,000 users per minute with zero errors.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default RemarcableProjects;
