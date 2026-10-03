"use client";

import { AWNINGS, TEAS } from "@/lib/content";
import { useCustomiser } from "@/lib/store";
import { Bunting } from "./Bunting";
import { KettleStove } from "./KettleStove";
import { Lantern } from "./Lantern";
import { Lighting } from "./Lighting";
import { Stall } from "./Stall";
import { TeaGlass } from "./TeaGlass";
import type { Quality } from "./types";
import { useNightRef } from "./useNight";

interface Props {
  quality: Quality;
  reducedMotion: boolean;
}

const LANTERNS: [number, number, number][] = [
  [-1.1, 1.85, 0.2],
  [0, 1.85, 0.2],
  [1.1, 1.85, 0.2],
];

export function SceneContents({ quality, reducedMotion }: Props) {
  const awningId = useCustomiser((s) => s.awning);
  const teaId = useCustomiser((s) => s.tea);
  const time = useCustomiser((s) => s.time);
  const awning = AWNINGS.find((a) => a.id === awningId) ?? AWNINGS[0];
  const tea = TEAS.find((t) => t.id === teaId) ?? TEAS[0];
  const night = useNightRef(time, reducedMotion);

  return (
    <>
      <Lighting night={night} />
      <Stall awning={awning} reducedMotion={reducedMotion} />
      <Bunting awning={awning} reducedMotion={reducedMotion} />
      <KettleStove />
      <TeaGlass tea={tea} quality={quality} reducedMotion={reducedMotion} />
      {LANTERNS.map((position) => (
        <Lantern
          key={position[0]}
          position={position}
          night={night}
          reducedMotion={reducedMotion}
        />
      ))}
    </>
  );
}
