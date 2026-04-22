import { useRef, useEffect, useCallback } from "react";
import * as THREE from "three";

// ─── Tunables ────────────────────────────────────────────────────────────────
const COLS_DESKTOP = 10;
const ROWS_DESKTOP = 8;
const COLS_MOBILE = 8;
const ROWS_MOBILE = 10;
const BG_COLOR = "#ffffff";

const WAVE_FIRST_DELAY = 1_500;    // ms before first wave
const WAVE_INTERVAL = 3_000;       // ms between subsequent waves
const WAVE_TRIGGER_DURATION = 600; // ms to spread trigger across the grid
const FACE_FLIP_DURATION = 800;    // ms per cube flip
const Z_WOBBLE_AMOUNT = 0.18;      // radians of Z-axis wobble at peak (~10°)

const FACE_COLORS = [
  "#3da5d9", "#e84855", "#f9c74f", "#43aa8b",
  "#9b5de5", "#f77f00", "#2d6a4f", "#c77dff",
];

// ─── Face / slot mapping ──────────────────────────────────────────────────────
// BoxGeometry material slots: [+X(0), -X(1), +Y(2), -Y(3), +Z(4), -Z(5)]
//
// Rotating on -X axis (forward roll), each step = -π/2:
//   step 0 → slot 4 (+Z)  visible
//   step 1 → slot 2 (+Y)  visible
//   step 2 → slot 5 (-Z)  visible
//   step 3 → slot 3 (-Y)  visible
const X_FACE_SLOTS = [4, 2, 5, 3];

// Rotating on -Y axis (rightward roll), each step = -π/2:
//   step 0 → slot 4 (+Z)  visible
//   step 1 → slot 0 (+X)  visible
//   step 2 → slot 5 (-Z)  visible
//   step 3 → slot 1 (-X)  visible
const Y_FACE_SLOTS = [4, 0, 5, 1];

// Face label (number) drawn on each slot
const SLOT_FACE_NUMS: (number | null)[] = [3, 5, 2, 4, 1, 6];
// slot 4 (+Z) starts as BG white (only on initial load), then becomes face 1 with number.

