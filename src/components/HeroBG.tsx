import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAssetPath } from '../utils/paths';

const videos = [
    getAssetPath('/assets/videos/video-1.mp4'),
    getAssetPath('/assets/videos/video-2.mp4'),
    getAssetPath('/assets/videos/video-3.mp4')
];

export const HeroBG = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleTimeUpdate = () => {
        if (!videoRef.current) return;
        const { currentTime, duration } = videoRef.current;

        // Trigger fade to white 0.6 seconds before the video ends
        if (duration > 0 && duration - currentTime < 0.6 && !isTransitioning) {
            setIsTransitioning(true);

            // Swap video source when the screen is fully white (after 500ms fade)
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % videos.length);
            }, 500);
        }
    };

    const handleLoadedData = () => {
        // New video has loaded enough to play, fade out the white screen
        if (isTransitioning) {
            setIsTransitioning(false);
        }
    };

    return (
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-white">
            {/*
        Space to add a black and white filter on them (e.g. className="grayscale").
        Currently omitted as requested.
      */}
            <video
                ref={videoRef}
                src={videos[currentIndex]}
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay
                muted
                playsInline
                onTimeUpdate={handleTimeUpdate}
                onLoadedData={handleLoadedData}
            />

            <AnimatePresence>
                {isTransitioning && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 bg-white"
                    />
                )}
            </AnimatePresence>
        </div>
    );
};
