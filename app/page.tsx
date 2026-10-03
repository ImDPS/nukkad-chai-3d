import { Customiser } from "@/components/customiser/Customiser";
import { SceneCanvas } from "@/components/scene/SceneCanvas";
import { Events } from "@/components/sections/Events";
import { Footer } from "@/components/sections/Footer";
import { HoursLocation } from "@/components/sections/HoursLocation";
import { Menu } from "@/components/sections/Menu";
import { SITE } from "@/lib/content";

export default function Home() {
  return (
    <>
      <header className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 sm:pt-12">
        <p className="text-sm font-semibold uppercase tracking-widest text-chai-vermilion">
          Concept project
        </p>
        <h1 className="mt-1 text-4xl font-bold sm:text-6xl">{SITE.name}</h1>
        <p className="mt-2 max-w-xl text-lg">{SITE.tagline}</p>
      </header>

      <main>
        <section
          aria-label="The stall"
          className="mx-auto mt-6 grid max-w-6xl gap-6 px-4 sm:px-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]"
        >
          <figure>
            <SceneCanvas />
            <figcaption className="mt-2 text-sm">
              Illustration: a low-poly tea stall with a striped awning, bunting and lanterns, and a
              glass of tea with rising steam.
            </figcaption>
          </figure>
          <Customiser />
        </section>
        <Menu />
        <HoursLocation />
        <Events />
      </main>

      <Footer />
    </>
  );
}
