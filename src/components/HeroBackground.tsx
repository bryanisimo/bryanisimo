import { Canvas } from '@react-three/fiber';
import { GradientTexture } from '@react-three/drei';

const HeroBackground = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 1] }}
        gl={{ antialias: true }}
        style={{ width: '100%', height: '100%' }}
      >
        <mesh scale={[8, 21, 1]}>
          <planeGeometry />
          <meshBasicMaterial>
            <GradientTexture
              stops={[0, 0.1, 1]}
              colors={['#dedede', '#ffffff', '#ffffff']}
              size={1024}
            />
          </meshBasicMaterial>
        </mesh>
      </Canvas>
    </div>
  );
};

export default HeroBackground;
