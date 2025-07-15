"use client";
import React from "react";
import { motion } from "motion/react";
import { ShimmeringText } from "@/components/animate-ui/text/shimmering";

type Props = {
  title: string;
  description: string;
  showUnderline?: boolean;
};

const SectionHeader = React.memo(
  ({ title, description, showUnderline }: Props) => {
    return (
      <motion.div className="flex items-center justify-center flex-col cursor-pointer">
        <motion.h1
          whileHover={{ scale: 1.1 }}
          className="text-xl md:text-4xl font-black text-green-primary border-2 border-green-primary rounded-xl py-2 px-4"
        >
          *
          <ShimmeringText
            className="text-xl md:text-4xl font-black text-green-primary mx-4"
            text={title}
            wave
            color="var(--color-green-primary)"
            shimmeringColor="var(--color-green-primary)"
          />
          *
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
      </motion.div>
    );
  },
);

SectionHeader.displayName = "SectionHeader";
export default SectionHeader;
