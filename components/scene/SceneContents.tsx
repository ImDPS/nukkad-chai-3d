"use client";

import { AWNINGS } from "@/lib/content";
import { useCustomiser } from "@/lib/store";
import { Bunting } from "./Bunting";
import { Lighting } from "./Lighting";
import { Stall } from "./Stall";
import type { Quality } from "./types";
import { useNightRef } from "./useNight";

interface Props {
  quality: Quality;
  reducedMotion: boolean;
}

export function SceneContents({ reducedMotion }: Props) {
  const awningId = useCustomiser((s) => s.awning);
  const time = useCustomiser((s) => s.time);
  const awning = AWNINGS.find((a) => a.id === awningId) ?? AWNINGS[0];
  const night = useNightRef(time, reducedMotion);

  return (
    <>
      <Lighting night={night} />
      <Stall awning={awning} reducedMotion={reducedMotion} />
      <Bunting awning={awning} reducedMotion={reducedMotion} />
    </>
  );
}
