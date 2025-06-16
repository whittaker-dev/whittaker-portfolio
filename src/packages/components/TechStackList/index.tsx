"use client";
import { techStackCategories } from "@/packages/database";
import { t } from "i18next";
import { motion } from "motion/react";
import React, { useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import TechStackItem from "../TechStackItem";

const TechStackList = () => {
  const [categorySelected, setCategorySelected] = useState<string>("all");

  const handleCategorySelected = (category: string) => {
    setCategorySelected(category);
  };

  const techStackItems = useMemo(() => {
    if (categorySelected === "all") {
      return techStackCategories.flatMap((category) => category.techStacks);
    }
    return techStackCategories
      .filter((category) => category.name === categorySelected)
      .flatMap((category) => category.techStacks);
  }, [categorySelected]);

  return (
    <div className="mt-10">
      <div className="flex items-center justify-start gap-3 flex-wrap">
        <motion.div
          className={twMerge(
            "text-xs md:text-sm font-medium rounded-md md:rounded-lg px-4 py-2 shadow-sm border border-gray-200 text-dark-primary hover:shadow-lg transition-all duration-300 ease-in-out cursor-pointer hover:border-green-primary dark:text-white",
            categorySelected === "all"
              ? "bg-green-primary text-white border-none"
              : "",
          )}
          onClick={() => handleCategorySelected("all")}
        >
          {t("all")}
        </motion.div>
        {techStackCategories.map((category) => (
          <motion.div
            className={twMerge(
              "text-xs md:text-sm font-medium rounded-md md:rounded-lg px-4 py-2 shadow-sm border border-gray-200 text-dark-primary hover:shadow-lg transition-all duration-300 ease-in-out cursor-pointer hover:border-green-primary dark:text-white dark:hover:bg-green-primary/20",
              categorySelected === category.name
                ? "bg-green-primary text-white border-none dark:hover:bg-green-primary"
                : "",
            )}
            key={category.id}
            onClick={() => handleCategorySelected(category.name)}
          >
            {category.name}
          </motion.div>
        ))}
      </div>

      {categorySelected === "all" ? (
        <div className="mt-10">
          <div className="">
            {techStackCategories.map((category) => (
              <div key={category.id} className="mt-6">
                <h2 className="text-lg md:text-xl font-bold text-dark-primary dark:text-white">
                  {category.name}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2.5">
                  {category.techStacks.map((item, index) => (
                    <TechStackItem stack={item} key={item.id} index={index} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
          {techStackItems.map((item, index) => (
            <TechStackItem stack={item} key={item.id} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TechStackList;
