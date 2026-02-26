import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import * as THREE from 'three';
import { createNoise2D } from 'simplex-noise';
import { useControls } from 'leva';

// --- Configuration options exposed to Leva for easy tuning ---
// (We set them up inside the component to use the hook, but define defaults here if needed)

const NeonTriangle = ({ colorA, colorB, glowIntensity }: { colorA: string, colorB: string, glowIntensity: number }) => {
    const meshRef = useRef<THREE.Mesh>(null);

    // A simple tube geometry matching a triangle shape
    const geometry = useMemo(() => {
        const radius = 1.5;
        // Points of an equilateral triangle
        const points = [
            new THREE.Vector3(0, radius, 0),
            new THREE.Vector3(radius * Math.cos(-Math.PI / 6), radius * Math.sin(-Math.PI / 6), 0),
            new THREE.Vector3(radius * Math.cos(7 * Math.PI / 6), radius * Math.sin(7 * Math.PI / 6), 0),
            new THREE.Vector3(0, radius, 0), // Close the loop
        ];
        const path = new THREE.CatmullRomCurve3(points, true, 'catmullrom', 0.1);
        // reduce tubular segments for jagged/sharp look, or keep it high for smooth
        return new THREE.TubeGeometry(path, 64, 0.08, 8, false);
    }, []);

    useFrame((state) => {
        if (meshRef.current) {
            // Gentle floating animation
            meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.2 + 0.5;
            meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
        }
    });

    return (
        <mesh ref={meshRef} geometry={geometry}>
            <meshStandardMaterial
                color={colorA}
                emissive={colorB}
                emissiveIntensity={glowIntensity}
                toneMapped={false} // crucial for bloom to work properly without blowing out
            />
        </mesh>
    );
};

const SandDunes = ({ displacementHeight }: { displacementHeight: number }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const noise2D = useMemo(() => createNoise2D(), []);

    // Increase segments for smoother dunes
    const geometry = useMemo(() => {
        const geo = new THREE.PlaneGeometry(30, 30, 128, 128);
        const positions = geo.attributes.position.array;

        for (let i = 0; i < positions.length; i += 3) {
            const x = positions[i];
            const y = positions[i + 1];
            // Apply simplex noise to the Z axis (which is UP because we rotate the plane later)
            // We use Math.abs to create "dune" like ridges instead of hills
            let noiseValue = noise2D(x * 0.1, y * 0.1) * displacementHeight;

            // Lower the mountains slightly in the center to leave room for the triangle
            const distFromCenter = Math.sqrt(x * x + y * y);
            const centerAvoidance = Math.min(1, distFromCenter / 5);

            positions[i + 2] = noiseValue * centerAvoidance;
        }

        geo.computeVertexNormals();
        return geo;
    }, [noise2D, displacementHeight]);

    return (
        <mesh ref={meshRef} geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
            <meshStandardMaterial
                color="#ffffff"
                roughness={0.9} // Sand is rough
                metalness={0.1}
                flatShading={false}
            />
        </mesh>
    );
};

const ParticleSystem = ({ count, color, speed }: { count: number, color: string, speed: number }) => {
    const groupRef = useRef<THREE.Group>(null);

    // Create an array of particle data (initial positions and velocities)
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            temp.push({
                x: (Math.random() - 0.5) * 4,
                y: Math.random() * 5, // start slightly higher
                z: (Math.random() - 0.5) * 4,
                vx: (Math.random() - 0.5) * 0.02,
                vy: Math.random() * 0.05 + 0.02, // move upwards
                vz: (Math.random() - 0.5) * 0.02,
                life: Math.random(), // 0 to 1
            });
        }
        return temp;
    }, [count]);

    useFrame((_, delta) => {
        if (groupRef.current) {
            groupRef.current.children.forEach((child, i) => {
                const p = particles[i];
                if (!p) return;

                // Update position
                p.x += p.vx * speed * (delta * 60);
                p.y += p.vy * speed * (delta * 60);
                p.z += p.vz * speed * (delta * 60);

                // Update life
                p.life -= 0.002 * speed * (delta * 60);

                // Respawn if dead
                if (p.life <= 0) {
                    p.x = (Math.random() - 0.5) * 1; // spawn closer to center
                    p.y = -1; // spawn at bottom of triangle
                    p.z = (Math.random() - 0.5) * 1;
                    p.life = 1;
                }

                child.position.set(p.x, p.y, p.z);

                // Fade out based on life
                const material = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
                material.opacity = p.life * 0.8;
            });
        }
    });

    return (
        <group ref={groupRef}>
            {particles.map((_, i) => (
                <mesh key={i}>
                    <sphereGeometry args={[0.03, 8, 8]} />
                    <meshBasicMaterial
                        color={color}
                        transparent
                        opacity={0.8}
                        blending={THREE.AdditiveBlending}
                        toneMapped={false}
                    />
                </mesh>
            ))}
        </group>
    );
};

