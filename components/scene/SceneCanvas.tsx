"use client";

import { lazy, Suspense } from "react";
import { useWebGLSupport } from "@/lib/webgl";
import { SceneBoundary } from "./SceneBoundary";
import { StallPoster } from "./StallPoster";
import { useInView, usePrefersReducedMotion } from "./hooks";

const Scene = lazy(() => import("./Scene"));

export function SceneCanvas() {
  const webgl = useWebGLSupport();
  const reducedMotion = usePrefersReducedMotion();
  const [ref, inView] = useInView<HTMLDivElement>();
  const poster = <StallPoster />;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-chai-card sm:aspect-[16/10]"
    >
      {webgl ? (
        <SceneBoundary fallback={poster}>
          <Suspense fallback={poster}>
            <Scene active={inView} reducedMotion={reducedMotion} />
          </Suspense>
        </SceneBoundary>
      ) : (
        poster
      )}
    </div>
  );
}
