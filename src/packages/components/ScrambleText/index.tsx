"use client";
import { useMotionPreference } from "@/providers/Motion";
import { useInView } from "motion/react";
import React, { useCallback, useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>#*";
const MS_PER_CHAR = 28;
const MAX_DURATION_MS = 650;

type Props = {
  text: string;
  /** "change" re-runs whenever `text` changes; "hover" runs on pointer enter of the element. */
  trigger?: "inView" | "change" | "hover";
  className?: string;
};

/**
 * Letters resolve left to right out of random glyphs. The real text is always in the
 * accessibility tree; only the visual copy scrambles.
 */
const ScrambleText = ({ text, trigger = "inView", className }: Props) => {
  const { motionEnabled } = useMotionPreference();
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  const frameRef = useRef<number | null>(null);
  const [display, setDisplay] = useState(text);

  const run = useCallback(() => {
    if (!motionEnabled) {
      setDisplay(text);
      return;
    }
    if (frameRef.current) cancelAnimationFrame(frameRef.current);

    const duration = Math.min(text.length * MS_PER_CHAR, MAX_DURATION_MS);
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const resolved = Math.floor(progress * text.length);
      let next = "";
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        next +=
          i < resolved || char === " "
            ? char
            : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      setDisplay(next);
      if (progress < 1) frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
  }, [motionEnabled, text]);

  useEffect(() => {
    if (trigger === "change") run();
    if (trigger === "inView" && isInView) run();
  }, [trigger, isInView, run]);

  useEffect(() => {
    // Keep the visual copy in sync if text changes for a hover-triggered instance.
    if (trigger === "hover") setDisplay(text);
  }, [trigger, text]);

  useEffect(
    () => () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    },
    [],
  );

  return (
    <span
      ref={ref}
      className={className}
      onPointerEnter={trigger === "hover" ? run : undefined}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{display}</span>
    </span>
  );
};

export default ScrambleText;
