"use client";
import { useMotionPreference } from "@/providers/Motion";
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import React, { useRef } from "react";

const wrap = (min: number, max: number, value: number) => {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
};

type Props = {
  items: string[];
  /** Percent of one copy's width travelled per second at rest. */
  baseVelocity?: number;
};

/**
 * A tape of names that drifts on its own and speeds up (or reverses) with scroll velocity.
 * The list is rendered twice so the -50% wrap point is seamless.
 */
const Marquee = ({ items, baseVelocity = 2.5 }: Props) => {
  const { motionEnabled } = useMotionPreference();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref);
  const baseX = useMotionValue(0);
  const direction = useRef(-1);

  const { scrollY } = useScroll();
  const smoothVelocity = useSpring(useVelocity(scrollY), {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 4], {
    clamp: false,
  });
  const x = useTransform(baseX, (value) => `${wrap(-50, 0, value)}%`);

  useAnimationFrame((_, delta) => {
    // An offscreen or disabled marquee costs nothing per frame.
    if (!motionEnabled || !isInView) return;
    const factor = velocityFactor.get();
    if (factor < 0) direction.current = 1;
    else if (factor > 0) direction.current = -1;
    let moveBy = direction.current * baseVelocity * (delta / 1000);
    moveBy += moveBy * Math.abs(factor);
    baseX.set(baseX.get() + moveBy);
  });

  const renderCopy = (copy: number) => (
    <div
      className="flex shrink-0 items-center"
      aria-hidden={copy > 0 ? "true" : undefined}
    >
      {items.map((item) => (
        <span key={`${copy}-${item}`} className="flex items-center">
          <span className="display px-6 text-[clamp(2.25rem,5vw,4.5rem)] md:px-10">
            {item}
          </span>
          <span className="size-2.5 shrink-0 bg-brand-ink" />
        </span>
      ))}
    </div>
  );

  return (
    <div
      ref={ref}
      className="overflow-hidden border-y border-line py-5 md:py-7"
    >
      <motion.div className="flex w-max" style={{ x }}>
        {renderCopy(0)}
        {renderCopy(1)}
      </motion.div>
    </div>
  );
};

export default Marquee;
