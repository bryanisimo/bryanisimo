import { useRef, useEffect, useCallback } from "react";
import * as THREE from "three";
import gsap from "gsap";

// ─── Tunables ────────────────────────────────────────────────────────────────
const COLS_DESKTOP = 14;
const ROWS_DESKTOP = 10;
const COLS_MOBILE  = 8;
const ROWS_MOBILE  = 10;
const BG_COLOR = "#ffffff";

const WAVE_FIRST_DELAY = 1_500; // ms before first auto-wave
const WAVE_INTERVAL    = 3_000; // ms between auto-waves
const WAVE_SPREAD      = 0.6;   // seconds for wave to cross entire grid
const FLIP_DURATION    = 0.8;   // seconds per flip
const Z_WOBBLE         = 0.18;  // radians peak Z wobble

// Color pairs: each pair represents [primary, secondary] for patterns
const FACE_COLOR_PAIRS: Array<[string, string]> = [
  ["#4fc6e3", "#1985a1"], // cyan pair
  ["#e71d36", "#fe4a49"], // red pair
  ["#ffae03", "#ffbe33"], // gold pair
  ["#4da852", "#9bc53d"], // green pair
];

// ─── Face / slot mapping ──────────────────────────────────────────────────────
// BoxGeometry material slots: +X(0), -X(1), +Y(2), -Y(3), +Z(4), -Z(5)
// Default orientation: +Z faces the camera at rotation(0, 0, 0)

// Face number drawn on each geometry slot
const SLOT_FACE_NUMS = [3, 5, 4, 2, 1, 6];
//                       +X -X +Y -Y +Z -Z

