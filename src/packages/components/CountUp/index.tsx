"use client";
import { useMotionPreference } from "@/providers/Motion";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useEffect } from "react";

type Props = {
  value: number;
  play: boolean;
  suffix?: string;
  delay?: number;
};

/** Counts from zero to `value` once `play` turns true. Shows the final value when motion is off. */
const CountUp = ({ value, play, suffix = "", delay = 0 }: Props) => {
  const { motionEnabled } = useMotionPreference();
  const count = useMotionValue(motionEnabled ? 0 : value);
  const text = useTransform(
    count,
    (latest) => `${Math.round(latest)}${suffix}`,
  );

  useEffect(() => {
    if (!motionEnabled) {
      count.set(value);
      return;
    }
    if (!play) return;
    const controls = animate(count, value, {
      duration: 1.4,
      delay,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [count, value, play, delay, motionEnabled]);

  // A MotionValue child updates the text node directly, without re-rendering React.
  return <motion.span className="tabular-nums">{text}</motion.span>;
};

export default CountUp;
