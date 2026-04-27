import { experiences } from '../data/experience';
import ExperienceCard from './ExperienceCard';

const Experience = () => {
  return (
    <section className="my-24 container-custom" id="experience">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-12 gap-y-24">
        {experiences.map((exp, index) => (
          <ExperienceCard key={exp.id} experience={exp} index={index} />
        ))}
      </div>
    </section>
  );
};

export default Experience;
