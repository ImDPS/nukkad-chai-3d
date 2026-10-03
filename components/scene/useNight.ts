"use client";

import { useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import type { TimeOfDay } from "@/lib/content";
import { easeToward } from "@/lib/ease";

const NIGHT_SPEED = 3;

/** A 0 (day) to 1 (night) value, eased every frame, shared by lights and lanterns. */
export function useNightRef(time: TimeOfDay, reducedMotion: boolean): RefObject<number> {
  const night = useRef(time === "night" ? 1 : 0);
  useFrame((_, dt) => {
    const target = time === "night" ? 1 : 0;
    night.current = reducedMotion
      ? target
      : easeToward(night.current, target, dt, NIGHT_SPEED);
  });
  return night;
}
