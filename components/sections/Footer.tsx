import { SITE } from "@/lib/content";

export function Footer() {
  return (
    <footer className="mt-16 bg-chai-ink px-4 py-8 text-chai-cream sm:px-6">
      <div className="mx-auto max-w-6xl space-y-2 text-sm">
        <p>{SITE.disclaimer}</p>
        <p>
          Built with Next.js, React Three Fiber and drei. The 3D scene is made from code, with no
          downloaded models, textures or fonts.
        </p>
      </div>
    </footer>
  );
}
