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
      <RemarcableProjects />
      <AwardsSection />
    </main>
  );
};

export default Home;
