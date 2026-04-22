import AvatarGridBG from './AvatarGridBG';

const AboutMe = () => {
  return (
    <section className="my-24 container-custom" id="about-me">
      <div className="flex flex-col xl:flex-row-reverse justify-between items-center mb-16 gap-8">
        <div className="flex w-full mx-auto xl:h-max xl:w-auto justify-center relative">
          <div className="absolute -inset-8 flex items-center justify-center">
            <AvatarGridBG className="opacity-60" />
          </div>
          <img
            src="/bryanisimo/assets/images/profile/bryanisimo.jpg"
            alt="Bryan Isimo"
            className="w-48 h-48 rounded-full object-cover border-4 border-white relative z-10"
          />
        </div>
        <div className="full-width max-w-xl mx-auto xl:max-w-3xl xl:mx-0">
          <h2 className="text-sm uppercase tracking-widest text-gray-500 mb-6">Hey! This is Bryan</h2>
          <h3 className="text-2xl md:text-4xl font-bold leading-tight">
            An experienced engineer, involved in any kind of web project, from small landing pages to leading international teams.
          </h3>
          <p className='mt-6 text-gray-600 leading-relaxed text-xl'>
            As a tech enthusiast, I have a strong passion for learning and exploring new technologies. I am always eager to stay up-to-date with the latest trends and advancements in the tech industry, which allows me to bring fresh ideas and innovative solutions to my work.
          </p>
          <p className='mt-6 text-gray-600 leading-relaxed text-xl'>
            I enjoy being part of the decisions that drive the entire product development lifecycle. Starting with a problem to solve, then defining the best solution, planning times and scopes, reducing risks, internal/external coordination, communication within my team and other areas, testing cycles up to releasing and measurement for further iteration.
          </p>
          <p className='mt-6 text-gray-600 leading-relaxed text-xl'>
            Let's my work talk for me.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
