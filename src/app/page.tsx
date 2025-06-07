"use client";
import { Header, ToggleTheme, Background } from "@/packages/components";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-2.5 md:px-6">
      <ToggleTheme />
      <Background />
      <Header />
    </div>
  );
}
