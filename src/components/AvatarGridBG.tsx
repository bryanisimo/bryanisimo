import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from "react";
import gsap from "gsap";

// Color pairs from your DiceGridBG
const COLOR_PAIRS: Array<[string, string]> = [
  ["#4fc6e3", "#1985a1"], // cyan pair
  ["#e71d36", "#fe4a49"], // red pair
  ["#ffae03", "#ffbe33"], // gold pair
  ["#4da852", "#9bc53d"], // green pair
  ["#9332bf", "#ca64ea"], // purple pair
];

type ShapeType = "quarter-circle" | "diagonal" | "square" | "split";

interface BlockState {
  shape: ShapeType;
  colorPair: [string, string];
  cornerIndex?: number; // For quarter circle: 0=top-left, 1=top-right, 2=bottom-right, 3=bottom-left
  diagonalDir?: number; // For diagonal: 0-3
  splitDir?: number; // For split: 0=horizontal-top, 1=horizontal-bottom, 2=vertical-left, 3=vertical-right
}

function pickColorPair(): [string, string] {
  return COLOR_PAIRS[Math.floor(Math.random() * COLOR_PAIRS.length)];
}

function getRandomShape(): ShapeType {
  const shapes: ShapeType[] = ["quarter-circle", "diagonal", "square", "split"];
  return shapes[Math.floor(Math.random() * shapes.length)];
}

function generateBlockState(): BlockState {
  const shape = getRandomShape();
  const colorPair = pickColorPair();
  const cornerIndex = Math.floor(Math.random() * 4);
  const diagonalDir = Math.floor(Math.random() * 4);
  const splitDir = Math.floor(Math.random() * 4);

  return {
    shape,
    colorPair,
    cornerIndex,
    diagonalDir,
    splitDir,
  };
}

// Generate different states for each corner (quarter circles point towards center)
const CORNER_CONFIGS = {
  0: { cornerIndex: 3, label: "top-left" },    // bottom-right corner of square
  1: { cornerIndex: 2, label: "top-right" },   // bottom-left corner of square
  2: { cornerIndex: 1, label: "bottom-left" }, // top-right corner of square
  3: { cornerIndex: 0, label: "bottom-right" }, // top-left corner of square
};

interface BlockProps {
  index: number;
  size: number;
  x: number;
  y: number;
}

export interface BlockHandle {
  triggerAnimation: () => void;
}