// Absolute (rx, ry) rotation to show each face number
const FACE_ROTATION: Record<number, { rx: number; ry: number }> = {
  1: { rx: 0,              ry: 0            }, // +Z front  (slot 4)
  2: { rx: -Math.PI / 2,   ry: 0            }, // +Y top    (slot 2)
  3: { rx: 0,              ry: -Math.PI / 2 }, // +X right  (slot 0)
  4: { rx:  Math.PI / 2,   ry: 0            }, // -Y bottom (slot 3)
  5: { rx: 0,              ry:  Math.PI / 2 }, // -X left   (slot 1)
  6: { rx:  Math.PI,       ry: 0            }, // -Z back   (slot 5)
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function pickColorPair(): [string, string] {
  return FACE_COLOR_PAIRS[Math.floor(Math.random() * FACE_COLOR_PAIRS.length)];
}

function makePatternTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width  = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  const [c1, c2] = pickColorPair();
  const family = Math.floor(Math.random() * 3);

  if (family === 0) {
    ctx.fillStyle = c1;
    ctx.fillRect(0, 0, size, size);

  } else if (family === 1) {
    ctx.fillStyle = c1;
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = c2;
    ctx.beginPath();
    const dir = Math.floor(Math.random() * 4);
    if      (dir === 0) { ctx.moveTo(size, 0); ctx.lineTo(size, size); ctx.lineTo(0, size); }
    else if (dir === 1) { ctx.moveTo(0, 0);    ctx.lineTo(0, size);    ctx.lineTo(size, size); }
    else if (dir === 2) { ctx.moveTo(0, 0);    ctx.lineTo(size, 0);    ctx.lineTo(size, size); }
    else                { ctx.moveTo(0, 0);    ctx.lineTo(size, 0);    ctx.lineTo(0, size); }
    ctx.closePath();
    ctx.fill();

  } else {
    ctx.fillStyle = c1;
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = c2;
    const corner = Math.floor(Math.random() * 4);
    const cx = corner === 1 || corner === 3 ? size : 0;
    const cy = corner === 2 || corner === 3 ? size : 0;
    const quarterAngles: [number, number][] = [
      [0,            Math.PI / 2     ],
      [Math.PI / 2,  Math.PI         ],
      [-Math.PI / 2, 0               ],
      [Math.PI,      3 * Math.PI / 2 ],
    ];
    const [startA, endA] = quarterAngles[corner];
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, size, startA, endA);
    ctx.closePath();
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

// ─── Component ───────────────────────────────────────────────────────────────
interface DiceGridBGProps {
  className?: string;
}

export function DiceGridBG({ className }: DiceGridBGProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  const setupScene = useCallback(() => {
    const mount = mountRef.current;
    if (!mount) return () => {};

    const W = mount.clientWidth;
    const H = mount.clientHeight;
    const isMobile = W < 768;
    const COLS = isMobile ? COLS_MOBILE : COLS_DESKTOP;
    const ROWS = isMobile ? ROWS_MOBILE : ROWS_DESKTOP;

    // ── Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(BG_COLOR);
    mount.appendChild(renderer.domElement);

    // ── Camera (orthographic, units = pixels)
    const camera = new THREE.OrthographicCamera(-W/2, W/2, H/2, -H/2, 0.1, 1000);
    camera.position.set(0, 0, 100);
    camera.lookAt(0, 0, 0);

    // ── Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(BG_COLOR);

    // ── Grid — cover-fit with perfect squares
    const cubeSize = Math.max(W / COLS, H / ROWS);
    const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    const gridW = cubeSize * COLS;
    const gridH = cubeSize * ROWS;

    // Pre-bake ALL 6 face textures per cube — no lazy generation, no white faces
    const meshes: THREE.Mesh[][] = [];
    for (let row = 0; row < ROWS; row++) {
      meshes[row] = [];
      for (let col = 0; col < COLS; col++) {
        const materials = SLOT_FACE_NUMS.map(() =>
          new THREE.MeshBasicMaterial({ map: makePatternTexture() })
        );
        const mesh = new THREE.Mesh(geometry, materials);
        const x = -gridW / 2 + cubeSize * col + cubeSize / 2;
        const y =  gridH / 2 - cubeSize * row - cubeSize / 2;
        mesh.position.set(x, y, 0);
        scene.add(mesh);
        meshes[row][col] = mesh;
      }
    }

    // ── Animate a cube to a target rotation with Z wobble bell curve
    function animateCube(
      mesh: THREE.Mesh,
      targetX: number,
      targetY: number,
      delay: number,
    ) {
      const wobbleDir = Math.random() < 0.5 ? 1 : -1;

      // Linear proxy drives Z wobble: sin(t*π) = bell curve peaking at t=0.5
      const proxy = { t: 0 };
      gsap.to(proxy, {
        t: 1,
        duration: FLIP_DURATION,
        delay,
        ease: "none",
        onUpdate: () => {
          mesh.rotation.z = Math.sin(proxy.t * Math.PI) * Z_WOBBLE * wobbleDir;
        },
        onComplete: () => { mesh.rotation.z = 0; },
      });

      // Main X/Y rotation tween
      gsap.to(mesh.rotation, {
        x: targetX,
        y: targetY,
        duration: FLIP_DURATION,
        delay,
        ease: "back.out(1.7)",
      });
    }

    // ── Auto-wave: all cubes step -π/2 on a shared axis, diagonal propagation
    function triggerWave() {
      startAnimation();
      const corner   = Math.floor(Math.random() * 4);
      const startRow = corner < 2 ? 0 : ROWS - 1;
      const startCol = corner % 2 === 0 ? 0 : COLS - 1;
      const maxDist  = Math.sqrt(Math.pow(ROWS - 1, 2) + Math.pow(COLS - 1, 2));
      const axis     = Math.random() < 0.5 ? "x" : "y";

      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          const dist  = Math.sqrt(Math.pow(row - startRow, 2) + Math.pow(col - startCol, 2));
          const delay = (dist / maxDist) * WAVE_SPREAD;
          const mesh  = meshes[row][col];
          const tx    = axis === "x" ? mesh.rotation.x - Math.PI / 2 : mesh.rotation.x;
          const ty    = axis === "y" ? mesh.rotation.y - Math.PI / 2 : mesh.rotation.y;
          animateCube(mesh, tx, ty, delay);
        }
      }
    }

    // ── Show a specific face: wave all cubes to the exact rotation for face N
    function showFace(faceNum: number) {
      const { rx, ry } = FACE_ROTATION[faceNum];
      const corner   = Math.floor(Math.random() * 4);
      const startRow = corner < 2 ? 0 : ROWS - 1;
      const startCol = corner % 2 === 0 ? 0 : COLS - 1;
      const maxDist  = Math.sqrt(Math.pow(ROWS - 1, 2) + Math.pow(COLS - 1, 2));

      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          const dist  = Math.sqrt(Math.pow(row - startRow, 2) + Math.pow(col - startCol, 2));
          const delay = (dist / maxDist) * WAVE_SPREAD;
          const mesh  = meshes[row][col];

          // Normalize accumulated rotation so GSAP takes the short path
          mesh.rotation.x = mesh.rotation.x % (2 * Math.PI);
          mesh.rotation.y = mesh.rotation.y % (2 * Math.PI);

          animateCube(mesh, rx, ry, delay);
        }
      }
    }

    // ── Auto-wave timer
    let nextWaveTime = performance.now() + WAVE_FIRST_DELAY;

    // ── Animation blocking: prevent input during transitions
    let isAnimating = false;
    let animationEndTime = 0;

    function startAnimation() {
      isAnimating = true;
      const maxDelay = WAVE_SPREAD; // diagonal wave propagates over this duration
      animationEndTime = performance.now() + maxDelay + (FLIP_DURATION * 1000); // convert to ms
    }

    // ── Keyboard: press 1-6 to show that face on every cube
    const handleKeyDown = (e: KeyboardEvent) => {
      // Block input while animating
      if (isAnimating) return;

      const key = parseInt(e.key, 10);
      if (isNaN(key) || key < 1 || key > 6) return;
      e.preventDefault();
      startAnimation();
      showFace(key);
      nextWaveTime = performance.now() + WAVE_INTERVAL; // pause auto-wave
    };
    window.addEventListener("keydown", handleKeyDown);

    // ── Render loop — GSAP drives animations, RAF just renders each frame
    let animFrameId: number;
    let visible = true;
    const observer = new IntersectionObserver(
      ([entry]) => { visible = entry.isIntersecting; },
      { threshold: 0.01 }
    );
    observer.observe(mount);

    function animate() {
      animFrameId = requestAnimationFrame(animate);
      if (!visible) return;
      const now = performance.now();

      // Check if animation is complete
      if (isAnimating && now >= animationEndTime) {
        isAnimating = false;
      }

      if (now >= nextWaveTime) {
        triggerWave();
        nextWaveTime = now + WAVE_INTERVAL;
      }
      renderer.render(scene, camera);
    }
    animate();

    // ── Resize: tear down and rebuild
    const onResize = () => { cleanup(); setupScene(); };
    window.addEventListener("resize", onResize);

    function cleanup() {
      cancelAnimationFrame(animFrameId);
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", handleKeyDown);
      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          gsap.killTweensOf(meshes[row][col].rotation);
        }
      }
      renderer.dispose();
      geometry.dispose();
      if (mount && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    }

    return cleanup;
  }, []);

  useEffect(() => {
    const cleanup = setupScene();
    return cleanup;
  }, [setupScene]);

  return (
    <div
      ref={mountRef}
      className={className}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    />
  );
}
