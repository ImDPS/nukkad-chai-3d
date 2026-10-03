import { HOURS, LOCATION } from "@/lib/content";

export function HoursLocation() {
  return (
    <section
      aria-labelledby="hours-title"
      className="mx-auto mt-14 grid max-w-6xl gap-8 px-4 sm:grid-cols-2 sm:px-6"
    >
      <div>
        <h2 id="hours-title" className="text-3xl font-bold">
          Hours
        </h2>
        <dl className="mt-4 space-y-3">
          {HOURS.map((row) => (
            <div key={row.days}>
              <dt className="font-semibold">{row.days}</dt>
              <dd>{row.times}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div>
        <h2 className="text-3xl font-bold">Find us</h2>
        <address className="mt-4 not-italic">
          {LOCATION.lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </address>
        <p className="mt-2 text-sm">{LOCATION.note}</p>
      </div>
    </section>
  );
}
