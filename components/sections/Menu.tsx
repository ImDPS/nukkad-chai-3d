import { MENU } from "@/lib/content";

export function Menu() {
  return (
    <section aria-labelledby="menu-title" className="mx-auto mt-14 max-w-6xl px-4 sm:px-6">
      <h2 id="menu-title" className="text-3xl font-bold">
        Menu
      </h2>
      <p className="mt-1 text-sm">Prices in rupees, made up for this demo.</p>
      <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {MENU.map((item) => (
          <li key={item.id} className="rounded-2xl bg-chai-card p-4">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <span className="font-bold">₹{item.price}</span>
            </div>
            <p className="mt-1 text-sm">{item.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
