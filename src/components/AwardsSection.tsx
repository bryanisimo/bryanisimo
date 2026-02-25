import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import Lightbox from "yet-another-react-lightbox";
import Video from "yet-another-react-lightbox/plugins/video";
import "yet-another-react-lightbox/styles.css";

const awards = [
  { award: 'IAB México Award', project: 'Trident Micro Macro', year: '2019', videoUrl: 'https://www.youtube.com/watch?v=-OumcWiPpgI' },
  { award: 'Círculo de Oro Award', project: 'Fórmula Like', year: '2018', videoUrl: 'https://youtube.com/shorts/kiX7Xk60jgI' },
];

const AwardsSection = () => {
  const [index, setIndex] = useState(-1);

  // Prepare slides for Lightbox
  const slides = awards
    .filter(award => award.videoUrl)
    .map(award => {
      // Convert standard YouTube URL to embed URL
      let embedUrl = award.videoUrl!;
      if (embedUrl.includes('youtube.com/watch?v=')) {
        const videoId = embedUrl.split('v=')[1]?.split('&')[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      } else if (embedUrl.includes('youtu.be/')) {
        const videoId = embedUrl.split('youtu.be/')[1]?.split('?')[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      }

      return {
        type: "youtube" as const, // Custom type
        embedUrl,
        originalUrl: award.videoUrl
      };
    });

  const openLightbox = (awardIndex: number) => {
    // Find the correct index in the filtered slides array
    const award = awards[awardIndex];
    if (award.videoUrl) {
      const slideIndex = slides.findIndex(s => s.originalUrl === award.videoUrl);
      if (slideIndex !== -1) {
        setIndex(slideIndex);
      }
    }
  };

  return (
    <section className="py-24 container-custom bg-slate-950 text-white">
      <div className="mb-16">
        <h3 className="text-4xl md:text-6xl font-bold">Award-Winning Projects 🏆</h3>
      </div>

      <div className="space-y-0 -mx-4">
        {awards.map((award, index) => (
          <motion.button
            key={award.award}
            onClick={() => award.videoUrl && openLightbox(index)}
            className={`w-full text-left group py-12 border-b border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 ${award.videoUrl ? 'cursor-pointer hover:bg-white/5' : 'cursor-default'} px-4 transition-colors`}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <div>
              <span className="text-xs uppercase tracking-widest text-gray-500 block mb-2">{award.award}</span>
              <div className="flex items-center gap-4">
                <h4 className="text-3xl font-bold group-hover:underline underline-offset-8 transition-all duration-300">{award.project}</h4>
                {award.videoUrl && (
                  <div
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all group-hover:scale-110"
                    aria-label={`Watch ${award.project} video`}
                  >
                    <Play className="fill-white w-4 h-4 ml-1" />
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              <span className="text-lg text-gray-400">{award.year}</span>
            </div>
          </motion.button>
        ))}
      </div>

      <Lightbox
        index={index}
        slides={slides as any}
        open={index >= 0}
        close={() => setIndex(-1)}
        plugins={[Video]}
        render={{
          slide: ({ slide }) => {
            const customSlide = slide as any;
            if (customSlide.type === "youtube") {
              return (
                <div className="w-full h-full flex items-center justify-center p-4">
                  <iframe
                    className="w-full max-w-5xl aspect-video rounded-lg shadow-2xl"
                    src={customSlide.embedUrl}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
              );
            }
            return undefined;
          }
        }}
      />
    </section>
  );
};

export default AwardsSection;
