"use client";

import type { Awning } from "@/lib/content";
import { EasedStandardMaterial } from "./EasedStandardMaterial";

const STRIPES = 10;
const AWNING_WIDTH = 3.8;
const STRIPE_WIDTH = AWNING_WIDTH / STRIPES;
const SLOPE = 0.32; // radians: the front edge hangs lower than the back

interface Props {
  awning: Awning;
  reducedMotion: boolean;
}

export function Stall({ awning, reducedMotion }: Props) {
  return (
    <group>
      {/* ground */}
      <mesh rotation-x={-Math.PI / 2}>
        <circleGeometry args={[7, 48]} />
        <meshStandardMaterial color="#e1c99d" />
      </mesh>

      {/* counter body and top */}
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[3.2, 0.9, 1.2]} />
        <meshStandardMaterial color="#8b5a2b" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.95, 0]}>
        <boxGeometry args={[3.4, 0.1, 1.4]} />
        <meshStandardMaterial color="#a9743f" roughness={0.7} />
      </mesh>

      {/* back wall */}
      <mesh position={[0, 1.25, -0.68]}>
        <boxGeometry args={[3.5, 2.5, 0.1]} />
        <meshStandardMaterial color="#e9cfa3" roughness={0.9} />
      </mesh>

      {/* posts: back posts are taller so the awning slopes forward */}
      {[-1.7, 1.7].map((x) => (
        <group key={x}>
          <mesh position={[x, 1.325, -0.7]}>
            <cylinderGeometry args={[0.06, 0.06, 2.65, 12]} />
            <meshStandardMaterial color="#5b3a1e" />
          </mesh>
          <mesh position={[x, 1.05, 0.7]}>
            <cylinderGeometry args={[0.06, 0.06, 2.1, 12]} />
            <meshStandardMaterial color="#5b3a1e" />
          </mesh>
        </group>
      ))}

      {/* striped awning */}
      <group position={[0, 2.35, 0.1]} rotation-x={SLOPE}>
        {Array.from({ length: STRIPES }, (_, i) => (
          <mesh key={i} position={[(i + 0.5) * STRIPE_WIDTH - AWNING_WIDTH / 2, 0, 0]}>
            <boxGeometry args={[STRIPE_WIDTH, 0.05, 1.7]} />
            <EasedStandardMaterial
              color={i % 2 === 0 ? awning.primary : awning.secondary}
              reducedMotion={reducedMotion}
              roughness={0.85}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
