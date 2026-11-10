import { useMotionPreference } from "@/providers/Motion";
import {
  animate,
  useInView,
  useMotionValue,
  useMotionValueEvent,
} from "motion/react";
import React, {
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

// How far the ring turns per pixel dragged.
const DEG_PER_PX = 0.22;
// Below this the gesture is a click, not a drag.
const DRAG_THRESHOLD_PX = 6;
// Seconds of fling momentum carried into the snap, so a quick flick skips items.
const VELOCITY_PROJECTION = 0.12;
const SPRING = { type: "spring", stiffness: 80, damping: 18, mass: 1 } as const;

const mod = (value: number, length: number) =>
  ((value % length) + length) % length;

type Options = {
  /** Positions around the full circle; slot i sits at i * (360 / slots) degrees. */
  slots: number;
  stageRef: RefObject<HTMLElement | null>;
  /** Advance one slot this often while on screen; omit to disable. */
  autoplayMs?: number;
  /** Hover or focus inside the carousel; holds autoplay. */
  isPaused?: boolean;
};

/**
 * Rotation state shared by the 3D carousels: a degree value that drag, flick, keys and
 * autoplay all drive, always settling on a whole slot. Slot 0 faces the viewer at 0deg,
 * and turning to slot i means a rotation of -i * step.
 */
export const useRingRotation = ({
  slots,
  stageRef,
  autoplayMs,
  isPaused = false,
}: Options) => {
  const { motionEnabled } = useMotionPreference();
  const step = 360 / slots;
  const rotation = useMotionValue(0);
  const [activeSlot, setActiveSlot] = useState(0);
  const isInView = useInView(stageRef, { margin: "-20% 0px" });
  const drag = useRef<{
    startX: number;
    startRotation: number;
    moved: boolean;
  } | null>(null);
  // A drag ends with a click on whatever item is under the pointer; that click must not count.
  const suppressClick = useRef(false);

  useMotionValueEvent(rotation, "change", (value) => {
    const next = mod(Math.round(-value / step), slots);
    setActiveSlot((previous) => (previous === next ? previous : next));
  });

  const settle = useCallback(
    (target: number) => {
      animate(rotation, target, motionEnabled ? SPRING : { duration: 0 });
    },
    [rotation, motionEnabled],
  );

  /** Turns to a slot by the shortest way round. */
  const goToSlot = useCallback(
    (slot: number) => {
      const base = -slot * step;
      const turns = Math.round((rotation.get() - base) / 360);
      settle(base + turns * 360);
    },
    [rotation, settle, step],
  );

  const goBy = useCallback(
    (delta: number) => {
      const snapped = Math.round(rotation.get() / step) * step;
      settle(snapped - delta * step);
    },
    [rotation, settle, step],
  );

  useEffect(() => {
    if (!autoplayMs || !motionEnabled || !isInView || isPaused) return;
    const id = setInterval(() => goBy(1), autoplayMs);
    return () => clearInterval(id);
  }, [autoplayMs, motionEnabled, isInView, isPaused, goBy]);

  const onPointerDown = (event: React.PointerEvent<HTMLElement>) => {
    if (event.button !== 0) return;
    rotation.stop();
    drag.current = {
      startX: event.clientX,
      startRotation: rotation.get(),
      moved: false,
    };
  };

  const onPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const current = drag.current;
    if (!current) return;
    const dx = event.clientX - current.startX;
    if (!current.moved) {
      if (Math.abs(dx) < DRAG_THRESHOLD_PX) return;
      current.moved = true;
      // Captured only once it is a real drag, so a plain click still reaches the item.
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    rotation.set(current.startRotation + dx * DEG_PER_PX);
  };

  const onPointerEnd = () => {
    const current = drag.current;
    drag.current = null;
    if (!current?.moved) return;
    suppressClick.current = true;
    setTimeout(() => (suppressClick.current = false), 0);
    const projected =
      rotation.get() + rotation.getVelocity() * VELOCITY_PROJECTION;
    settle(Math.round(projected / step) * step);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goBy(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      goBy(-1);
    }
  };

  /** False right after a drag, so the release does not also count as a click. */
  const isClickAllowed = () => !suppressClick.current;

  return {
    rotation,
    step,
    activeSlot,
    goToSlot,
    goBy,
    isClickAllowed,
    stageHandlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: onPointerEnd,
      onPointerCancel: onPointerEnd,
      onKeyDown,
    },
  };
};
