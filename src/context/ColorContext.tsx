import { createContext, useContext, useState, useCallback, useEffect } from "react";

export type LogoColorKey =
  | "sky-aqua"
  | "bondi-blue"
  | "strawberry-red"
  | "tomato"
  | "orange"
  | "amber-flame"
  | "medium-jungle"
  | "yellow-green";

const COLOR_SEQUENCE: LogoColorKey[] = [
  "sky-aqua",
  "bondi-blue",
  "strawberry-red",
  "tomato",
  "orange",
  "amber-flame",
  "medium-jungle",
  "yellow-green",
];

// Development mode: 2 seconds, Production mode: 10 seconds
const COLOR_ROTATION_INTERVAL = import.meta.env.DEV ? 2000 : 10000;

interface ColorContextType {
  currentColor: LogoColorKey;
  setColor: (color: LogoColorKey) => void;
  resetToRotation: () => void;
}

const ColorContext = createContext<ColorContextType | undefined>(undefined);

export function ColorProvider({ children }: { children: React.ReactNode }) {
  const [currentColor, setCurrentColor] = useState<LogoColorKey>("sky-aqua");
  const [isRotating, setIsRotating] = useState(true);
  const [colorIndex, setColorIndex] = useState(0);

  // Handle color rotation
  useEffect(() => {
    if (!isRotating) return;

    const interval = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % COLOR_SEQUENCE.length);
      setCurrentColor(COLOR_SEQUENCE[(colorIndex + 1) % COLOR_SEQUENCE.length]);
    }, COLOR_ROTATION_INTERVAL);

    return () => clearInterval(interval);
  }, [isRotating, colorIndex]);

  // Update CSS variable when color changes
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--color-logo-dynamic",
      `var(--color-${currentColor})`
    );
  }, [currentColor]);

  const handleSetColor = useCallback((color: LogoColorKey) => {
    setCurrentColor(color);
    setIsRotating(false); // Stop rotation when manually set
  }, []);

  const handleResetToRotation = useCallback(() => {
    setIsRotating(true);
    setColorIndex(0);
    setCurrentColor(COLOR_SEQUENCE[0]);
  }, []);

  return (
    <ColorContext.Provider
      value={{
        currentColor,
        setColor: handleSetColor,
        resetToRotation: handleResetToRotation,
      }}
    >
      {children}
    </ColorContext.Provider>
  );
}

export function useLogoColor() {
  const context = useContext(ColorContext);
  if (!context) {
    throw new Error("useLogoColor must be used within a ColorProvider");
  }
  return context;
}
