"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { silenceThreeClockWarning } from "@/lib/console-filter";

silenceThreeClockWarning();

export interface SceneProps {
  /** false while the scene is off screen: the render loop pauses */
  active: boolean;
  reducedMotion: boolean;
}

export default function Scene({ active }: SceneProps) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.5]}
      camera={{ position: [4, 3, 6], fov: 40 }}
    >
      <color attach="background" args={["#f6e3c0"]} />
      <ambientLight intensity={1} />
      <mesh>
        <boxGeometry />
        <meshStandardMaterial color="#f2a900" />
      </mesh>
      <OrbitControls enablePan={false} />
    </Canvas>
  );
}
