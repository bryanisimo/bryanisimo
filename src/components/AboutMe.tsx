const AboutMe = () => {
    return (
        <section className="my-24 container-custom" id="about-me">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                <div className="full-width md:max-w-3xl">
                    <h2 className="text-sm uppercase tracking-widest text-gray-500 mb-6">This is Bryan</h2>
                    <h3 className="text-2xl md:text-4xl font-bold leading-tight">
                        An engineer with many years of experience in software development.
                    </h3>
                    <p className='mt-6 text-gray-600 leading-relaxed'>
                        It's important to me to deliver something that benefits the people who use my work, so I enjoy being part of the decisions that drive the entire product development lifecycle, from planning to delivery and maintenance.
                    </p>
                    <p className='mt-6 text-gray-600 leading-relaxed'>
                        I've been involved in all kinds of projects, from small landing pages to leading multidisciplinary teams.
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
