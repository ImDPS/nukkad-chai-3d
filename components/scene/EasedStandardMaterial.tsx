"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame, type ThreeElements } from "@react-three/fiber";
import { Color, type MeshStandardMaterial } from "three";
import { easeFactor } from "@/lib/ease";

type Props = Omit<ThreeElements["meshStandardMaterial"], "color" | "ref"> & {
  /** target colour: the material eases toward it */
  color: string;
  reducedMotion: boolean;
};

const COLOUR_SPEED = 6;

export function EasedStandardMaterial({ color, reducedMotion, ...rest }: Props) {
  const ref = useRef<MeshStandardMaterial>(null);
  // The initial colour is applied once; later changes are eased in useFrame
  // (passing the changing prop would snap the colour instantly).
  const [initial] = useState(color);
  const target = useMemo(() => new Color(color), [color]);

  useFrame((_, dt) => {
    const material = ref.current;
    if (!material) return;
    material.color.lerp(target, reducedMotion ? 1 : easeFactor(dt, COLOUR_SPEED));
  });

  return <meshStandardMaterial ref={ref} color={initial} {...rest} />;
}
