"use client";

import { useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { AmbientLight, Color, DirectionalLight } from "three";

const DAY_BG = new Color("#f6e3c0");
const NIGHT_BG = new Color("#10142b");
const DAY_SUN = new Color("#fff3dc");
const NIGHT_SUN = new Color("#8fa6ff");

export function Lighting({ night }: { night: RefObject<number> }) {
  const ambient = useRef<AmbientLight>(null);
  const sun = useRef<DirectionalLight>(null);
  const background = useRef<Color>(null);
  const tmp = useMemo(() => new Color(), []);

  useFrame((state) => {
    const n = night.current;
    if (ambient.current) ambient.current.intensity = 0.9 - 0.65 * n;
    if (sun.current) {
      sun.current.intensity = 1.6 - 1.25 * n;
      sun.current.color.copy(tmp.copy(DAY_SUN).lerp(NIGHT_SUN, n));
    }
    if (background.current) background.current.copy(tmp.copy(DAY_BG).lerp(NIGHT_BG, n));
    state.scene.environmentIntensity = 1 - 0.8 * n;
  });

  return (
    <>
      <color ref={background} attach="background" args={["#f6e3c0"]} />
      <ambientLight ref={ambient} intensity={0.9} />
      <directionalLight ref={sun} position={[4, 6, 5]} intensity={1.6} />
      <Environment resolution={64} frames={1}>
        <Lightformer form="rect" intensity={2} color="#fff1d6" position={[0, 4, 4]} scale={[8, 3, 1]} />
        <Lightformer form="rect" intensity={1.2} color="#ffd9a0" position={[-5, 2, -2]} scale={[4, 4, 1]} />
        <Lightformer form="rect" intensity={1} color="#cfe3ff" position={[5, 3, -3]} scale={[4, 4, 1]} />
      </Environment>
    </>
  );
}
