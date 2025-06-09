"use client";
import { Header, ToggleTheme, Background } from "@/packages/components";
import { HeroSection } from "@/packages/sections";
import { ClientOnly } from "@/providers";

export default function Home() {
  return (
    <ClientOnly>
      <div className="max-w-5xl mx-auto px-2.5 md:px-6">
        <ToggleTheme />
        <Background />
        <Header />

        <div className="space-x-10 w-full">
          <HeroSection />
        </div>
      </div>
    </ClientOnly>
  );
}
