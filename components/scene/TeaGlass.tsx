"use client";

import { MeshTransmissionMaterial } from "@react-three/drei";
import { DoubleSide } from "three";
import type { Tea } from "@/lib/content";
import { GLASS_SCALE, GLASS_Y, STEAM_START_Y } from "@/lib/steam-fit";
import { EasedStandardMaterial } from "./EasedStandardMaterial";
import { Steam } from "./Steam";
import type { Quality } from "./types";

function GlassMaterial({ quality }: { quality: Quality }) {
  if (quality === "low") {
    return (
      <meshPhysicalMaterial
        color="#ffffff"
        transparent
        opacity={0.3}
        roughness={0.05}
        side={DoubleSide}
      />
    );
  }
  return (
    <MeshTransmissionMaterial
      samples={4}
      resolution={256}
      transmission={1}
      thickness={0.15}
      roughness={0.05}
      chromaticAberration={0.02}
      anisotropicBlur={0.1}
      backside={false}
      side={DoubleSide}
    />
  );
}

interface Props {
  tea: Tea;
  quality: Quality;
  reducedMotion: boolean;
}

/** The hero: a tea glass on a saucer, scaled up so it reads from the default camera. */
export function TeaGlass({ tea, quality, reducedMotion }: Props) {
  return (
    <group position={[0.55, GLASS_Y, 0.2]} scale={GLASS_SCALE}>
      <mesh position={[0, 0.01, 0]}>
        <cylinderGeometry args={[0.22, 0.2, 0.02, 32]} />
        <meshStandardMaterial color="#f3efe6" roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.165, 0.125, 0.26, 24]} />
        <EasedStandardMaterial color={tea.liquid} reducedMotion={reducedMotion} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.19, 0]}>
        <cylinderGeometry args={[0.19, 0.14, 0.34, 32, 1, true]} />
        <GlassMaterial quality={quality} />
      </mesh>
      <group position={[0, STEAM_START_Y, 0]}>
        <Steam color={tea.steam} reducedMotion={reducedMotion} />
      </group>
    </group>
  );
}
