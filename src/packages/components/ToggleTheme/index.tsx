"use client";
import React from "react";
import { Icon } from "@iconify/react";
import { useTheme } from "@/providers/Theme";
import { motion } from "motion/react";
const ToggleTheme = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <motion.div
      whileTap={{ scale: 1.2, opacity: 0 }}
      onClick={toggleTheme}
      className="fixed bottom-5 right-5 md:bottom-10 md:right-10 size-10 rounded-full bg-blue-primary flex items-center justify-center cursor-pointer dark:bg-white"
    >
      {theme === "dark" ? (
        <Icon icon="solar:sun-bold" className="size-6 text-yellow-500" />
      ) : (
        <Icon icon="solar:moon-fog-bold" className="size-6 text-white" />
      )}
    </motion.div>
  );
};

export default ToggleTheme;
