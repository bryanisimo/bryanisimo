import { motion } from 'framer-motion';

const Counter = () => {
  return (
    <section className="my-24 container-custom" id="counter">

      <div className="mt-32 pt-24 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { label: 'projects', value: '106' },
            { label: 'years', value: '15' },
            { label: 'awards', value: '9' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center md:text-left"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <span className="text-7xl font-bold block mb-2">{stat.value}</span>
              <span className="text-sm uppercase tracking-widest text-gray-500">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Counter;
