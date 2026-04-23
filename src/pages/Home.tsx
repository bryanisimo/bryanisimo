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
      <div className='grid grid-cols-1 xl:grid-cols-2 xl:gap-12'>
        <RemarcableProjects className='max-w-xl' />
        <AwardsSection className='max-w-xl' />
      </div>
    </main>
  );
};

export default Home;
