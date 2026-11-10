"use client";
import { resumeUrl } from "@/packages/database";
import { useActiveSection } from "@/packages/hooks";
import { useMotionPreference } from "@/providers/Motion";
import { useTheme } from "@/providers/Theme";
import { Icon } from "@iconify/react";
import { t } from "i18next";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import MobileMenu from "../MobileMenu";
import ScrambleText from "../ScrambleText";

export interface IMenu {
  id: string;
  title: string;
}

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { motionEnabled, toggleMotion } = useMotionPreference();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menus: IMenu[] = [
    { id: "about", title: t("overview") },
    { id: "technology-stack", title: t("stack") },
    { id: "experience", title: t("experience") },
    { id: "projects", title: t("projects") },
    { id: "contact", title: t("contact") },
  ];
  const activeId = useActiveSection(menus.map((menu) => menu.id));

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (value) => setIsScrolled(value > 24));

  return (
    <header
      className={twMerge(
        "fixed inset-x-0 top-0 z-50 border-b border-transparent transition-[background-color,border-color] duration-300",
        isScrolled && "border-line bg-paper/92",
      )}
    >
      <div className="shell flex h-16 items-center justify-between gap-6 md:h-[72px]">
        <a
          href="#top"
          className="display flex items-baseline text-2xl tracking-[0.01em]"
          aria-label="Whittaker Tran, back to top"
        >
          WHITTAKER
          <span className="ml-0.5 inline-block size-1.5 bg-brand-ink" />
        </a>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-9">
            {menus.map((menu) => {
              const isActive = activeId === menu.id;
              return (
                <li key={menu.id}>
                  <a
                    href={`#${menu.id}`}
                    aria-current={isActive ? "location" : undefined}
                    className={twMerge(
                      "relative flex items-center text-[13px] font-medium text-ink-muted transition-colors hover:text-ink",
                      isActive && "text-ink",
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-active-dot"
                        className="absolute -left-3 size-1.5 rounded-full bg-brand-ink"
                        transition={{
                          type: "spring",
                          stiffness: 420,
                          damping: 34,
                        }}
                      />
                    )}
                    <ScrambleText text={menu.title} trigger="hover" />
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-1 md:gap-3">
          <button
            type="button"
            onClick={toggleMotion}
            aria-pressed={motionEnabled}
            aria-label={t("toggle_motion")}
            className="hidden items-center gap-2 px-2 py-2 text-[12px] font-medium text-ink-muted transition-colors hover:text-ink md:flex"
          >
            <span className="flex h-3 items-end gap-[2px]" aria-hidden="true">
              {[0, 1, 2].map((bar) => (
                <motion.span
                  key={bar}
                  className="w-[2px] bg-current"
                  animate={
                    motionEnabled
                      ? { height: ["4px", "12px", "6px", "10px", "4px"] }
                      : { height: "4px" }
                  }
                  transition={{
                    duration: 1.2,
                    repeat: motionEnabled ? Infinity : 0,
                    delay: bar * 0.18,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </span>
            {motionEnabled ? t("motion_on") : t("motion_off")}
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              theme === "dark" ? t("switch_to_light") : t("switch_to_dark")
            }
            className="flex size-10 items-center justify-center text-ink-muted transition-colors hover:text-ink"
          >
            <Icon
              icon={theme === "dark" ? "ph:sun-bold" : "ph:moon-bold"}
              className="size-[18px]"
            />
          </button>

          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("view_cv_label")}
            className="hidden items-center gap-1.5 px-2 py-2 text-[13px] font-medium text-ink-muted transition-colors hover:text-ink md:flex"
          >
            <Icon icon="ph:file-text-bold" className="size-4" />
            <ScrambleText text={t("view_cv")} trigger="hover" />
          </a>

          <a
            href="#contact"
            className="group hidden items-center gap-1.5 text-[13px] font-semibold text-ink md:flex"
          >
            <ScrambleText text={t("lets_talk")} trigger="hover" />
            <Icon
              icon="ph:arrow-up-right-bold"
              className="size-3.5 text-brand-ink transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>

          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            aria-label={t("open_menu")}
            aria-expanded={isMenuOpen}
            className="flex size-10 items-center justify-center text-ink lg:hidden"
          >
            <Icon icon="ph:list-bold" className="size-6" />
          </button>
        </div>
      </div>

      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        menus={menus}
        activeId={activeId}
      />
    </header>
  );
};

export default Header;
