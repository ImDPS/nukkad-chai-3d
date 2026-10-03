"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, OrbitControls, PerformanceMonitor } from "@react-three/drei";
import { silenceThreeClockWarning } from "@/lib/console-filter";
import { SceneContents } from "./SceneContents";
import type { Quality } from "./types";

silenceThreeClockWarning();

export interface SceneProps {
  /** false while the scene is off screen: the render loop pauses */
  active: boolean;
  reducedMotion: boolean;
}

function initialQuality(): Quality {
  // Phones and tablets start on the cheap glass; the monitor can raise it.
  return window.matchMedia("(pointer: coarse)").matches ? "low" : "high";
}

export default function Scene({ active, reducedMotion }: SceneProps) {
  const [quality, setQuality] = useState<Quality>(initialQuality);
  const [touched, setTouched] = useState(false);

  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.5]}
      camera={{ position: [5, 3.2, 7], fov: 40 }}
      gl={{ antialias: true }}
    >
      <PerformanceMonitor
        flipflops={3}
        onIncline={() => setQuality("high")}
        onDecline={() => setQuality("low")}
        onFallback={() => setQuality("low")}
      />
      <SceneContents quality={quality} reducedMotion={reducedMotion} />
      <ContactShadows
        position={[0, 0.005, 0]}
        opacity={0.35}
        scale={9}
        blur={2.5}
        far={3}
        resolution={256}
        frames={1}
      />
      <OrbitControls
        makeDefault
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        target={[0, 1.1, 0]}
        minDistance={5}
        maxDistance={11}
        minPolarAngle={Math.PI / 5}
        maxPolarAngle={Math.PI / 2.05}
        autoRotate={!reducedMotion && !touched}
        autoRotateSpeed={0.8}
        onStart={() => setTouched(true)}
      />
    </Canvas>
  );
}
