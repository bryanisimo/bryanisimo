import { useState, useEffect } from 'react';

const TITLES = ['Senior Engineer', 'Engineering Manager'];

export const TypewriterText = () => {
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const typeSpeed = 100;
    const deleteSpeed = 50;
    const waitTime = 3000;

    const handleType = () => {
      const fullText = TITLES[currentTitleIndex];

      if (isDeleting) {
        setCurrentText(fullText.substring(0, currentText.length - 1));
      } else {
        setCurrentText(fullText.substring(0, currentText.length + 1));
      }

      if (!isDeleting && currentText === fullText) {
        setIsDeleting(true);
      } else if (isDeleting && currentText === '') {
        setIsDeleting(false);
        setCurrentTitleIndex((prev) => (prev + 1) % TITLES.length);
      }
    };

    const timeoutSpeed = currentText === TITLES[currentTitleIndex] && !isDeleting
      ? waitTime
      : currentText === '' && isDeleting
        ? 500
        : isDeleting ? deleteSpeed : typeSpeed;

    const timeout = setTimeout(handleType, timeoutSpeed);
    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentTitleIndex]);

  return (
    <span className="inline-block min-w-[260px] flex items-center">
      {currentText}
      <span
        className="inline-block w-[3px] h-[1em] bg-slate-950 ml-1 translate-y-[6px]"
        style={{ animation: 'blink 1s step-end infinite' }}
      >
        <style>
          {`
          @keyframes blink {
              0%, 100% { opacity: 1; }
              50% { opacity: 0; }
          }
          `}
        </style>
      </span>
    </span>
  );
};
