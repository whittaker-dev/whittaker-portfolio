"use client";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { resumeUrl } from "@/packages/database";
import { useMotionPreference } from "@/providers/Motion";
import { useTheme } from "@/providers/Theme";
import { Icon } from "@iconify/react";
import { t } from "i18next";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import type { IMenu } from "../Header";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  menus: IMenu[];
  activeId: string | null;
};

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

/** Full-screen menu for small screens. Headless UI's Dialog owns focus trap, Escape and scroll lock. */
const MobileMenu = ({ isOpen, onClose, menus, activeId }: Props) => {
  const { theme, toggleTheme } = useTheme();
  const { motionEnabled, toggleMotion } = useMotionPreference();
  // The section picked in the menu, held until the menu has finished closing.
  const pendingTarget = useRef<string | null>(null);
  // A new object per click, so picking the same section twice still scrolls twice.
  const [scrollRequest, setScrollRequest] = useState<{ id: string } | null>(
    null,
  );

  const handleNavigate = (
    event: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    event.preventDefault();
    pendingTarget.current = id;
    onClose();
  };

  const handleExitComplete = () => {
    if (!pendingTarget.current) return;
    setScrollRequest({ id: pendingTarget.current });
    pendingTarget.current = null;
  };

  // Scrolling must wait until the Dialog has unmounted, not merely finished animating. Headless
  // UI releases its scroll lock on unmount, and on iOS that release scrolls the page back to where
  // it was when the menu opened, undoing any scroll made earlier. This passive effect runs in the
  // same commit that removes the Dialog, after the lock is gone. The behaviour is explicit because
  // the lock also pins `scroll-behavior: auto` on <html> until a microtask after release.
  useEffect(() => {
    if (!scrollRequest) return;
    document
      .getElementById(scrollRequest.id)
      ?.scrollIntoView({ behavior: motionEnabled ? "smooth" : "auto" });
    history.replaceState(null, "", `#${scrollRequest.id}`);
  }, [scrollRequest, motionEnabled]);

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {isOpen && (
        <Dialog
          static
          open={isOpen}
          onClose={onClose}
          className="relative z-[70] lg:hidden"
        >
          <motion.div
            className="fixed inset-0 bg-paper"
            initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          >
            <DialogPanel className="shell flex h-full flex-col">
              <div className="flex h-16 items-center justify-between">
                <DialogTitle className="display text-2xl">
                  WHITTAKER
                  <span className="ml-0.5 inline-block size-1.5 bg-brand-ink" />
                </DialogTitle>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label={t("close_menu")}
                  className="flex size-10 items-center justify-center"
                >
                  <Icon icon="ph:x-bold" className="size-6" />
                </button>
              </div>

              <nav aria-label="Primary" className="mt-10 flex-1">
                <ul className="space-y-1">
                  {menus.map((menu, index) => (
                    <li key={menu.id} className="overflow-hidden">
                      <motion.a
                        href={`#${menu.id}`}
                        onClick={(event) => handleNavigate(event, menu.id)}
                        aria-current={
                          activeId === menu.id ? "location" : undefined
                        }
                        className={twMerge(
                          "display flex items-baseline gap-3 py-1 text-[clamp(2.75rem,13vw,4.5rem)] text-ink-muted",
                          activeId === menu.id && "text-ink",
                        )}
                        initial={{ y: "100%" }}
                        animate={{ y: "0%" }}
                        exit={{ y: "100%", transition: { duration: 0.25 } }}
                        transition={{
                          duration: 0.7,
                          delay: 0.2 + index * 0.06,
                          ease: EASE_OUT_EXPO,
                        }}
                      >
                        {menu.title}
                        {activeId === menu.id && (
                          <span className="size-2.5 shrink-0 bg-brand-ink" />
                        )}
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </nav>

              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("view_cv_label")}
                className="flex items-center justify-between border-t border-line py-5 text-base font-semibold"
              >
                <span className="flex items-center gap-2">
                  <Icon
                    icon="ph:file-text-bold"
                    className="size-5 text-brand-ink"
                  />
                  {t("view_cv")}
                </span>
                <Icon icon="ph:arrow-up-right-bold" className="size-4" />
              </a>
              <div className="flex items-center justify-between border-t border-line py-5">
                <button
                  type="button"
                  onClick={toggleMotion}
                  aria-pressed={motionEnabled}
                  className="text-sm font-medium text-ink-muted"
                >
                  {motionEnabled ? t("motion_on") : t("motion_off")}
                </button>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="flex items-center gap-2 text-sm font-medium text-ink-muted"
                >
                  <Icon
                    icon={theme === "dark" ? "ph:sun-bold" : "ph:moon-bold"}
                    className="size-[18px]"
                  />
                  {theme === "dark"
                    ? t("switch_to_light")
                    : t("switch_to_dark")}
                </button>
              </div>
            </DialogPanel>
          </motion.div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
