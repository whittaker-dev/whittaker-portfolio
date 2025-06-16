"use client";
import { ITechStack } from "@/packages/database";
import { Icon } from "@iconify/react";
import React, { useMemo } from "react";
import { motion } from "motion/react";
import { twMerge } from "tailwind-merge";
import { t } from "i18next";
const TechStackItem = ({
  stack,
  index,
}: {
  stack: ITechStack;
  index: number;
}) => {
  const { experience: exp } = stack;
  const isBasic = exp > 0 && exp <= 1;
  const isIntermediate = exp > 1 && exp <= 3;
  const isAdvanced = exp > 3 && exp <= 5;
  const isExpert = exp > 5;

  const levelDotStyle = useMemo(() => {
    if (isBasic) {
      return "bg-gray-400 border-gray-400";
    }

    if (isIntermediate) {
      return "bg-green-400 border-green-400";
    }

    if (isAdvanced) {
      return "bg-green-primary border-green-primary";
    }
    if (isExpert) {
      return "bg-blue-primary border-blue-primary dark:bg-white";
    }
  }, [isAdvanced, isBasic, isExpert, isIntermediate]);

  const levelBadgeStyle = useMemo(() => {
    if (isBasic) {
      return "text-gray-400 border-gray-400 dark:bg-gray-400/50 dark:text-white";
    }

    if (isIntermediate) {
      return "text-green-400 border-green-400 dark:bg-green-400/50 dark:text-white";
    }
    if (isAdvanced) {
      return "text-green-primary border-green-primary dark:bg-green-primary/50 dark:text-white";
    }
    if (isExpert) {
      return "text-blue-primary border-blue-primary dark:bg-blue-primary/50 dark:text-white";
    }
  }, [isAdvanced, isBasic, isExpert, isIntermediate]);

  const level = useMemo(() => {
    if (isBasic) {
      return t("basic");
    }
    if (isIntermediate) {
      return t("intermediate");
    }
    if (isAdvanced) {
      return t("advanced");
    }
    if (isExpert) {
      return t("expert");
    }
  }, [isAdvanced, isBasic, isExpert, isIntermediate]);
  const LevelSection = () => {
    return (
      <div
        className={twMerge(
          "rounded-full bg-white px-2 py-1 text-xs font-semibold text-dark-primary border flex items-center justify-center gap-2",
          levelBadgeStyle,
        )}
      >
        <span
          className={twMerge(
            "w-1.5 h-1.5 rounded-full inline-block mr-1",
            levelDotStyle,
          )}
        ></span>
        <p>{level}</p>
      </div>
    );
  };

  const ExpSection = () => {
    return (
      <p
        className={twMerge(
          "text-[10px] md:text-xs font-medium text-gray-500",
          isBasic && "text-gray-400",
          isIntermediate && "text-green-400",
          isAdvanced && "text-green-primary",
          isExpert && "text-blue-primary",
        )}
      >
        {exp} {t("years_exp")}
      </p>
    );
  };

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
      className={twMerge(
        "card flex items-center justify-center flex-col gap-2 cursor-pointer group",
        isBasic && "hover:shadow-gray-400/25",
        isIntermediate && "hover:shadow-green-primary/25",
        isAdvanced && "hover:shadow-green-primary/25",
        isExpert && "hover:shadow-blue-primary/25",
      )}
    >
      <div className="size-12 md:size-16 flex items-center justify-center rounded-lg bg-gray-200 group-hover:scale-105 group-hover:-rotate-12 delay-150 ease-in-out transition-all group-hover:bg-green-400">
        <motion.div
          whileHover={{
            scale: 1.2,
            rotate: -25,
            transition: { duration: 0.1, ease: "linear" },
          }}
          className="group-hover:scale-110 group-hover:rotate-45 delay-150 ease-in-out transition-all"
        >
          <Icon icon={stack.icon} className="size-6 md:size-10" />
        </motion.div>
      </div>
      <p className="text-xs md:text-sm font-semibold text-dark-primary dark:text-white">
        {stack.name}
      </p>
      <LevelSection />

      <ExpSection />
    </motion.div>
  );
};

export default TechStackItem;
