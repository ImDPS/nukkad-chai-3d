"use client";

import { AWNINGS, TEAS } from "@/lib/content";
import { useCustomiser } from "@/lib/store";
import { useWebGLSupport } from "@/lib/webgl";

const OPTION =
  "block cursor-pointer rounded-full border-2 border-chai-ink px-4 py-2 text-sm font-medium " +
  "peer-checked:bg-chai-ink peer-checked:text-chai-cream " +
  "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-chai-vermilion";

export function Customiser() {
  const webgl = useWebGLSupport();
  const tea = useCustomiser((s) => s.tea);
  const awning = useCustomiser((s) => s.awning);
  const time = useCustomiser((s) => s.time);
  const setTea = useCustomiser((s) => s.setTea);
  const setAwning = useCustomiser((s) => s.setAwning);
  const setTime = useCustomiser((s) => s.setTime);

  // Render only once WebGL is confirmed. While server-rendering, hydrating or without
  // WebGL the controls would change nothing, so they are not shown.
  if (webgl !== true) return null;

  const teaChoice = TEAS.find((t) => t.id === tea) ?? TEAS[0];
  const awningChoice = AWNINGS.find((a) => a.id === awning) ?? AWNINGS[0];

  return (
    <section aria-labelledby="customiser-title" className="rounded-2xl bg-chai-card p-5">
      <h2 id="customiser-title" className="text-xl font-bold">
        Make it yours
      </h2>
      <p className="mt-1 text-sm">Drag the scene to look around. Then change it below.</p>

      <fieldset className="mt-4">
        <legend className="text-sm font-semibold">Tea</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {TEAS.map((t) => (
            <label key={t.id}>
              <input
                type="radio"
                name="tea"
                value={t.id}
                checked={tea === t.id}
                onChange={(e) => setTea(e.target.value)}
                className="peer sr-only"
              />
              <span className={OPTION}>{t.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-4">
        <legend className="text-sm font-semibold">Awning</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {AWNINGS.map((a) => (
            <label key={a.id}>
              <input
                type="radio"
                name="awning"
                value={a.id}
                checked={awning === a.id}
                onChange={(e) => setAwning(e.target.value)}
                className="peer sr-only"
              />
              <span className={`${OPTION} flex items-center gap-2`}>
                <span
                  aria-hidden="true"
                  className="inline-block h-4 w-6 rounded-sm border border-chai-ink"
                  style={{ background: `linear-gradient(90deg, ${a.primary} 50%, ${a.secondary} 50%)` }}
                />
                {a.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-4">
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            role="switch"
            checked={time === "night"}
            onChange={(e) => setTime(e.target.checked ? "night" : "day")}
            className="peer sr-only"
          />
          <span
            aria-hidden="true"
            className="relative h-7 w-12 rounded-full border-2 border-chai-ink bg-chai-cream transition-colors peer-checked:bg-chai-ink peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-chai-vermilion"
          >
            <span
              className={`absolute top-0.5 h-4 w-4 rounded-full transition-all ${
                time === "night" ? "left-6 bg-chai-marigold" : "left-1 bg-chai-ink"
              }`}
            />
          </span>
          <span className="text-sm font-semibold">Night, with the lanterns lit</span>
        </label>
      </div>

      <p role="status" className="mt-4 text-sm">
        Showing {teaChoice.label.toLowerCase()} under the {awningChoice.label.toLowerCase()}{" "}
        awning, {time === "night" ? "at night" : "by day"}. {teaChoice.blurb}
      </p>
    </section>
  );
}