// ─── Helpers ─────────────────────────────────────────────────────────────────
function easeBackOut(t: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

function pickColor(): string {
  return FACE_COLORS[Math.floor(Math.random() * FACE_COLORS.length)];
}

function pickDifferentColor(from: string): string {
  let c = pickColor();
  let tries = 0;
  while (c === from && tries++ < 10) c = pickColor();
  return c;
}

/**
 * Generate a random pattern texture.
 * faceNum = null  → plain BG white (the initial hidden face)
 * faceNum = 1–6   → colored pattern with number label
 */
function makePatternTexture(faceNum: number | null): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  if (faceNum === null) {
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, size, size);
  } else {
    const c1 = pickColor();
    const c2 = pickDifferentColor(c1);
    const family = Math.floor(Math.random() * 3); // 0=solid, 1=diagonal, 2=quarter-circle

    if (family === 0) {
      // ── Solid color
      ctx.fillStyle = c1;
      ctx.fillRect(0, 0, size, size);

    } else if (family === 1) {
      // ── Diagonal split — 4 triangle directions
      ctx.fillStyle = c1;
      ctx.fillRect(0, 0, size, size);
      ctx.fillStyle = c2;
      ctx.beginPath();
      const dir = Math.floor(Math.random() * 4);
      if (dir === 0) {
        // c2 bottom-right triangle
        ctx.moveTo(size, 0); ctx.lineTo(size, size); ctx.lineTo(0, size);
      } else if (dir === 1) {
        // c2 bottom-left triangle
        ctx.moveTo(0, 0); ctx.lineTo(0, size); ctx.lineTo(size, size);
      } else if (dir === 2) {
        // c2 top-right triangle
        ctx.moveTo(0, 0); ctx.lineTo(size, 0); ctx.lineTo(size, size);
      } else {
        // c2 top-left triangle
        ctx.moveTo(0, 0); ctx.lineTo(size, 0); ctx.lineTo(0, size);
      }
      ctx.closePath();
      ctx.fill();

    } else {
      // ── Quarter-circle sector from a corner
      // radius = size so the arc exactly touches the two adjacent edges.
      // moveTo(corner) + arc + closePath() makes a pie-sector, not a chord.
      ctx.fillStyle = c1;
      ctx.fillRect(0, 0, size, size);
      ctx.fillStyle = c2;
      const corner = Math.floor(Math.random() * 4); // 0=TL, 1=TR, 2=BL, 3=BR
      const cx = corner === 1 || corner === 3 ? size : 0;
      const cy = corner === 2 || corner === 3 ? size : 0;
      // Each pair sweeps exactly π/2 so the arc touches both adjacent sides.
      // Canvas angles: 0=right, π/2=down, π=left, 3π/2=up (Y-axis points down).
      const quarterAngles: [number, number][] = [
        [0,              Math.PI / 2],      // TL (0,0)    → arc right→down
        [Math.PI / 2,    Math.PI],           // TR (W,0)    → arc down→left
        [-Math.PI / 2,   0],                 // BL (0,H)    → arc up→right
        [Math.PI,        3 * Math.PI / 2],   // BR (W,H)    → arc left→up
      ];
      const [startA, endA] = quarterAngles[corner];
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, size, startA, endA);
      ctx.closePath();
      ctx.fill();
    }

    // ── Number label — white stroke + black fill for readability on any bg
    ctx.save();
    ctx.font = `bold ${size * 0.46}px Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.lineWidth = size * 0.06;
    ctx.strokeStyle = "rgba(255,255,255,0.65)";
    ctx.strokeText(String(faceNum), size / 2, size / 2);
    ctx.fillStyle = "#000000";
    ctx.fillText(String(faceNum), size / 2, size / 2);
    ctx.restore();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

/** All 6 faces start as BG white — only slot 4 (+Z front) is visible initially. */
function buildInitialMaterials(): THREE.MeshBasicMaterial[] {
  return Array.from({ length: 6 }, () =>
    new THREE.MeshBasicMaterial({ map: makePatternTexture(null) })
  );
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

    // ── Orthographic camera — units = pixels
    const camera = new THREE.OrthographicCamera(
      -W / 2, W / 2, H / 2, -H / 2, 0.1, 1000
    );
    camera.position.set(0, 0, 100);
    camera.lookAt(0, 0, 0);

    // ── Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(BG_COLOR);

    // ── Cover-fit: square cubes, grid covers the whole canvas
    const cubeSize = Math.max(W / COLS, H / ROWS);
    const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);

    // ── Per-cube state
    type CubeData = {
      mesh: THREE.Mesh;
      materials: THREE.MeshBasicMaterial[];
      stepX: number;       // completed X-axis flips mod 4
      stepY: number;       // completed Y-axis flips mod 4
      hasEverFlipped: boolean; // latches true on first flip, never resets
      animating: boolean;
      animStart: number;
      flipAxis: "x" | "y";
      animFromX: number;
      animToX: number;
      animFromY: number;
      animToY: number;
      wobbleDir: number;   // ±1 for Z wobble direction
    };

    const cubes: CubeData[][] = [];
    const gridW = cubeSize * COLS;
    const gridH = cubeSize * ROWS;

    for (let row = 0; row < ROWS; row++) {
      cubes[row] = [];
      for (let col = 0; col < COLS; col++) {
        const materials = buildInitialMaterials();
        const mesh = new THREE.Mesh(geometry, materials);
        const x = -gridW / 2 + cubeSize * col + cubeSize / 2;
        const y = gridH / 2 - cubeSize * row - cubeSize / 2;
        mesh.position.set(x, y, 0);
        scene.add(mesh);
        cubes[row][col] = {
          mesh, materials,
          stepX: 0, stepY: 0,
          hasEverFlipped: false,
          animating: false, animStart: 0,
          flipAxis: "x",
          animFromX: 0, animToX: 0,
          animFromY: 0, animToY: 0,
          wobbleDir: 1,
        };
      }
    }

    // ── Initialize slot 4 (front face) with the number "1" pattern
    function refreshSlot(cube: CubeData, slot: number) {
      const rawNum = SLOT_FACE_NUMS[slot];
      const num: number | null = (slot === 4 && !cube.hasEverFlipped) ? null : (rawNum ?? 1);
      const oldTex = cube.materials[slot].map;
      if (oldTex) oldTex.dispose();
      cube.materials[slot].map = makePatternTexture(num);
      cube.materials[slot].needsUpdate = true;
    }

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        // Show the "1" on the initial front face (slot 4) by setting hasEverFlipped to true temporarily
        cubes[row][col].hasEverFlipped = true;
        refreshSlot(cubes[row][col], 4);
        cubes[row][col].hasEverFlipped = false;
      }
    }

    // ── Wave logic
    let nextWaveTime = performance.now() + WAVE_FIRST_DELAY;

    // ── Debug keyboard controls + visual display
    let lastPressedFace: number | null = null;
    let currentVisibleFace: number | null = null;

    // Create debug display element
    const debugDisplay = document.createElement("div");
    debugDisplay.id = "dice-debug-display";
    debugDisplay.style.cssText = `
      position: fixed;
      top: 10px;
      left: 10px;
      background: rgba(0,0,0,0.8);
      color: #00ff00;
      padding: 12px 16px;
      font-family: monospace;
      font-size: 14px;
      border: 2px solid #00ff00;
      border-radius: 4px;
      z-index: 10000;
      line-height: 1.6;
    `;
    debugDisplay.innerHTML = "DICE DEBUG<br>Press 1-6 for faces<br>Last pressed: —<br>Current visible: —";
    mount.appendChild(debugDisplay);

    const updateDebugDisplay = () => {
      debugDisplay.innerHTML = `
        DICE DEBUG<br>
        Press 1-6 for faces<br>
        Last pressed: ${lastPressedFace || "—"}<br>
        Current visible: ${currentVisibleFace || "—"}
      `;
    };

    const handleDebugKey = (e: KeyboardEvent) => {
      console.log(`Keydown detected: "${e.key}" (code: ${e.code})`);

      const key = parseInt(e.key, 10);
      if (isNaN(key) || key < 1 || key > 6) {
        console.log(`  → Not a face number 1-6, ignoring`);
        return;
      }

      e.preventDefault();
      currentVisibleFace = key;
      console.log(`✓ Face key pressed: ${key}. Last pressed: ${lastPressedFace}`);

      if (lastPressedFace === key) {
        // Same key pressed → rotate randomly
        const rotations = [Math.PI / 2, Math.PI, -Math.PI / 2];
        const randomRotation = rotations[Math.floor(Math.random() * rotations.length)];
        console.log(`  → Rotating face ${key} by ${(randomRotation * 180) / Math.PI}°`);

        // Apply rotation to all cubes
        for (let row = 0; row < ROWS; row++) {
          for (let col = 0; col < COLS; col++) {
            const cube = cubes[row][col];
            if (cube.animating) continue;

            // Randomly choose X or Y axis
            const axis = Math.random() < 0.5 ? "x" : "y";
            cube.wobbleDir = Math.random() < 0.5 ? 1 : -1;

            if (axis === "x") {
              cube.animFromX = cube.mesh.rotation.x;
              cube.animToX = cube.mesh.rotation.x + randomRotation;
              cube.animFromY = cube.mesh.rotation.y;
              cube.animToY = cube.mesh.rotation.y;
            } else {
              cube.animFromX = cube.mesh.rotation.x;
              cube.animToX = cube.mesh.rotation.x;
              cube.animFromY = cube.mesh.rotation.y;
              cube.animToY = cube.mesh.rotation.y + randomRotation;
            }

            cube.animStart = performance.now();
            cube.animating = true;
          }
        }
      } else {
        // Different key → show that face
        console.log(`  → Showing face ${key}`);
        lastPressedFace = key;
        nextWaveTime = performance.now() + WAVE_INTERVAL; // Reset timer
      }

      lastPressedFace = key;
      updateDebugDisplay();
    };

    window.addEventListener("keydown", handleDebugKey);
    console.log("✓ DiceGridBG keyboard handler registered. Press 1-6 to debug.");

    // ── Wave logic (original)

    function triggerWave() {
      const corner = Math.floor(Math.random() * 4);
      const startRow = corner < 2 ? 0 : ROWS - 1;
      const startCol = corner % 2 === 0 ? 0 : COLS - 1;
      const endRow = ROWS - 1 - startRow;
      const endCol = COLS - 1 - startCol;
      const maxDist = Math.sqrt(
        Math.pow(endRow - startRow, 2) + Math.pow(endCol - startCol, 2)
      );

      // All cubes in this wave share the same axis → organised movement.
      // Alternates X / Y randomly each wave.
      const waveAxis: "x" | "y" = Math.random() < 0.5 ? "x" : "y";

      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          const dist = Math.sqrt(
            Math.pow(row - startRow, 2) + Math.pow(col - startCol, 2)
          );
          const delay = (dist / (maxDist || 1)) * WAVE_TRIGGER_DURATION;
          const cube = cubes[row][col];

          setTimeout(() => {
            if (cube.animating) return;

            cube.hasEverFlipped = true;
            cube.flipAxis = waveAxis;

            if (waveAxis === "x") {
              const nextStep = (cube.stepX + 1) % 4;
              refreshSlot(cube, X_FACE_SLOTS[nextStep]);
              cube.animFromX = cube.mesh.rotation.x;
              cube.animToX   = cube.mesh.rotation.x - Math.PI / 2;
              cube.animFromY = cube.mesh.rotation.y;
              cube.animToY   = cube.mesh.rotation.y;
            } else {
              const nextStep = (cube.stepY + 1) % 4;
              refreshSlot(cube, Y_FACE_SLOTS[nextStep]);
              cube.animFromX = cube.mesh.rotation.x;
              cube.animToX   = cube.mesh.rotation.x;
              cube.animFromY = cube.mesh.rotation.y;
              cube.animToY   = cube.mesh.rotation.y - Math.PI / 2;
            }

            cube.wobbleDir  = Math.random() < 0.5 ? 1 : -1;
            cube.animStart  = performance.now();
            cube.animating  = true;
          }, delay);
        }
      }
    }

    // ── Render loop
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

      if (now >= nextWaveTime) {
        triggerWave();
        nextWaveTime = now + WAVE_INTERVAL;
      }

      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          const cube = cubes[row][col];
          if (!cube.animating) continue;

          const elapsed = now - cube.animStart;
          const t = Math.min(elapsed / FACE_FLIP_DURATION, 1);
          const eased = easeBackOut(t);

          cube.mesh.rotation.x = cube.animFromX + (cube.animToX - cube.animFromX) * eased;
          cube.mesh.rotation.y = cube.animFromY + (cube.animToY - cube.animFromY) * eased;
          // Z wobble: bell curve — peaks at t=0.5, back to 0 at t=1
          cube.mesh.rotation.z = Math.sin(t * Math.PI) * Z_WOBBLE_AMOUNT * cube.wobbleDir;

          if (t >= 1) {
            cube.mesh.rotation.x = cube.animToX;
            cube.mesh.rotation.y = cube.animToY;
            cube.mesh.rotation.z = 0;
            if (cube.flipAxis === "x") {
              cube.stepX = (cube.stepX + 1) % 4;
            } else {
              cube.stepY = (cube.stepY + 1) % 4;
            }
            cube.animating = false;
          }
        }
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
      window.removeEventListener("keydown", handleDebugKey);
      renderer.dispose();
      geometry.dispose();
      if (mount && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      if (mount && mount.contains(debugDisplay)) {
        mount.removeChild(debugDisplay);
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
