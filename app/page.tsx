import { StallPoster } from "@/components/scene/StallPoster";

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-4xl font-bold">Nukkad Chai</h1>
      <p className="mt-2">
        Nukkad Chai is a fictional stall. This page is a concept project, not a real business.
      </p>
      <div className="mt-6 aspect-[16/10] overflow-hidden rounded-2xl">
        <StallPoster />
      </div>
    </main>
  );
}
