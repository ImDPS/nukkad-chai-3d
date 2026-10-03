"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Color, InstancedMesh, Object3D } from "three";
import type { Awning } from "@/lib/content";
import { buntingFlags } from "@/lib/bunting";
import { easeFactor } from "@/lib/ease";

const COUNT = 15;
const COLOUR_SPEED = 6;
/** below this per-channel gap a flag snaps to its target and easing stops */
const SETTLE = 0.002;

interface Props {
  awning: Awning;
  reducedMotion: boolean;
}

export function Bunting({ awning, reducedMotion }: Props) {
  const mesh = useRef<InstancedMesh>(null);
  const flags = useMemo(() => buntingFlags(COUNT, 3.6, 2.05, 0.22, 0.93), []);
  // where each flag is heading, and where it is now (eased in useFrame)
  const targets = useMemo(() => {
    const palette = [awning.primary, awning.secondary, "#2e7d32", "#f4e9d8"];
    return flags.map((_, i) => new Color(palette[i % palette.length]));
  }, [awning, flags]);
  const current = useRef<Color[] | null>(null);
  const settled = useRef(true);

  useLayoutEffect(() => {
    const instanced = mesh.current;
    if (!instanced) return;
    const dummy = new Object3D();
    flags.forEach((flag, i) => {
      // a cone with 3 sides is a small triangular flag; flip it so the tip points down
      dummy.position.set(flag.x, flag.y - 0.14, flag.z);
      dummy.rotation.set(Math.PI, 0, -flag.tilt);
      dummy.updateMatrix();
      instanced.setMatrixAt(i, dummy.matrix);
    });
    instanced.instanceMatrix.needsUpdate = true;
  }, [flags]);

  useLayoutEffect(() => {
    const instanced = mesh.current;
    if (!instanced) return;
    if (current.current === null) {
      // first mount: start on the target colours
      current.current = targets.map((c) => c.clone());
      current.current.forEach((c, i) => instanced.setColorAt(i, c));
      if (instanced.instanceColor) instanced.instanceColor.needsUpdate = true;
      settled.current = true;
    } else {
      // the awning changed: useFrame eases from the current colours
      settled.current = false;
    }
  }, [targets]);

  useFrame((_, dt) => {
    const instanced = mesh.current;
    const colours = current.current;
    if (!instanced || !colours || settled.current) return;
    const f = reducedMotion ? 1 : easeFactor(dt, COLOUR_SPEED);
    let done = true;
    colours.forEach((c, i) => {
      const t = targets[i];
      c.lerp(t, f);
      if (
        Math.abs(c.r - t.r) < SETTLE &&
        Math.abs(c.g - t.g) < SETTLE &&
        Math.abs(c.b - t.b) < SETTLE
      ) {
        c.copy(t);
      } else {
        done = false;
      }
      instanced.setColorAt(i, c);
    });
    if (instanced.instanceColor) instanced.instanceColor.needsUpdate = true;
    settled.current = done;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, COUNT]}>
      <coneGeometry args={[0.12, 0.28, 3]} />
      <meshStandardMaterial roughness={0.9} />
    </instancedMesh>
  );
}
