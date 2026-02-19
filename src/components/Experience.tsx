import { experiences } from '../data/experience';
import ExperienceCard from './ExperienceCard';

const Experience = () => {
    return (
        <section className="my-24 container-custom" id="about-me">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24">
                {experiences.map((exp, index) => (
                    <ExperienceCard key={exp.id} experience={exp} index={index} />
                ))}
            </div>


        </section>
    );
};

export default Experience;
