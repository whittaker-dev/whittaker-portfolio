"use client";
import { useMotionPreference } from "@/providers/Motion";
import { motion, useMotionValue, useSpring } from "motion/react";
import React, { useRef } from "react";

type Props = {
  children: React.ReactNode;
  /** Share of the pointer offset the element follows; 0.3 drifts, 0.5 sticks. */
  strength?: number;
  className?: string;
};

const SPRING = { stiffness: 220, damping: 18, mass: 0.4 };

/** Pulls its child toward the pointer while hovered, then springs back. */
const Magnetic = ({ children, strength = 0.3, className }: Props) => {
  const { motionEnabled } = useMotionPreference();
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(useMotionValue(0), SPRING);
  const y = useSpring(useMotionValue(0), SPRING);

  const handleMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!motionEnabled || event.pointerType !== "mouse" || !ref.current) return;
    const bounds = ref.current.getBoundingClientRect();
    x.set((event.clientX - (bounds.left + bounds.width / 2)) * strength);
    y.set((event.clientY - (bounds.top + bounds.height / 2)) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className ?? "inline-block"}
      style={{ x, y }}
      onPointerMove={handleMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.div>
  );
};

export default Magnetic;
