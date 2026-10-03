import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nukkad Chai: a fictional 3D tea stall (concept project)",
  description:
    "A concept project: a fast 3D landing page with a live customiser, built with Next.js and React Three Fiber. Not a real business.",
};

export const viewport: Viewport = {
  themeColor: "#fbf1df",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-IN">
      <body className="bg-chai-cream text-chai-ink antialiased">{children}</body>
    </html>
  );
}
