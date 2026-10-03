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
    const gl = (canvas.getContext("webgl2") ?? canvas.getContext("webgl")) as
      | WebGL2RenderingContext
      | WebGLRenderingContext
      | null;
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
