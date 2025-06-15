"use client";
import { ITechStack } from "@/packages/database";
import { Icon } from "@iconify/react";
import React from "react";
import { motion } from "motion/react";
const TechStackItem = ({
  stack,
  index,
}: {
  stack: ITechStack;
  index: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: index * 0.05,
        type: "spring",
        stiffness: 100,
      }}
      viewport={{ once: true }}
      className="card flex items-center justify-center flex-col gap-2"
    >
      <div className="size-12 md:size-14 flex items-center justify-center rounded-lg bg-gray-200 ">
        <Icon icon={stack.icon} className="size-6 md:size-8" />
      </div>
      <p className="text-xs md:text-sm font-semibold text-dark-primary dark:text-white">
        {stack.name}
      </p>
    </motion.div>
  );
};

export default TechStackItem;
