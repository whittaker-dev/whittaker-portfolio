"use client";
import { Background, Header, ToggleTheme } from "@/packages/components";
import Toolbar from "@/packages/components/Toolbar";
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
        <div className="max-w-full md:max-w-5xl mx-auto px-2.5 md:px-6">
          <ToggleTheme />
          <Background />
          <Header />

          <div className="w-full mt-32 md:mt-4">
            <HeroSection />

            <AboutMe />

            <TechnologyStack />

            <ExperienceSection />
          </div>
        </div>
        <Toolbar />
      </ClientOnly>
    </Suspense>
  );
}
