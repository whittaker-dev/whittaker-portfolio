"use client";
import { motion } from "motion/react";
const AnimatedLinePath = () => {
  return (
    <motion.svg
      className="absolute -bottom-7 left-4 w-full h-16 overflow-visible"
      viewBox="0 0 800 60"
      fill="none"
      initial={{ width: 0 }}
      whileInView={{ width: "100%" }}
      transition={{ duration: 0.5, delay: 0.8 }}
    >
      {/* First curved underline - for "hello@" */}
      <path
        d="M20 25 Q200 15 380 25 T740 25"
        stroke='url("#SvgjsLinearGradient1003")'
        strokeLinecap="round"
        strokeWidth="20"
        fill="none"
        className={`transition-all duration-700 ease-out opacity-100`}
        style={{
          strokeDasharray: "1000",
          strokeDashoffset: 0,
          transitionDelay: "0ms",
        }}
      ></path>
      <defs>
        <linearGradient
          id="SvgjsLinearGradient1003"
          gradientTransform="rotate(360, 0.5, 0.5)"
        >
          <stop stopColor="hsl(50, 100%, 50%)" offset="0"></stop>
          <stop stopColor="hsl(245, 99%, 50%)" offset="1"></stop>
        </linearGradient>
      </defs>
    </motion.svg>
  );
};

export default AnimatedLinePath;
