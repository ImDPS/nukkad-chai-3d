"use client";

import { useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import type { MeshStandardMaterial } from "three";

interface Props {
  position: [number, number, number];
  night: RefObject<number>;
  reducedMotion: boolean;
}

export function Lantern({ position, night, reducedMotion }: Props) {
  const material = useRef<MeshStandardMaterial>(null);

  // Glow is emissive only (no extra lights); the shared night ref is read per frame.
  useFrame(() => {
    if (material.current) material.current.emissiveIntensity = 0.2 + 2.3 * night.current;
  });

  const body = (
    <group>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.4, 6]} />
        <meshStandardMaterial color="#5b3a1e" />
      </mesh>
      <mesh>
        <cylinderGeometry args={[0.13, 0.13, 0.28, 16]} />
        <meshStandardMaterial
          ref={material}
          color="#ffb347"
          emissive="#ff9d2e"
          emissiveIntensity={0.2}
          roughness={0.5}
        />
      </mesh>
      <mesh position={[0, 0.16, 0]}>
        <coneGeometry args={[0.15, 0.08, 16]} />
        <meshStandardMaterial color="#c1272d" />
      </mesh>
      <mesh position={[0, -0.16, 0]}>
        <cylinderGeometry args={[0.1, 0.12, 0.04, 16]} />
        <meshStandardMaterial color="#c1272d" />
      </mesh>
    </group>
  );

  return (
    <group position={position}>
      {reducedMotion ? (
        body
      ) : (
        <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.15}>
          {body}
        </Float>
      )}
    </group>
  );
}
