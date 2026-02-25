import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { TopographicMaterial } from './TopographicMaterial'; // Registers `<topographicMaterial>`


const MODELS = [
  '/assets/models/hero/crane.glb',
  '/assets/models/hero/boat-2.glb',
  '/assets/models/hero/airplane-2.glb',
  '/assets/models/hero/frog.glb',
];

const MODEL_CONFIGS = [
  // 0: Crane - Zoomed in and moved up
  { position: [0.5, 0.5, 0], scale: [3.2, 3.2, 3.2], camPos: [0, 0, 7] },
  // 1: Boat - Moved up, zoomed in, camera angled right
  { position: [-0.5, 0.0, 0], scale: [2.8, 2.8, 2.8], camPos: [2, 1, 6] },
  // 2: Airplane - Heavily zoomed in (kept GREAT position)
  { position: [0, 0.5, 0], scale: [4.5, 4.5, 4.5], camPos: [-1, -1, 6] },
  // 3: Frog - Moved up, top-down angle zoom
  { position: [0, -0.2, 0], scale: [3.2, 3.2, 3.2], camPos: [0, 3, 5] },
];

// Preload to ensure smooth transitions
MODELS.forEach((url) => useGLTF.preload(url));

export const OrigamiSequence = ({ isActive = true }: { isActive?: boolean }) => {
  const groupRef = useRef<THREE.Group>(null);

  const [currentIndex, setCurrentIndex] = useState(0);

  // Load the current model
  const { scene } = useGLTF(MODELS[currentIndex]);

  // Clone the scene so we can safely mutate its materials without affecting the cached version
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);

    // Calculate bounding box to normalize scale across different models
    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    box.getSize(size);

    // Find the maximum dimension
    const maxDim = Math.max(size.x, size.y, size.z);
    // Desired size is roughly 2.0 units in world space
    const targetSize = 2.0;
    const scale = targetSize / maxDim;

    // Apply uniform scale
    clone.scale.set(scale, scale, scale);

    // Center the model
    const center = new THREE.Vector3();
    box.getCenter(center);
    clone.position.copy(center).multiplyScalar(-scale);

    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        // Future mesh preparations
      }
    });
    return clone;
  }, [scene, currentIndex]);

  // Make sure we apply the material to all meshes in the cloned scene
  useMemo(() => {
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        // We ensure the mesh uses our shared shader material by grabbing it from the ref in useFrame,
        // but it's easier to just instantiate a new one here and update its uniforms globally.
      }
    });
  }, [clonedScene]);

  // Timer state
  // 12 Seconds total cycle:
  // 0-2s: Invisible (Opacity 0)
  // 2-4s: Fade In
  // 4-8s: Fully Visible (Opacity 1)
  // 8-10s: Fade Out
  // 10-12s: Invisible + Swap Model
  const timer = useRef(0);

  useFrame((state, delta) => {
    if (!isActive) return; // Pause logic and animation when offscreen

    const config = MODEL_CONFIGS[currentIndex];

    if (groupRef.current) {
      // Smoothly interpolate position and scale to match the current model's target config
      groupRef.current.position.lerp(new THREE.Vector3(...config.position), delta * 1.5);
      groupRef.current.scale.lerp(new THREE.Vector3(...config.scale), delta * 1.5);

      // Very slow, soothing rotation
      groupRef.current.rotation.y += delta * 0.15;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }

    // Smoothly transition camera position and lookAt center
    state.camera.position.lerp(new THREE.Vector3(...config.camPos), delta * 1.5);
    state.camera.lookAt(0, 0, 0); // Keep focused on center Origin

    // Sequence Logic
    timer.current += delta;
    const CYCLE_LENGTH = 20; // Increased to allow double display time
    const FADE_DUR = 0.66;   // 1/3 of the previous 2s
    const currentPhaseTime = timer.current % CYCLE_LENGTH;

    let targetOpacity = 0;

    // Wait 1s invisible at start of new model
    if (currentPhaseTime > 1 && currentPhaseTime <= 1 + FADE_DUR) {
      targetOpacity = (currentPhaseTime - 1) / FADE_DUR; // Fade In
    } else if (currentPhaseTime > 1 + FADE_DUR && currentPhaseTime <= 17 + FADE_DUR) {
      targetOpacity = 1; // Hold (Visible for 16 seconds - double the previous 8s)
    } else if (currentPhaseTime > 17 + FADE_DUR && currentPhaseTime <= 17 + FADE_DUR * 2) {
      targetOpacity = 1 - (currentPhaseTime - (17 + FADE_DUR)) / FADE_DUR; // Fade Out
    } else {
      targetOpacity = 0; // Wait
    }

    // Handle Model Swap at the very end of the cycle (when invisible)
    if (timer.current >= CYCLE_LENGTH) {
      timer.current = 0; // Reset timer
      setCurrentIndex((prev) => (prev + 1) % MODELS.length);
    }

    // Update material uniforms across all meshes
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (!mesh.userData.hasTopographicMaterial) {
          // Instantiate the material once per mesh
          mesh.material = new TopographicMaterial();
          mesh.userData.hasTopographicMaterial = true;

          // Optional: scale adjustments based on which model it is, since sketchfab models vary wildly in scale
          // Bird: ~1, Boat: ~1, Plane: ~1, Frog: ~1?
          // We will apply a uniform scale to the group.
        }

        // Safely update uniforms
        if (mesh.material && (mesh.material as any).uniforms) {
          (mesh.material as any).uniforms.uTime.value = state.clock.elapsedTime;
          (mesh.material as any).uniforms.uOpacity.value = targetOpacity;
        }
      }
    });
  });

  return (
    <group ref={groupRef} position={[0, -1, 0]} scale={[2, 2, 2]}>
      <primitive object={clonedScene} />
    </group>
  );
};
