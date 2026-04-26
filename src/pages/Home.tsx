import AboutMe from '../components/AboutMe';
import AwardsSection from '../components/AwardsSection';
import Experience from '../components/Experience';
import Hero from '../components/Hero';
import RemarcableProjects from '../components/RemarcableProjects';

const Home = () => {
  return (
    <main>
      <Hero />
      <AboutMe />
      <Experience />
      <div className='container-custom grid grid-cols-1 lg:grid-cols-2 gap-12 my-24'>
        <RemarcableProjects />
        <AwardsSection />
      </div>
    </main>
  );
};

export default Home;