const CameraOrbit = ({ speed }: { speed: number }) => {
    useFrame((state) => {
        // Radius of the orbit
        const radius = 12;
        // Calculate new position based on time and speed
        const angle = state.clock.elapsedTime * speed;

        state.camera.position.x = Math.sin(angle) * radius;
        state.camera.position.z = Math.cos(angle) * radius;
        // Keep the Y position somewhat static or gently floating if desired
        // state.camera.position.y = 1.5;

        // Always look at the center (where the triangle is)
        state.camera.lookAt(0, 0.5, 0);
    });
    return null;
};

const Scene = () => {
    // Leva controls for live tweaking
    const {
        triangleColorA,
        triangleColorB,
        glowIntensity,
        particleColor,
        particleCount,
        particleSpeed,
        duneHeight,
        cameraSpeed,
        lightIntensity,
        bgColor
    } = useControls({
        triangleColorA: { value: '#ff0055', label: 'Triangle Base Color' },
        triangleColorB: { value: '#a200ff', label: 'Triangle Emissive Color' },
        glowIntensity: { value: 2.5, min: 0, max: 10, step: 0.1, label: 'Triangle Glow' },
        particleColor: { value: '#ffd000', label: 'Particle Color' },
        particleCount: { value: 150, min: 10, max: 500, step: 10, label: 'Particle Count' },
        particleSpeed: { value: 1.0, min: 0.1, max: 5.0, step: 0.1, label: 'Particle Speed' },
        duneHeight: { value: 0.6, min: 0.1, max: 4, step: 0.1, label: 'Dunes Height' },
        cameraSpeed: { value: 0.1, min: 0.01, max: 1.0, step: 0.01, label: 'Camera Orbit' },
        lightIntensity: { value: 1.0, min: 0, max: 5, step: 0.1, label: 'Lighting' },
        bgColor: { value: '#e2e8f0', label: 'Fog/Bg Color' }
    });

    return (
        <>
            <color attach="background" args={[bgColor]} />
            <fog attach="fog" args={[bgColor, 5, 20]} />

            <ambientLight intensity={lightIntensity * 0.5} />
            <directionalLight position={[5, 10, 5]} intensity={lightIntensity} />

            {/* The Glow Source */}
            <pointLight position={[0, 1, 0]} color={triangleColorB} intensity={glowIntensity * 2} distance={10} />

            <CameraOrbit speed={cameraSpeed} />

            <NeonTriangle colorA={triangleColorA} colorB={triangleColorB} glowIntensity={glowIntensity} />

            <SandDunes displacementHeight={duneHeight} />

            <ParticleSystem count={particleCount} color={particleColor} speed={particleSpeed} />

            {/* Post-processing for the Neon effect */}
            <EffectComposer enableNormalPass={true}>
                <Bloom
                    luminanceThreshold={1} // Only glow things with emissive > 1
                    mipmapBlur
                    intensity={glowIntensity * 0.5}
                />
            </EffectComposer>
        </>
    );
};

export default function HeroBackground3D() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Optimization: Only render the 3D scene when the Hero section is visible
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            { threshold: 0 } //Trigger as soon as 1 pixel is visible/invisible
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div ref={containerRef} className="absolute inset-0 w-full h-full z-0 bg-[#D5D5D5]">
            {isVisible && (
                <Canvas camera={{ position: [0, 1.5, 12], fov: 50 }}>
                    <Scene />
                </Canvas>
            )}
        </div>
    );
}
