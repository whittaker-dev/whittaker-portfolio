"use client";
import { Header, ToggleTheme, Background } from "@/packages/components";
import { AboutMe, HeroSection, TechnologyStack } from "@/packages/sections";
import { ClientOnly } from "@/providers";

export default function Home() {
  return (
    <ClientOnly>
      <div className="max-w-5xl mx-auto px-2.5 md:px-6">
        <ToggleTheme />
        <Background />
        <Header />

        <div className="w-full">
          <HeroSection />

          <AboutMe />

          <TechnologyStack />
        </div>
      </div>
    </ClientOnly>
  );
}
