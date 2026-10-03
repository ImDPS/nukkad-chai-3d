"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Color, type BufferGeometry, type PointsMaterial } from "three";
import { easeFactor } from "@/lib/ease";
import { fillSteam } from "@/lib/steam";
import { STEAM_Y_SCALE } from "@/lib/steam-fit";

const COUNT = 36;
const COLOUR_SPEED = 6; // same as EasedStandardMaterial

export function Steam({ color, reducedMotion }: { color: string; reducedMotion: boolean }) {
  const geometry = useRef<BufferGeometry>(null);
  const material = useRef<PointsMaterial>(null);
  const [positions] = useState(() => {
    const initial = new Float32Array(COUNT * 3);
    fillSteam(initial, COUNT, 0);
    return initial;
  });
  // The initial colour is applied once; later changes are eased in useFrame.
  const [initial] = useState(color);
  const target = useMemo(() => new Color(color), [color]);

  useFrame(({ clock }, dt) => {
    // The colour changes even though the puffs are frozen under reduced motion.
    material.current?.color.lerp(target, reducedMotion ? 1 : easeFactor(dt, COLOUR_SPEED));
    if (reducedMotion) return; // frozen puffs, no animation
    fillSteam(positions, COUNT, clock.elapsedTime);
    const attribute = geometry.current?.getAttribute("position");
    if (attribute) attribute.needsUpdate = true;
  });

  return (
    // Y scale keeps the plume under the awning, see lib/steam-fit.ts.
    <points frustumCulled={false} scale={[1, STEAM_Y_SCALE, 1]}>
      <bufferGeometry ref={geometry}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={material}
        color={initial}
        size={0.07}
        sizeAttenuation
        transparent
        opacity={0.45}
        depthWrite={false}
      />
    </points>
  );
}
