"use client";
import { motion, useScroll, useSpring } from "motion/react";

/** Hairline along the top edge that fills with page progress. */
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-brand-ink"
      style={{ scaleX }}
    />
  );
};

export default ScrollProgress;
