"use client";
import { useMotionPreference } from "@/providers/Motion";
import { t } from "i18next";
import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
} from "motion/react";
import { useEffect, useState } from "react";

// The loader is a deliberate one-second beat on every visit, not a measure of real
// loading, so the counter and the bar are timed rather than tied to network progress.
const MIN_VISIBLE_MS = 1000;
// Never hold the page hostage to a slow font CDN.
const MAX_WAIT_MS = 2400;
const NAME = "WHITTAKER TRAN";
const EASE_IN_OUT_QUART = [0.76, 0, 0.24, 1] as const;
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

/**
 * Opening curtain on every page load: the name assembles while a counter runs to 100,
 * then the panel wipes upward and hands over to the hero. It also covers the display
 * face loading, so the hero never shows a font swap.
 */
const Intro = () => {
  const { finishIntro } = useMotionPreference();
  const [isVisible, setIsVisible] = useState(true);
  const progress = useMotionValue(0);
  const percent = useTransform(progress, (value) =>
    String(Math.round(value)).padStart(3, "0"),
  );
  const barScale = useTransform(progress, (value) => value / 100);

  useEffect(() => {
    // Hiding the panel starts its exit wipe; the hero starts in the same frame so the
    // curtain and the hero entrance read as one move.
    if (!isVisible) {
      finishIntro();
      return;
    }

    document.documentElement.style.overflow = "hidden";
    let cancelled = false;
    const counter = animate(progress, 100, {
      duration: MIN_VISIBLE_MS / 1000,
      ease: EASE_IN_OUT_QUART,
    });
    const minDelay = new Promise((resolve) =>
      setTimeout(resolve, MIN_VISIBLE_MS),
    );
    const maxDelay = new Promise((resolve) => setTimeout(resolve, MAX_WAIT_MS));

    Promise.race([
      Promise.all([document.fonts.ready, minDelay]),
      maxDelay,
    ]).then(() => {
      if (!cancelled) setIsVisible(false);
    });

    return () => {
      cancelled = true;
      counter.stop();
    };
  }, [isVisible, finishIntro, progress]);

  return (
    <AnimatePresence
      onExitComplete={() => {
        document.documentElement.style.overflow = "";
      }}
    >
      {isVisible && (
        <motion.div
          key="intro"
          role="status"
          aria-label={t("intro_label")}
          className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-paper"
          initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{
            clipPath: "inset(0% 0% 100% 0%)",
            transition: { duration: 0.85, ease: EASE_IN_OUT_QUART },
          }}
        >
          <div className="flex overflow-hidden">
            {NAME.split("").map((letter, index) => (
              <motion.span
                key={index}
                className="display inline-block text-[clamp(2.5rem,9vw,7.5rem)]"
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{
                  duration: 0.7,
                  delay: 0.05 + index * 0.03,
                  ease: EASE_OUT_EXPO,
                }}
              >
                {letter === " " ? " " : letter}
              </motion.span>
            ))}
            <motion.span
              className="display inline-block text-[clamp(2.5rem,9vw,7.5rem)] text-brand-ink"
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{
                duration: 0.7,
                delay: 0.05 + NAME.length * 0.03,
                ease: EASE_OUT_EXPO,
              }}
            >
              .
            </motion.span>
          </div>

          <div className="mt-6 flex w-[min(18rem,60vw)] items-center gap-4">
            <span className="relative h-px flex-1 bg-line-strong">
              <motion.span
                className="absolute inset-0 origin-left bg-brand-ink"
                style={{ scaleX: barScale }}
              />
            </span>
            <motion.span
              aria-hidden="true"
              className="font-mono text-[12px] tracking-[0.12em] text-ink-muted tabular-nums"
            >
              {percent}
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Intro;
