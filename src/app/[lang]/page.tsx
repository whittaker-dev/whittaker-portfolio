"use client";
import { Header, ToggleTheme, Background } from "@/packages/components";
import {
  AboutMe,
  ExperienceSection,
  HeroSection,
  TechnologyStack,
} from "@/packages/sections";
import { ClientOnly } from "@/providers";
import { Suspense } from "react";

export default function Home() {
  return (
    <Suspense fallback={"loading..."}>
      <ClientOnly>
        <div className="max-w-5xl mx-auto px-2.5 md:px-6">
          <ToggleTheme />
          <Background />
          <Header />

          <div className="w-full">
            <HeroSection />

            <AboutMe />

            <TechnologyStack />

            <ExperienceSection />
          </div>
        </div>
      </ClientOnly>
    </Suspense>
  );
}
