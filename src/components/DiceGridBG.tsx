import { useRef, useEffect, useCallback } from "react";
import * as THREE from "three";

// ─── Tunables ────────────────────────────────────────────────────────────────
const COLS_DESKTOP = 10;
const ROWS_DESKTOP = 8;
const COLS_MOBILE = 8;
const ROWS_MOBILE = 10;
const BG_COLOR = "#ffffff";

const WAVE_FIRST_DELAY = 1_500;   // ms before the very first wave
const WAVE_INTERVAL = 3_000;      // ms between subsequent waves (set to 10_000–20_000 in production)
const WAVE_TRIGGER_DURATION = 600; // ms to propagate trigger across the grid
const FACE_FLIP_DURATION = 800; // ms each cube takes to flip

// Palette for faces 2-6 (random per cube, fixed at creation)
const FACE_COLORS = [
  "#3da5d9",
  "#e84855",
  "#f9c74f",
  "#43aa8b",
  "#9b5de5",
  "#f77f00",
  "#2d6a4f",
  "#c77dff",
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function easeBackOut(t: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

function makeTextTexture(text: string, bgColor: string): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = "#000000";
  ctx.font = `bold ${size * 0.55}px Arial, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, size / 2, size / 2);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

function makePlainTexture(color: string): THREE.CanvasTexture {
  const size = 4;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

// Returns 6 materials: face0=BG color (front), faces 1-5 = numbered colored faces
// THREE.BoxGeometry face order: +X, -X, +Y, -Y, +Z (front), -Z (back)
// We treat face index 4 (+Z) as "face 1" (BG) and the rest as numbered.
// For the flip animation we rotate around X axis:
//   rotation.x = 0   → face 1 (BG) visible  (front +Z)
//   rotation.x = π/2 → face showing top (+Y) → "face 2"
// We'll map:
//   face1 = front (+Z), face2 = top (+Y), face3 = right (+X),
//   face4 = bottom (-Y), face5 = left (-X), face6 = back (-Z)
function buildMaterials(faceColor: string): THREE.MeshBasicMaterial[] {
  // BoxGeometry slot order: [+X, -X, +Y, -Y, +Z, -Z]
  const slots: THREE.MeshBasicMaterial[] = [];

  // +X → face 3
  slots.push(new THREE.MeshBasicMaterial({ map: makeTextTexture("3", faceColor) }));
  // -X → face 5
  slots.push(new THREE.MeshBasicMaterial({ map: makeTextTexture("5", faceColor) }));
  // +Y → face 2
  slots.push(new THREE.MeshBasicMaterial({ map: makeTextTexture("2", faceColor) }));
  // -Y → face 4
  slots.push(new THREE.MeshBasicMaterial({ map: makeTextTexture("4", faceColor) }));
  // +Z → face 1 (BG color, no number)
  slots.push(new THREE.MeshBasicMaterial({ map: makePlainTexture(BG_COLOR) }));
  // -Z → face 6
  slots.push(new THREE.MeshBasicMaterial({ map: makeTextTexture("6", faceColor) }));

  return slots;
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
    const camera = new THREE.OrthographicCamera(
      -W / 2, W / 2,
      H / 2, -H / 2,
      0.1, 1000
    );
    camera.position.set(0, 0, 100);
    camera.lookAt(0, 0, 0);

    // ── Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(BG_COLOR);

    // ── Cube size: "cover" logic — squares stay square, grid overflows canvas edges
    // Take the larger of the two axes so the grid always covers the full canvas.
    const cubeSize = Math.max(W / COLS, H / ROWS);
    const geoW = cubeSize;
    const geoH = cubeSize;
    const geoD = cubeSize;

    // ── Build grid
    type CubeData = {
      mesh: THREE.Mesh;
      faceColor: string;
      currentFace: number; // 1-6
      targetFace: number;
      animating: boolean;
      animStart: number;
      animFrom: number; // rotation.x at anim start
      animTo: number;   // rotation.x target
    };

    const cubes: CubeData[][] = [];

    // Rotation.x values for each face index (0-based internally, face1=0..face6=5)
    // Rotating around X: face1(front) at 0, face2(top) at -π/2, face4(bottom) at π/2
    // face6(back) at π, face3(right)+face5(left) via Y axis
    // We keep it simple: all rotations around X only → 4 distinct visible faces
    // face1=0, face2=-π/2, face4=π/2, face6=π(=−π)
    // For face3 and face5 we'd need Y rotation — but per the brief, all dice rotate
    // in the same direction (X axis), so we'll use 4 meaningful faces on X:
    const FACE_ROTATIONS = [
      0,          // face 1 (BG)
      -Math.PI / 2, // face 2 (top)
      Math.PI,    // face 6 (back, repurposed as face 3)
      Math.PI / 2,  // face 4 (bottom)
    ];
    // We'll cycle through these 4 steps
    const FACE_STEPS = 4;

    const geometry = new THREE.BoxGeometry(geoW, geoH, geoD);

    for (let row = 0; row < ROWS; row++) {
      cubes[row] = [];
      for (let col = 0; col < COLS; col++) {
        const faceColor = FACE_COLORS[Math.floor(Math.random() * FACE_COLORS.length)];
        const materials = buildMaterials(faceColor);
        const mesh = new THREE.Mesh(geometry, materials);

        // Position: grid is centered so overflow is distributed evenly on all sides
        const gridW = cubeSize * COLS;
        const gridH = cubeSize * ROWS;
        const x = -gridW / 2 + cubeSize * col + cubeSize / 2;
        const y = gridH / 2 - cubeSize * row - cubeSize / 2;
        mesh.position.set(x, y, 0);

        scene.add(mesh);
        cubes[row][col] = {
          mesh,
          faceColor,
          currentFace: 0,
          targetFace: 0,
          animating: false,
          animStart: 0,
          animFrom: 0,
          animTo: 0,
        };
      }
    }

    // ── Wave trigger logic
    let nextWaveTime = performance.now() + WAVE_FIRST_DELAY;

    function triggerWave() {
      // Pick a random corner: 0=TL, 1=TR, 2=BL, 3=BR
      const corner = Math.floor(Math.random() * 4);
      const startRow = corner < 2 ? 0 : ROWS - 1;
      const startCol = corner % 2 === 0 ? 0 : COLS - 1;
      const endRow = ROWS - 1 - startRow;
      const endCol = COLS - 1 - startCol;

      const maxDist = Math.sqrt(
        Math.pow(endRow - startRow, 2) + Math.pow(endCol - startCol, 2)
      );

      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          const dist = Math.sqrt(
            Math.pow(row - startRow, 2) + Math.pow(col - startCol, 2)
          );
          const triggerDelay = (dist / (maxDist || 1)) * WAVE_TRIGGER_DURATION;

          const cube = cubes[row][col];
          const nextFaceStep = (cube.currentFace + 1) % FACE_STEPS;

          // Schedule this cube's animation
          setTimeout(() => {
            if (cube.animating) return; // skip if already mid-flip
            const fromAngle = FACE_ROTATIONS[cube.currentFace];
            const toAngle = FACE_ROTATIONS[nextFaceStep];
            // Ensure we always rotate in the negative X direction (forward roll)
            let delta = toAngle - fromAngle;
            // Normalize to always go in -X direction
            if (delta > 0) delta -= Math.PI * 2;
            cube.animFrom = fromAngle;
            cube.animTo = fromAngle + delta;
            cube.animStart = performance.now();
            cube.animating = true;
            cube.targetFace = nextFaceStep;
          }, triggerDelay);
        }
      }
    }

    // ── Animation loop
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

      // Check if it's time for a new wave
      if (now >= nextWaveTime) {
        triggerWave();
        nextWaveTime = now + WAVE_INTERVAL;
      }

      // Update animations
      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          const cube = cubes[row][col];
          if (!cube.animating) continue;

          const elapsed = now - cube.animStart;
          const t = Math.min(elapsed / FACE_FLIP_DURATION, 1);
          const eased = easeBackOut(t);

          cube.mesh.rotation.x = cube.animFrom + (cube.animTo - cube.animFrom) * eased;

          if (t >= 1) {
            cube.mesh.rotation.x = cube.animTo;
            cube.currentFace = cube.targetFace;
            cube.animating = false;
          }
        }
      }

      renderer.render(scene, camera);
    }

    animate();

    // ── Resize handler
    const onResize = () => {
      // Full teardown and re-setup on resize for simplicity
      cleanup();
      setupScene();
    };
    window.addEventListener("resize", onResize);

    function cleanup() {
      cancelAnimationFrame(animFrameId);
      observer.disconnect();
      window.removeEventListener("resize", onResize);
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
