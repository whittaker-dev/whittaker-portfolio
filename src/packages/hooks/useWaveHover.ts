import { useMotionPreference } from "@/providers/Motion";
import { RefObject, useEffect } from "react";

/** Marks the letters a wave container drives. */
export const WAVE_LETTER_ATTR = "data-wave-letter";

// Deepest dip right under the pointer: the letter keeps 52% of its height.
const MAX_DIP = 0.48;
// Falloff radius, in multiples of the font size. About three Anton letters each side.
const RADIUS_EM = 1.1;
// Letters on other lines of a wrapped title should barely move, so vertical distance counts extra.
const VERTICAL_WEIGHT = 2.2;
const EASE = "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)";

type LetterCenter = { element: HTMLElement; x: number; y: number };

/**
 * A ripple that follows the pointer across a title: letters near it squash down from
 * their baseline and spring back as it moves away. Anton has no height axis, so scaleY
 * with a bottom origin stands in for the variable-font effect it imitates.
 * Only for fine pointers with motion on; letters only shrink, so they stay inside masks.
 */
export const useWaveHover = (containerRef: RefObject<HTMLElement | null>) => {
  const { motionEnabled } = useMotionPreference();

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !motionEnabled) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const letters = Array.from(
      container.querySelectorAll<HTMLElement>(`[${WAVE_LETTER_ATTR}]`),
    );
    if (letters.length === 0) return;

    letters.forEach((letter) => {
      letter.style.transformOrigin = "50% 100%";
      letter.style.transition = EASE;
    });

    let centers: LetterCenter[] = [];
    let radius = 0;
    let frame: number | null = null;
    let pointer = { x: 0, y: 0 };

    // Measured on enter rather than per move: layout does not change while hovering,
    // and reading rects on every pointermove would force layout each frame.
    const measure = () => {
      centers = letters.map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          element,
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };
      });
      radius = parseFloat(getComputedStyle(container).fontSize) * RADIUS_EM;
    };

    const render = () => {
      frame = null;
      centers.forEach(({ element, x, y }) => {
        const dx = (pointer.x - x) / radius;
        const dy = ((pointer.y - y) / radius) * VERTICAL_WEIGHT;
        const dip = MAX_DIP * Math.exp(-(dx * dx + dy * dy));
        element.style.transform = `scaleY(${(1 - dip).toFixed(3)})`;
      });
    };

    // Positions are viewport-relative, so a scroll under a resting pointer must re-measure.
    // Capture phase catches scrolling containers too (the project drawer), not just the page.
    const handleScroll = () => {
      measure();
      if (frame === null) frame = requestAnimationFrame(render);
    };
    const handleEnter = () => {
      measure();
      window.addEventListener("scroll", handleScroll, {
        capture: true,
        passive: true,
      });
    };
    const handleMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pointer = { x: event.clientX, y: event.clientY };
      if (frame === null) frame = requestAnimationFrame(render);
    };
    const handleLeave = () => {
      window.removeEventListener("scroll", handleScroll, { capture: true });
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      letters.forEach((letter) => (letter.style.transform = "scaleY(1)"));
    };

    container.addEventListener("pointerenter", handleEnter);
    container.addEventListener("pointermove", handleMove);
    container.addEventListener("pointerleave", handleLeave);
    return () => {
      container.removeEventListener("pointerenter", handleEnter);
      container.removeEventListener("pointermove", handleMove);
      container.removeEventListener("pointerleave", handleLeave);
      window.removeEventListener("scroll", handleScroll, { capture: true });
      if (frame !== null) cancelAnimationFrame(frame);
      letters.forEach((letter) => {
        letter.style.transform = "";
        letter.style.transition = "";
      });
    };
  }, [containerRef, motionEnabled]);
};
