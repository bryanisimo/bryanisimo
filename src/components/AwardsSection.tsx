import { motion } from 'framer-motion';

const awards = [
  { title: 'IAB México Award', project: 'Trident Micro Macro', year: '2014-2019' },
  { title: 'Círculo de Oro Award', project: 'Fórmula Like', year: '2014-2019' },
  { title: 'Facebook Success Case', project: 'Rally Pringles', year: '2014-2019' },
];

const AwardsSection = () => {
  return (
    <section className="py-24 container-custom bg-black text-white">
      <div className="mb-16">
        <h2 className="text-sm uppercase tracking-widest text-gray-500 mb-6">recognition</h2>
        <h3 className="text-4xl md:text-6xl font-bold">Award-Winning Projects</h3>
      </div>

      <div className="space-y-0">
        {awards.map((award, index) => (
          <motion.div
            key={award.title}
            className="group py-12 border-b border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <div>
              <span className="text-xs uppercase tracking-widest text-gray-500 block mb-2">{award.year}</span>
              <h4 className="text-3xl font-bold group-hover:italic transition-all duration-300">{award.title}</h4>
            </div>
            <div className="text-right">
              <span className="text-lg text-gray-400">{award.project}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default AwardsSection;
