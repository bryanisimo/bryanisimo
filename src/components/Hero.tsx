import { useState, useEffect } from "react";
import { DiceGridBG } from "./DiceGridBG";

const colorOptions = [
  { bg: "#3da5d9", text: "white" },
  { bg: "#0C101A", text: "white" },

  { bg: "#4A6E91", text: "white" },
  { bg: "#668073", text: "white" },

  { bg: "#97724F", text: "white" },
  { bg: "#606F82", text: "white" },
];

const Hero = () => {
  const [activeColorConfig, setActiveColorConfig] = useState(colorOptions[0]);
  const [timerKey, setTimerKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveColorConfig((prev) => {
        const currentIndex = colorOptions.findIndex((c) => c.bg === prev.bg);
        return colorOptions[(currentIndex + 1) % colorOptions.length];
      });
    }, 7500);

    return () => clearInterval(interval);
  }, [timerKey]);

  const scrollToHome = () => {
    const element = document.getElementById("about-me");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      className="relative h-dvh w-full flex items-center justify-center overflow-hidden bg-white"
      id="home"
    >
      <div
        className="mix-blend-difference w-fit h-fit flex flex-col items-center gap-6 text-center relative z-30 cursor-pointer"
        onClick={scrollToHome}
      >
        <img
          alt="Bryan"
          className="h-auto w-64 block"
          src="/bryanisimo/assets/images/template/logo-white.svg"
        />
        {/*
        <p className="text-3xl block text-white font-bold">
          <span>b</span>
          <span>ryan</span>
        </p>
        */}
      </div>
      <div
        className="mix-blend-difference w-fit h-fit flex flex-row absolute bottom-4 gap-4 left-1/2 transform -translate-x-1/2 text-center text-2xl font-bold z-30"
        style={{ color: activeColorConfig.text }}
      >
        <span>Senior Engineer</span>
        <span className="text-brand-red">/</span>
        <span>Engineering Manager</span>
      </div>
      <DiceGridBG className="relative z-10" />
    </section>
  );
};

export default Hero;
