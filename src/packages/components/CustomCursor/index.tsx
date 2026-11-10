"use client";
import { useMotionPreference } from "@/providers/Motion";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "motion/react";
import { useEffect, useState } from "react";

type CursorState = "default" | "link" | "label" | "hidden";

const RING_SPRING = { stiffness: 350, damping: 32, mass: 0.6 };

const readState = (target: EventTarget | null): [CursorState, string] => {
  if (!(target instanceof Element)) return ["default", ""];
  if (target.closest("input, textarea, select")) return ["hidden", ""];
  const labelled = target.closest<HTMLElement>("[data-cursor-label]");
  if (labelled) return ["label", labelled.dataset.cursorLabel ?? ""];
  if (target.closest("a, button, [role='tab'], label")) return ["link", ""];
  return ["default", ""];
};

/**
 * A dot that tracks the pointer exactly and a ring that trails it. Mounted only for
 * fine pointers with motion on; touch devices and reduced motion keep the native cursor.
 */
const CustomCursor = () => {
  const { motionEnabled } = useMotionPreference();
  const [isFinePointer, setIsFinePointer] = useState(false);
  const [state, setState] = useState<CursorState>("default");
  const [label, setLabel] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, RING_SPRING);
  const ringY = useSpring(y, RING_SPRING);

  useEffect(() => {
    const query = window.matchMedia("(pointer: fine)");
    const update = () => setIsFinePointer(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const isActive = isFinePointer && motionEnabled;

  useEffect(() => {
    if (!isActive) return;
    document.documentElement.dataset.cursor = "on";

    const handleMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      setIsVisible(true);
    };
    const handleOver = (event: PointerEvent) => {
      const [nextState, nextLabel] = readState(event.target);
      setState(nextState);
      setLabel(nextLabel);
    };
    const handleLeave = () => setIsVisible(false);

    window.addEventListener("pointermove", handleMove, { passive: true });
    window.addEventListener("pointerover", handleOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", handleLeave);
    return () => {
      delete document.documentElement.dataset.cursor;
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerover", handleOver);
      document.documentElement.removeEventListener("pointerleave", handleLeave);
    };
  }, [isActive, x, y]);

  if (!isActive) return null;

  const isShown = isVisible && state !== "hidden";
  const ringSize = state === "label" ? 88 : state === "link" ? 56 : 34;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[100]"
    >
      <motion.div
        className="absolute left-0 top-0 flex items-center justify-center rounded-full border"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: ringSize,
          height: ringSize,
          opacity: isShown ? 1 : 0,
          backgroundColor:
            state === "label"
              ? "var(--brand)"
              : state === "link"
                ? "color-mix(in oklch, var(--brand-ink) 14%, transparent)"
                : "rgba(0,0,0,0)",
          borderColor:
            state === "default" ? "var(--line-strong)" : "var(--brand-ink)",
        }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <AnimatePresence>
          {state === "label" && (
            <motion.span
              key={label}
              className="label text-on-brand"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.2 }}
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
      <motion.div
        className="absolute left-0 top-0 size-1.5 rounded-full bg-brand-ink"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: isShown && state !== "label" ? 1 : 0 }}
        transition={{ duration: 0.15 }}
      />
    </div>
  );
};

export default CustomCursor;