const Block = forwardRef<BlockHandle, BlockProps>(({ index, size, x, y }, ref) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const stateRef = useRef<BlockState>(generateBlockState());
  const pathRef = useRef<SVGPathElement>(null);
  const bgRef = useRef<SVGRectElement>(null);

  const renderShape = () => {
    const state = stateRef.current;
    const [primary, secondary] = state.colorPair;

    // Set background
    bgRef.current!.setAttribute("fill", primary);

    if (state.shape === "quarter-circle") {
      const corner = state.cornerIndex || 0;
      const radius = size / 2;

      // Quarter circles positioned at each corner, pointing toward center
      let pathData = "";

      if (corner === 0) {
        // Top-left: quarter circle in bottom-right corner
        pathData = `M ${size} ${size / 2} L ${size} ${size} L ${size / 2} ${size} A ${radius} ${radius} 0 0 1 ${size} ${size / 2} Z`;
      } else if (corner === 1) {
        // Top-right: quarter circle in bottom-left corner
        pathData = `M 0 ${size / 2} L 0 ${size} L ${size / 2} ${size} A ${radius} ${radius} 0 0 1 0 ${size / 2} Z`;
      } else if (corner === 2) {
        // Bottom-right: quarter circle in top-left corner
        pathData = `M 0 ${size / 2} L 0 0 L ${size / 2} 0 A ${radius} ${radius} 0 0 1 0 ${size / 2} Z`;
      } else {
        // Bottom-left: quarter circle in top-right corner
        pathData = `M ${size} ${size / 2} L ${size} 0 L ${size / 2} 0 A ${radius} ${radius} 0 0 1 ${size} ${size / 2} Z`;
      }

      pathRef.current!.setAttribute("d", pathData);
      pathRef.current!.setAttribute("fill", secondary);
    } else if (state.shape === "diagonal") {
      const dir = state.diagonalDir || 0;
      const diagonals = [
        `M ${size} 0 L ${size} ${size} L 0 ${size} Z`, // top-right to bottom-left
        `M 0 0 L 0 ${size} L ${size} ${size} Z`,       // top-left to bottom-right
        `M 0 0 L ${size} 0 L ${size} ${size} Z`,       // top-left to bottom-right (reverse)
        `M 0 0 L ${size} 0 L 0 ${size} Z`,             // top corners
      ];
      pathRef.current!.setAttribute("d", diagonals[dir]);
      pathRef.current!.setAttribute("fill", secondary);
    } else if (state.shape === "split") {
      const dir = state.splitDir || 0;
      let splitPath = "";

      if (dir === 0) {
        // Horizontal split - top half
        splitPath = `M 0 0 L ${size} 0 L ${size} ${size / 2} L 0 ${size / 2} Z`;
      } else if (dir === 1) {
        // Horizontal split - bottom half
        splitPath = `M 0 ${size / 2} L ${size} ${size / 2} L ${size} ${size} L 0 ${size} Z`;
      } else if (dir === 2) {
        // Vertical split - left half
        splitPath = `M 0 0 L ${size / 2} 0 L ${size / 2} ${size} L 0 ${size} Z`;
      } else {
        // Vertical split - right half
        splitPath = `M ${size / 2} 0 L ${size} 0 L ${size} ${size} L ${size / 2} ${size} Z`;
      }

      pathRef.current!.setAttribute("d", splitPath);
      pathRef.current!.setAttribute("fill", secondary);
    } else {
      // square - just the background, no path
      pathRef.current!.setAttribute("d", "M 0 0");
      pathRef.current!.setAttribute("fill", "none");
    }
  };

  const animateBlock = () => {
    if (!pathRef.current || !bgRef.current) return;

    stateRef.current = generateBlockState();

    // GSAP animation for smooth transition
    gsap.to(pathRef.current, {
      opacity: 0,
      duration: 0.4,
      onComplete: () => {
        renderShape();
        gsap.to(pathRef.current, {
          opacity: 1,
          duration: 0.4,
        });
      },
    });

    // Animate background color
    const [newPrimary] = stateRef.current.colorPair;
    gsap.to(bgRef.current, {
      attr: { fill: newPrimary },
      duration: 0.8,
    });
  };

  useImperativeHandle(ref, () => ({
    triggerAnimation: animateBlock,
  }));

  useEffect(() => {
    if (!svgRef.current || !pathRef.current || !bgRef.current) return;

    renderShape();

    // Auto-animate every 6 seconds
    const interval = setInterval(() => {
      animateBlock();
    }, 6000);

    return () => clearInterval(interval);
  }, [size]);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      style={{
        position: "absolute",
        left: `${x}px`,
        top: `${y}px`,
      }}
    >
      <rect
        ref={bgRef}
        width={size}
        height={size}
        fill={stateRef.current.colorPair[0]}
      />
      <path ref={pathRef} />
    </svg>
  );
});

Block.displayName = "Block";

interface AvatarGridBGProps {
  className?: string;
}

export const AvatarGridBG = ({ className }: AvatarGridBGProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const blockSize = 120; // Size of each block in pixels
  const [isAnimating, setIsAnimating] = useState(false);
  const blockRefs = useRef<(BlockHandle | null)[]>([null, null, null, null]);

  const handleClick = () => {
    if (isAnimating) return;

    setIsAnimating(true);

    // Trigger animation on all blocks
    blockRefs.current.forEach((block) => {
      block?.triggerAnimation();
    });

    // Block clicks for animation duration (0.8s max animation) + 0.5s buffer
    setTimeout(() => {
      setIsAnimating(false);
    }, 1300); // 0.8s animation + 0.5s buffer
  };

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      className={`relative bg-white overflow-hidden cursor-pointer ${className || ""}`}
      style={{
        width: blockSize * 2,
        height: blockSize * 2,
      }}
    >
      {/* 2x2 grid of blocks */}
      <Block ref={(el) => { blockRefs.current[0] = el; }} index={0} size={blockSize} x={0} y={0} />
      <Block ref={(el) => { blockRefs.current[1] = el; }} index={1} size={blockSize} x={blockSize} y={0} />
      <Block ref={(el) => { blockRefs.current[2] = el; }} index={2} size={blockSize} x={0} y={blockSize} />
      <Block ref={(el) => { blockRefs.current[3] = el; }} index={3} size={blockSize} x={blockSize} y={blockSize} />
    </div>
  );
};

export default AvatarGridBG;
