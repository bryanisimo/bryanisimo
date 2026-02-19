import Hero from '../components/Hero';
import { experiences } from '../data/experience';
import ExperienceCard from '../components/ExperienceCard';
import AwardsSection from '../components/AwardsSection';
import { motion } from 'framer-motion';

const Home = () => {
    return (
        <main>
            <Hero />
            <section className="py-24 container-custom" id="about-me">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <div className="full-width md:max-w-3xl">
                        <h2 className="text-sm uppercase tracking-widest text-gray-500 mb-6">This is Bryan</h2>
                        <h3 className="text-2xl md:text-5xl font-bold leading-tight">
                            A full-stack developer with 20 years of experience in web development.
                        </h3>
                        <p className='mt-6 text-gray-600 leading-relaxed'>
                            Beeing involved in any kind of project, since Small landing pages to leading multidiciplinary teams.
                        </p>
                        <p className='mt-6 text-gray-600 leading-relaxed'>
                            I do care to deliver something that aports something to the people that uses my work, so, I enjoy to be part of the deccisions that takes the whole product development life cycle, from the planning to the delivery and maintenance.
                        </p>
                        <p className='mt-6 text-gray-600 leading-relaxed'>
                            Let's my work talk for me.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24">
                    {experiences.map((exp, index) => (
                        <ExperienceCard key={exp.id} experience={exp} index={index} />
                    ))}
                </div>

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

            <AwardsSection />

            <section className="py-24 container-custom">
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
        </main>
    );
};

export default Home;
