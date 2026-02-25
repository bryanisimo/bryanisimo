import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Play } from 'lucide-react';
import { experiences } from '../data/experience';
import { getAssetPath } from '../utils/paths';
import Lightbox from "yet-another-react-lightbox";
import Video from "yet-another-react-lightbox/plugins/video";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import "yet-another-react-lightbox/styles.css";

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const experience = experiences.find(e => e.id === id);
  const [index, setIndex] = useState(-1);

  if (!experience) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold mb-4">Experience not found</h1>
        <Link to="/" className="text-blue-500 hover:underline">Back to Home</Link>
      </div>
    );
  }

  // Prepare slides for Lightbox
  const slides = experience.media?.map(m => {
    if (m.type === 'video') {
      let embedUrl = m.url;
      let isYouTube = false;

      if (embedUrl.includes('youtube.com/watch?v=')) {
        const videoId = embedUrl.split('v=')[1]?.split('&')[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        isYouTube = true;
      } else if (embedUrl.includes('youtu.be/')) {
        const videoId = embedUrl.split('youtu.be/')[1]?.split('?')[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        isYouTube = true;
      }

      if (isYouTube) {
        return {
          type: "youtube" as const,
          embedUrl,
          originalUrl: m.url
        };
      }

      return {
        type: "video" as const,
        sources: [
          {
            src: m.url, // Video URLs are often external, but we should check if they are local
            type: "video/mp4",
          },
        ],
        poster: m.thumbnail ? getAssetPath(m.thumbnail) : undefined,
      };
    }
    return { src: getAssetPath(m.url) };
  }) || [];

  return (
    <main className="min-h-screen bg-white pt-28 pb-12">
      {/* Mobile Header (Back button only) */}
      <div className="md:hidden px-6 mb-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium hover:gap-3 transition-all"
        >
          <ArrowLeft size={16} />
          Back
        </Link>
      </div>

      <div className="container-custom">
        <div className="flex flex-col-reverse md:flex-row-reverse gap-8 lg:gap-16">
          {/* Right Column: Scrollable Media */}
          <div className="w-full md:w-1/2 lg:w-2/3">
            <div className="flex flex-col gap-4 p-4 md:p-8 lg:p-12">
              {experience.media?.map((item, idx) => (
                <motion.div
                  key={idx}
                  className="relative cursor-pointer overflow-hidden rounded-sm bg-brand-gray aspect-video"
                  initial={{ opacity: 0.4, y: -50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  onClick={() => setIndex(idx)}
                >
                  {item.type === 'image' ? (
                    <img
                      src={getAssetPath(item.url)}
                      alt={experience.company}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full relative group">
                      <img
                        src={item.thumbnail ? getAssetPath(item.thumbnail) : "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=2000"}
                        className="w-full h-full object-cover"
                        alt="video thumbnail"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-950/20 group-hover:bg-slate-950/30 transition-colors">
                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/50 transition-transform group-hover:scale-110">
                          <Play className="text-white fill-white ml-1" size={32} />
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Left Column: Fixed Content */}
          <div className="w-full md:w-1/2 lg:w-1/3 md:sticky md:top-32 h-fit">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Link
                to="/"
                className="hidden md:inline-flex items-center gap-2 mb-12 text-sm font-medium hover:gap-3 transition-all"
              >
                <ArrowLeft size={16} />
                Back
              </Link>

              <div className="flex items-start gap-6 mb-8 mt-4 md:mt-0">


                {/* Text Content */}
                <div>
                  <div className='flex flex-row gap-4 items-center mb-4'>
                    {/* Logo Box */}
                    {experience.companyLogo && (
                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-100 shadow-sm bg-white flex items-center justify-center p-0">
                        <img
                          src={getAssetPath(experience.companyLogo)}
                          alt={`${experience.company} logo`}
                          className="w-full h-full object-cover p-0"
                        />
                      </div>
                    )}
                    <h2 className="text-sm uppercase tracking-widest text-gray-400 font-bold ">
                      {experience.company}
                    </h2>
                  </div>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                    {experience.role}
                  </h1>
                </div>
              </div>

              <div className="h-px bg-slate-950/10 w-full mb-8" />

              <div className="flex flex-wrap gap-12 text-xs uppercase tracking-widest font-bold mb-12">
                <div>
                  <p className="text-gray-400 mb-2">Duration</p>
                  <p>{experience.period}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-2">Location</p>
                  <p>{experience.location}</p>
                </div>
              </div>

              <div className="space-y-12">
                <div>
                  <h3 className="text-xl font-bold mb-4 italic">The Mission</h3>
                  <div className="text-lg leading-relaxed text-gray-700">
                    <ReactMarkdown
                      components={{
                        a: ({ node, ...props }) => <a className="underline hover:text-blue-600 transition-colors" target="_blank" rel="noopener noreferrer nofollow" {...props} />,
                        strong: ({ node, ...props }) => <strong className="font-extrabold text-slate-950" {...props} />,
                        em: ({ node, ...props }) => <em className="text-sm italic text-gray-500" {...props} />
                      }}
                    >
                      {experience.summary}
                    </ReactMarkdown>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-6 italic">Impact & Growth</h3>
                  <ul className="space-y-6">
                    {experience.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex gap-4">
                        <span className="shrink-0 w-6 h-6 border border-slate-950 rounded-full flex items-center justify-center text-[10px] font-bold">
                          {idx + 1}
                        </span>
                        <div className="text-base text-gray-800 leading-relaxed font-medium">
                          <ReactMarkdown
                            components={{
                              a: ({ node, ...props }) => <a className="underline hover:text-blue-600 transition-colors" target="_blank" rel="noopener noreferrer nofollow" {...props} />,
                              strong: ({ node, ...props }) => <strong className="font-extrabold text-slate-950" {...props} />,
                              em: ({ node, ...props }) => <em className="text-sm italic text-gray-500" {...props} />
                            }}
                          >
                            {highlight}
                          </ReactMarkdown>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>


        </div>

        <div className="flex flex-col gap-8 lg:gap-16 w-full">

          {/* Navigation */}
          <div className="pt-12 flex justify-between items-center mt-12">
            {(() => {
              const currentIndex = experiences.findIndex(e => e.id === experience.id);
              const next = currentIndex < experiences.length - 1 ? experiences[currentIndex + 1] : null;
              const prev = currentIndex > 0 ? experiences[currentIndex - 1] : null;

              return (
                <>
                  {prev ? (
                    <Link
                      to={`/experience/${prev.id}`}
                      className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-slate-950 hover:gap-3 transition-all"
                    >
                      <ArrowLeft size={16} />
                      Newest job
                    </Link>
                  ) : <div />}

                  {next ? (
                    <Link
                      to={`/experience/${next.id}`}
                      className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-slate-950 hover:gap-3 transition-all"
                    >
                      Older job
                      <ArrowLeft size={16} className="rotate-180" />
                    </Link>
                  ) : <div />}
                </>
              );
            })()}
          </div>


        </div>
      </div>


      <Lightbox
        index={index}
        slides={slides as any}
        open={index >= 0}
        close={() => setIndex(-1)}
        plugins={[Video, Fullscreen]}
        render={{
          slide: ({ slide, offset }) => {
            const customSlide = slide as any;
            if (customSlide.type === "youtube") {
              return (
                <div className="w-full h-full flex items-center justify-center p-4">
                  {offset === 0 && (
                    <iframe
                      className="w-full max-w-5xl aspect-video rounded-lg shadow-2xl bg-black"
                      src={customSlide.embedUrl}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  )}
                </div>
              );
            }
            return undefined;
          }
        }}
      />
    </main >
  );
};

export default JobDetail;
