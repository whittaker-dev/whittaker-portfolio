"use client";
import React from "react";
import { motion } from "motion/react";

type Props = {
  title: string;
  description: string;
  showUnderline?: boolean;
};

const SectionHeader = React.memo(
  ({ title, description, showUnderline }: Props) => {
    return (
      <div className="flex items-center justify-center flex-col">
        <motion.h1 className="text-2xl md:text-4xl font-black text-green-primary py-2 px-4 border border-green-primary rounded-xl bg-white dark:border-green-primary">
          * {title} *
        </motion.h1>
        {showUnderline && (
          <motion.div
            className={`h-1 md:h-1.5 lg:h-2 bg-green-primary-600 rounded-xl mb-3 md:mb-4 lg:mb-6 mx-auto mt-4`}
            initial={{ width: 0 }}
            whileInView={{ width: 200 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          />
        )}
        <motion.p className="text-sm md:text-base font-normal text-dark-primary text-center dark:text-white">
          {description}
        </motion.p>
      </div>
    );
  },
);

SectionHeader.displayName = "SectionHeader";
export default SectionHeader;
