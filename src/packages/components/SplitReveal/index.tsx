"use client";
import { useWaveHover } from "@/packages/hooks";
import { motion, type Variants } from "motion/react";
import React, { useRef } from "react";
import { twMerge } from "tailwind-merge";
import { WaveLetters, WaveStop } from "../WaveText";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

const container: Variants = {
  hidden: {},
  show: (stagger: number) => ({
    transition: { staggerChildren: stagger },
  }),
};

const word: Variants = {
  hidden: { y: "105%" },
  show: { y: "0%", transition: { duration: 0.9, ease: EASE_OUT_EXPO } },
};

type Props = {
  text: string;
  className?: string;
  /** Element rendered around the words, so headings keep their semantics. */
  as?: "h1" | "h2" | "h3" | "p" | "span";
  /** Appends a brand-coloured full stop, the signature of every display heading. */
  withStop?: boolean;
  stagger?: number;
  /** Drive the reveal from a parent instead of the viewport (the hero waits for the intro). */
  play?: boolean;
  /** Letters ripple under the pointer once revealed. On by default: every title uses it. */
  wave?: boolean;
};

/**
 * Words rise out of their own clipping box. Each word is a separate mask so the line
 * can wrap naturally at any width.
 */
const SplitReveal = ({
  text,
  className,
  as = "h2",
  withStop = false,
  stagger = 0.06,
  play,
  wave = true,
}: Props) => {
  const Tag = motion[as];
  const ref = useRef<HTMLHeadingElement>(null);
  useWaveHover(ref);
  const words = text.split(" ");
  const controlled = play !== undefined;

  return (
    <Tag
      ref={ref}
      className={twMerge("display", className)}
      variants={container}
      custom={stagger}
      initial="hidden"
      {...(controlled
        ? { animate: play ? "show" : "hidden" }
        : {
            whileInView: "show",
            viewport: { once: true, margin: "-12% 0px" },
          })}
      aria-label={withStop ? `${text}.` : text}
    >
      {words.map((value, index) => {
        const isLast = index === words.length - 1;
        return (
          <React.Fragment key={`${value}-${index}`}>
            {/* Bottom padding keeps descenders and the stop inside the mask. */}
            <span
              aria-hidden="true"
              className="inline-block overflow-hidden pb-[0.06em] align-bottom"
            >
              <motion.span variants={word} className="inline-block">
                {wave ? <WaveLetters value={value} /> : value}
                {isLast &&
                  withStop &&
                  (wave ? (
                    <WaveStop />
                  ) : (
                    <span className="text-brand-ink">.</span>
                  ))}
              </motion.span>
            </span>
            {!isLast && " "}
          </React.Fragment>
        );
      })}
    </Tag>
  );
};

export default SplitReveal;
