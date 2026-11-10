"use client";

import { MotionConfig } from "motion/react";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const MOTION_STORAGE_KEY = "motion";

interface MotionContextType {
  /** False when the visitor turned motion off or their OS asks for reduced motion. */
  motionEnabled: boolean;
  toggleMotion: () => void;
  /** Becomes true once the intro curtain has lifted; the hero waits for it. */
  introDone: boolean;
  finishIntro: () => void;
}

const MotionContext = createContext<MotionContextType | undefined>(undefined);

const readInitialMotion = (): boolean => {
  if (typeof window === "undefined") return true;
  try {
    const stored = localStorage.getItem(MOTION_STORAGE_KEY);
    if (stored) return stored === "on";
  } catch {
    // Fall through to the OS preference.
  }
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const [motionEnabled, setMotionEnabled] = useState(readInitialMotion);
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.motion = motionEnabled ? "on" : "off";
  }, [motionEnabled]);

  const toggleMotion = useCallback(() => {
    setMotionEnabled((previous) => {
      const next = !previous;
      try {
        localStorage.setItem(MOTION_STORAGE_KEY, next ? "on" : "off");
      } catch {
        // Not persisted, still applied for this visit.
      }
      return next;
    });
  }, []);

  const finishIntro = useCallback(() => setIntroDone(true), []);

  const value = useMemo(
    () => ({ motionEnabled, toggleMotion, introDone, finishIntro }),
    [motionEnabled, toggleMotion, introDone, finishIntro],
  );

  return (
    <MotionContext.Provider value={value}>
      {/* "always" makes every motion component skip transform/layout animation;
          opacity and colour transitions still run, so state changes stay legible. */}
      <MotionConfig reducedMotion={motionEnabled ? "user" : "always"}>
        {children}
      </MotionConfig>
    </MotionContext.Provider>
  );
}

export function useMotionPreference() {
  const context = useContext(MotionContext);
  if (context === undefined) {
    throw new Error("useMotionPreference must be used within a MotionProvider");
  }
  return context;
}
