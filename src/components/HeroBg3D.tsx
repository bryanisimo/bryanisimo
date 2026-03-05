import { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrthographicCamera } from '@react-three/drei';
import * as THREE from 'three';
import { getAssetPath } from '../utils/paths';

const videos = [
    getAssetPath('/assets/videos/video-1.mp4'),
    getAssetPath('/assets/videos/video-2.mp4'),
    getAssetPath('/assets/videos/video-3.mp4')
];

// Target hues to cycle through. Using a vibrant palette.
export const targetColors = [
    '#0033FF', // Blue
    '#00E5FF', // Turquoise
    '#9D00FF', // Purple
    '#000080', // Navy
    '#00FF00', // Green
    '#FFEA00', // Yellow
    '#FF6600', // Orange
    '#FF0000'  // Red
];

const fragmentShader = `
uniform sampler2D uTexture;
uniform vec3 uTargetColor;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMediaResolution;

varying vec2 vUv;

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
    vec2 uv = vec2(
        vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
        vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );

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

function SceneObj({ isVisible, onColorChange }: { isVisible: boolean, onColorChange: (color: string) => void }) {
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
    const currentColorObj = useMemo(() => new THREE.Color(targetColors[0]), []);
    const targetColorObj = useMemo(() => new THREE.Color(), []);
    const mediaRes = useMemo(() => new THREE.Vector2(1920, 1080), []);
    const screenRes = useMemo(() => new THREE.Vector2(), []);
    const prevColorIndex = useRef(0);

    useEffect(() => {
        let currentVidIndex = 0;
        const handleTimeUpdate = () => {
            if (video.duration > 0 && video.duration - video.currentTime < 0.2) {
                currentVidIndex = (currentVidIndex + 1) % videos.length;
                video.src = videos[currentVidIndex];
                video.play().catch(() => { });
            }
        };
        const handleLoadedData = () => {
            if (video.videoWidth && video.videoHeight) {
                mediaRes.set(video.videoWidth, video.videoHeight);
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
    }, [video, mediaRes]);

    useEffect(() => {
        if (isVisible) {
            video.play().catch(() => { });
        } else {
            video.pause();
        }
    }, [isVisible, video]);

    useFrame((state, delta) => {
        if (!isVisible) return;

        screenRes.set(size.width, size.height);

        const time = state.clock.getElapsedTime();
        // Change color every 5 seconds
        const colorIndex = Math.floor(time / 5) % targetColors.length;
        targetColorObj.set(targetColors[colorIndex]);

        if (colorIndex !== prevColorIndex.current) {
            prevColorIndex.current = colorIndex;
            onColorChange(targetColors[colorIndex]);
        }

        // Smoothly transition our target hue using standard lerp
        currentColorObj.lerp(targetColorObj, delta * 1.5);

        if (materialRef.current) {
            materialRef.current.uniforms.uTargetColor.value.copy(currentColorObj);
            materialRef.current.uniforms.uTime.value = time;
            materialRef.current.uniforms.uResolution.value.copy(screenRes);
            materialRef.current.uniforms.uMediaResolution.value.copy(mediaRes);
        }
    });

    const uniforms = useMemo(() => ({
        uTexture: { value: textureRef.current },
        uTargetColor: { value: new THREE.Color(targetColors[0]) },
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2() },
        uMediaResolution: { value: new THREE.Vector2(1920, 1080) }
    }), []);

    return (
        <mesh>
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

export const HeroBg3D = ({ onColorChange }: { onColorChange: (color: string) => void }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(true);

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
                <SceneObj isVisible={isVisible} onColorChange={onColorChange} />
            </Canvas>
        </div>
    );
};
