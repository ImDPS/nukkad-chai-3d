/**
 * Why this exists: @react-three/fiber 9.x creates a THREE.Clock on every
 * Canvas mount, and three 0.186 logs a deprecation warning from the Clock
 * constructor. We do not use Clock ourselves, so the warning is noise that we
 * cannot fix from our side.
 *
 * Remove this file (and its call in Scene.tsx) once @react-three/fiber stops
 * creating THREE.Clock.
 *
 * Only this one message is dropped. Every other warning goes to the original
 * console.warn with the same arguments and `this`.
 */

const CLOCK_WARNING = "Clock: This module has been deprecated";

/** Marks a wrapper so repeated calls and hot reload never stack wrappers. */
const INSTALLED = Symbol.for("nukkad-chai.silenceThreeClockWarning");

type WarnFn = typeof console.warn & { [INSTALLED]?: true };

export function silenceThreeClockWarning(): void {
  const current = console.warn as WarnFn;
  if (current[INSTALLED]) return;

  const wrapped: WarnFn = function (this: unknown, ...args: unknown[]) {
    const first = args[0];
    if (typeof first === "string" && first.includes(CLOCK_WARNING)) return;
    return current.apply(this, args);
  };
  wrapped[INSTALLED] = true;
  console.warn = wrapped;
}
