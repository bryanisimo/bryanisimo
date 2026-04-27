import { awards } from "../data/awards";
import { Play } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { useState } from "react";

import Lightbox from "yet-another-react-lightbox";
import Video from "yet-another-react-lightbox/plugins/video";

import "yet-another-react-lightbox/styles.css";

const AwardsSection = ({ className }: { className?: string }) => {
  const [index, setIndex] = useState(-1);

  // Prepare slides for Lightbox
  const slides = awards
    .filter((award) => award.videoUrl)
    .map((award) => {
      // Convert standard YouTube URL to embed URL
      let embedUrl = award.videoUrl!;
      if (embedUrl.includes("youtube.com/watch?v=")) {
        const videoId = embedUrl.split("v=")[1]?.split("&")[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      } else if (embedUrl.includes("youtu.be/")) {
        const videoId = embedUrl.split("youtu.be/")[1]?.split("?")[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      }

      return {
        type: "youtube" as const, // Custom type
        embedUrl,
        originalUrl: award.videoUrl,
      };
    });

  const openLightbox = (awardIndex: number) => {
    // Find the correct index in the filtered slides array
    const award = awards[awardIndex];
    if (award.videoUrl) {
      const slideIndex = slides.findIndex(
        (s) => s.originalUrl === award.videoUrl,
      );
      if (slideIndex !== -1) {
        setIndex(slideIndex);
      }
    }
  };

  return (
    <section
      className={twMerge(
        `flex flex-col text-white bg-[#B583D9] p-8`,
        className,
      )}
      id="awards"
    >
      <div className="mb-8">
        <h2 className="text-4xl font-bold">Award-Winning Projects</h2>
      </div>

      <div className="flex flex-col gap-6">
        {awards.map((award, idx) => (
          <div
            key={award.award}
            onClick={() => award.videoUrl && openLightbox(idx)}
            className={twMerge(
              `group w-full text-left p-8 border
              flex items-center justify-between gap-6
              bg-[#D5AFF0]/40  border-[#D5AFF0]/10
              cursor-pointer transition-all`,
              award.videoUrl ? "hover:bg-[#D5AFF0]/50" : "cursor-default",
            )}
          >
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white/10 flex-shrink-0 flex items-center justify-center">
                <img src={`/bryanisimo/${award.awardImg}`} alt={award.award} className="w-full h-full object-contain" />
              </div>
              <div>
                <h4 className="text-xl font-bold mb-1">{award.project}</h4>
                <span className="text-sm text-gray-400 block">
                  {award.award}, {award.year}
                </span>
              </div>
            </div>
            {award.videoUrl && (
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-colors">
                <Play className="fill-white w-4 h-4 ml-1" />
              </div>
            )}
          </div>
        ))}
      </div>

      <Lightbox
        index={index}
        slides={slides as any}
        open={index >= 0}
        close={() => setIndex(-1)}
        plugins={[Video]}
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
          },
        }}
      />
    </section>
  );
};

export default AwardsSection;
