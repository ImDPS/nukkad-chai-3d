"use client";

import { useLayoutEffect, useMemo, useRef, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  AmbientLight,
  Color,
  DirectionalLight,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  PMREMGenerator,
  PlaneGeometry,
  Scene,
} from "three";

const DAY_BG = new Color("#f6e3c0");
const NIGHT_BG = new Color("#10142b");
const DAY_SUN = new Color("#fff3dc");
const NIGHT_SUN = new Color("#8fa6ff");

/** Three soft panels that light the glass and metal: colour, emissive intensity, position, scale. */
const PANELS: { color: string; intensity: number; position: [number, number, number]; scale: [number, number] }[] = [
  { color: "#fff1d6", intensity: 2, position: [0, 4, 4], scale: [8, 3] },
  { color: "#ffd9a0", intensity: 1.2, position: [-5, 2, -2], scale: [4, 4] },
  { color: "#cfe3ff", intensity: 1, position: [5, 3, -3], scale: [4, 4] },
];

/**
 * Builds the reflection map once from the panels above and sets it as the scene
 * environment. This replaces drei's Environment, whose file loaders (EXR, RGBE,
 * gain map) would otherwise be bundled although no file is ever loaded.
 */
function usePanelEnvironment() {
  const get = useThree((state) => state.get);
  useLayoutEffect(() => {
    const { gl, scene } = get();
    const panels = new Scene();
    const geometry = new PlaneGeometry(1, 1);
    const materials = PANELS.map(({ color, intensity, position, scale }) => {
      const material = new MeshBasicMaterial({
        color: new Color(color).multiplyScalar(intensity),
        side: DoubleSide,
        toneMapped: false,
      });
      const mesh = new Mesh(geometry, material);
      mesh.position.set(...position);
      mesh.scale.set(scale[0], scale[1], 1);
      mesh.lookAt(0, 0, 0);
      panels.add(mesh);
      return material;
    });
    const generator = new PMREMGenerator(gl);
    const target = generator.fromScene(panels, 0, 0.1, 1000, { size: 64 });
    generator.dispose();
    geometry.dispose();
    materials.forEach((material) => material.dispose());
    scene.environment = target.texture;
    return () => {
      if (scene.environment === target.texture) scene.environment = null;
      target.dispose();
    };
  }, [get]);
}

export function Lighting({ night }: { night: RefObject<number> }) {
  const ambient = useRef<AmbientLight>(null);
  const sun = useRef<DirectionalLight>(null);
  const background = useRef<Color>(null);
  const tmp = useMemo(() => new Color(), []);
  usePanelEnvironment();

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
    </>
  );
}
