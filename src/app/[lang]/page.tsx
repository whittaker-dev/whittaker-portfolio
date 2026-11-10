"use client";
import {
  CustomCursor,
  Footer,
  Header,
  Intro,
  Marquee,
  ScrollProgress,
} from "@/packages/components";
import { techStackCategories } from "@/packages/database";
import {
  AboutMe,
  Contact,
  DesignArchive,
  ExperienceSection,
  HeroSection,
  Projects,
  TechnologyStack,
} from "@/packages/sections";
import { ClientOnly } from "@/providers";
import { t } from "i18next";

const marqueeItems = techStackCategories.flatMap((category) =>
  category.techStacks.map((stack) => stack.name),
);

export default function Home() {
  return (
    <ClientOnly>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:bg-brand focus:px-4 focus:py-2 focus:text-on-brand"
      >
        {t("skip_to_content")}
      </a>
      <Intro />
      <CustomCursor />
      <ScrollProgress />
      <Header />

      <main id="main">
        <HeroSection />
        <Marquee items={marqueeItems} />
        <AboutMe />
        <TechnologyStack />
        <ExperienceSection />
        <Projects />
        <DesignArchive />
        <Contact />
      </main>

      <Footer />
    </ClientOnly>
  );
}
