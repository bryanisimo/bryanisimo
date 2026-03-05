import { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import { OrthographicCamera } from '@react-three/drei';
import * as THREE from 'three';
import { getAssetPath } from '../utils/paths';

const videos = [
  getAssetPath('/assets/videos/video-1.mp4'),
  getAssetPath('/assets/videos/video-2.mp4'),
  getAssetPath('/assets/videos/video-3.mp4')
];

// No static color array needed here anymore, the Hero component will provide it.

const fragmentShader = `
uniform sampler2D uTexture;
uniform vec3 uTargetColor;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMediaResolution;
uniform vec2 uMouse;

varying vec2 vUv;

// Utility for creating procedural true hexagons
float hexDist(vec2 p) {
    p = abs(p);
    float c = dot(p, normalize(vec2(1.0, 1.7320508))); // sqrt(3)
    return max(c, p.x);
}

// RGB to HSV conversion
vec3 rgb2hsv(vec3 c) {
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

// HSV to RGB conversion
vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
    // Preserve aspect ratio like 'object-cover' CSS
    vec2 ratio = vec2(
        min((uResolution.x / uResolution.y) / (uMediaResolution.x / uMediaResolution.y), 1.0),
        min((uResolution.y / uResolution.x) / (uMediaResolution.y / uMediaResolution.x), 1.0)
    );

    // Scale up slightly (e.g. 1.10) to push edges out, and shift slightly to hide bottom right watermark
    float scale = 1.10;
    vec2 offset = vec2(0.04, 0.04); // shift right/up slightly in UV space

    // Calculate base object-cover UVs
    vec2 baseUv = vec2(
        vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
        vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );

    // Apply zoom and offset to mask corners
    vec2 uv = (baseUv - 0.5) / scale + 0.5 - offset;

    // Add subtle parallax offset based on uMouse
    uv += uMouse * 0.015;

    vec4 texColor = texture2D(uTexture, uv);

    vec3 pixelHsv = rgb2hsv(texColor.rgb);
    vec3 targetHsv = rgb2hsv(uTargetColor);

    // Circular distance for hue (0.0 to 1.0)
    float hueDist = min(abs(pixelHsv.x - targetHsv.x), 1.0 - abs(pixelHsv.x - targetHsv.x));

    // Smoothstep creates a soft blend. Adjust 0.05 and 0.15 to shrink/expand color match range
    float match = 1.0 - smoothstep(0.04, 0.12, hueDist);

    // Desaturate any colors that don't match the current target hue
    pixelHsv.y *= match;

    vec3 finalColor = hsv2rgb(pixelHsv);

    // --- Procedural True Honeycomb Filter ---
    // Create a 2D coordinate system scaled by screen pixels
    // Adjust 0.15 to change the size of the hexagons
    vec2 gridUv = vUv * uResolution * 0.145;

    // Core hex math setup
    vec2 r = vec2(1.0, 1.7320508); // hex ratio
    vec2 h = r * 0.5;
    vec2 a = mod(gridUv, r) - h;
    vec2 b = mod(gridUv - h, r) - h;
    vec2 gv = dot(a, a) < dot(b, b) ? a : b;

    // Distance field for hexagon
    float d = hexDist(gv);

    // We want a line on the edge. The edge is at d = 0.5.
    // We use smoothstep to draw a line around 0.5
    float hexLine = smoothstep(0.40, 0.48, d) - smoothstep(0.48, 0.51, d);

    // Mix the grid line with white, using 0.2 opacity so it is subtle
    finalColor = mix(finalColor, vec3(1.0), hexLine * 0.1);
    // --------------------------------------------------

    gl_FragColor = vec4(finalColor, texColor.a);
}
`;

const vertexShader = `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

function SceneObj({ isVisible, targetHue, setIsTransitioning }: { isVisible: boolean, targetHue: string, setIsTransitioning: (val: boolean) => void }) {
  const { size } = useThree();

  const [video] = useState(() => {
    const vid = document.createElement('video');
    vid.src = videos[0];
    vid.crossOrigin = 'Anonymous';
    vid.loop = false;
    vid.muted = true;
    vid.playsInline = true;
    vid.autoplay = true;
    vid.play().catch(() => console.log("Autoplay blocked initially"));
    return vid;
  });

  const textureRef = useRef<THREE.VideoTexture | null>(null);
  if (!textureRef.current) {
    textureRef.current = new THREE.VideoTexture(video);
    textureRef.current.minFilter = THREE.LinearFilter;
    textureRef.current.magFilter = THREE.LinearFilter;
    textureRef.current.colorSpace = THREE.SRGBColorSpace;
  }

  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const currentColorObj = useMemo(() => new THREE.Color(targetHue), []);
  const targetColorObj = useMemo(() => new THREE.Color(targetHue), []);
  const mediaRes = useMemo(() => new THREE.Vector2(1920, 1080), []);
  const screenRes = useMemo(() => new THREE.Vector2(), []);
  const mousePos = useMemo(() => new THREE.Vector2(), []);
  const targetMousePos = useMemo(() => new THREE.Vector2(), []);

  useEffect(() => {
    let currentVidIndex = 0;
    let isFading = false;

    const handleTimeUpdate = () => {
      // Trigger fade 0.6s before video ends
      if (video.duration > 0 && video.duration - video.currentTime < 0.6 && !isFading) {
        isFading = true;
        setIsTransitioning(true);

        // Swap video after fade completes
        setTimeout(() => {
          currentVidIndex = (currentVidIndex + 1) % videos.length;
          video.src = videos[currentVidIndex];
          video.play().catch(() => { });
        }, 500);
      }
    };
    const handleLoadedData = () => {
      if (video.videoWidth && video.videoHeight) {
        mediaRes.set(video.videoWidth, video.videoHeight);
      }
      if (isFading) {
        isFading = false;
        setIsTransitioning(false);
      }
    }
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadeddata', handleLoadedData);
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.pause();
      video.src = '';
      video.load();
    };
  }, [video, mediaRes, setIsTransitioning]);

  useEffect(() => {
    if (isVisible) {
      video.play().catch(() => { });
    } else {
      video.pause();
    }
  }, [isVisible, video]);

  useFrame((state, delta) => {        // Clamp delta to prevent massive jumps when the browser tab returns from background idle state
    if (!isVisible) return;

    const safeDelta = Math.min(delta, 0.1);

    screenRes.set(size.width, size.height);

    // Parallax mouse target easing
    targetMousePos.set(state.pointer.x, state.pointer.y);
    mousePos.lerp(targetMousePos, safeDelta * 2.0);

    const time = state.clock.getElapsedTime();

    // Update the target color based on the React prop
    targetColorObj.set(targetHue);

    // Smoothly transition our target hue using standard lerp
    currentColorObj.lerp(targetColorObj, safeDelta * 1.5);

    if (materialRef.current) {
      materialRef.current.uniforms.uTargetColor.value.copy(currentColorObj);
      materialRef.current.uniforms.uTime.value = time;
      materialRef.current.uniforms.uResolution.value.copy(screenRes);
      materialRef.current.uniforms.uMediaResolution.value.copy(mediaRes);
      materialRef.current.uniforms.uMouse.value.copy(mousePos);
    }

    // Gentle 3D perspective shift on the mesh itself
    if (meshRef.current) {
      // Invert the rotation on X to lean away from mouse
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, mousePos.y * -0.05, safeDelta * 2.5);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, mousePos.x * 0.05, safeDelta * 2.5);
    }
  });

  const uniforms = useMemo(() => ({
    uTexture: { value: textureRef.current },
    uTargetColor: { value: new THREE.Color(targetHue) },
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2() },
    uMediaResolution: { value: new THREE.Vector2(1920, 1080) },
    uMouse: { value: new THREE.Vector2() }
  }), []);

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

export const HeroBg3D = ({ targetHue }: { targetHue: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0 }
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-[#D5D5D5]">
      <Canvas
        frameloop={isVisible ? 'always' : 'never'}
        className="w-full h-full"
      >
        <OrthographicCamera makeDefault position={[0, 0, 1]} left={-1} right={1} top={1} bottom={-1} near={0.1} far={10} />
        <SceneObj isVisible={isVisible} targetHue={targetHue} setIsTransitioning={setIsTransitioning} />
      </Canvas>

      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-[#D5D5D5] z-10"
          />
        )}
      </AnimatePresence>
    </div>
  );
};
