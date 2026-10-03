import { EVENTS } from "@/lib/content";

export function Events() {
  return (
    <section aria-labelledby="events-title" className="mx-auto mt-14 max-w-6xl px-4 sm:px-6">
      <h2 id="events-title" className="text-3xl font-bold">
        Happening at the stall
      </h2>
      <ul className="mt-5 grid gap-4 md:grid-cols-3">
        {EVENTS.map((event) => (
          <li key={event.id} className="rounded-2xl bg-chai-marigold p-4 text-chai-ink">
            <h3 className="text-lg font-bold">{event.title}</h3>
            <p className="mt-1 text-sm font-semibold">{event.when}</p>
            <p className="mt-2 text-sm">{event.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
