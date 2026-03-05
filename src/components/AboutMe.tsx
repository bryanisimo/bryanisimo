const AboutMe = () => {
  return (
    <section className="my-24 container-custom" id="about-me">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
        <div className="full-width md:max-w-3xl">
          <h2 className="text-sm uppercase tracking-widest text-gray-500 mb-6">Hey! This is Bryan</h2>
          <h3 className="text-2xl md:text-4xl font-bold leading-tight">
            I'm an engineer with many years of experience in software development.
          </h3>
          <p className='mt-6 text-gray-600 leading-relaxed'>
            I enjoy being part of the decisions that drive the entire product development lifecycle, starting with discovering and planning, defining the best solution, development, testing up to releasing and measurement.
          </p>
          <p className='mt-6 text-gray-600 leading-relaxed'>
            I've been involved in any kind of project, from small landing pages to leading multidisciplinary teams.
          </p>
          <p className='mt-6 text-gray-600 leading-relaxed'>
            Let's my work talk for me.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
