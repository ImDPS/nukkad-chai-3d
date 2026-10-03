import { useSyncExternalStore } from "react";

let webglCache: boolean | undefined;

function detectWebGL(): boolean {
  if (webglCache !== undefined) return webglCache;
  if (new URLSearchParams(window.location.search).has("nowebgl")) {
    webglCache = false;
    return webglCache;
  }
  try {
    const canvas = document.createElement("canvas");
    // three r163 and later need WebGL 2; a WebGL 1 only browser would throw after the download.
    const gl = canvas.getContext("webgl2");
    webglCache = Boolean(gl);
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    webglCache = false;
  }
  return webglCache;
}

const noopSubscribe = () => () => {};

/** `null` while server-rendering or hydrating, then `true` or `false`. */
export function useWebGLSupport(): boolean | null {
  return useSyncExternalStore<boolean | null>(noopSubscribe, detectWebGL, () => null);
}
