import { useResponsiveDetect } from "@/packages/hooks";
import React from "react";
import { Easing, motion } from "motion/react";

const BackgroundWithoutPoints = () => {
  const { isMobile } = useResponsiveDetect();

  const animationConfig = isMobile
    ? { duration: 12, ease: "linear" as Easing }
    : { duration: 8, ease: "easeInOut" as Easing };
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-black" />
      <motion.div
        className={`absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-500/20 dark:from-blue-500/30 dark:to-purple-600/30 rounded-full -z-10 ${
          isMobile ? "blur-xl" : "blur-3xl"
        }`}
        animate={
          isMobile
            ? {
                x: [0, 50, 0],
                y: [0, -25, 0],
              }
            : {
                x: [0, 100, 0],
                y: [0, -50, 0],
                scale: [1, 1.2, 1],
              }
        }
        transition={{
          ...animationConfig,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        style={{ willChange: "transform" }}
      />

      <motion.div
        className={`absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-r from-cyan-300/15 to-blue-400/15 dark:from-cyan-400/25 dark:to-blue-500/25 rounded-full ${
          isMobile ? "blur-lg" : "blur-3xl"
        }`}
        animate={
          isMobile
            ? {
                x: [0, -40, 0],
                y: [0, 30, 0],
              }
            : {
                x: [0, -80, 0],
                y: [0, 60, 0],
                scale: [1, 0.8, 1],
              }
        }
        transition={{
          duration: animationConfig.duration + 2,
          repeat: Infinity,
          repeatType: "reverse",
          ease: animationConfig.ease,
        }}
        style={{ willChange: "transform" }}
      />
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-white/20 dark:to-black/15" />
    </div>
  );
};

export default BackgroundWithoutPoints;
