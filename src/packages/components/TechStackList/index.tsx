"use client";
import { ITechStackCategory, techStackCategories } from "@/packages/database";
import { Icon } from "@iconify/react";
import { t } from "i18next";
import { LayoutGroup, motion } from "motion/react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import TechStackRow from "../TechStackRow";
import WaveText from "../WaveText";

const ALL = "all";

const CategoryGroup = ({ category }: { category: ITechStackCategory }) => {
  // Most years first, so each group opens on its strongest tools.
  // Array.sort is stable, so equal years keep the order they have in the data.
  const sorted = [...category.techStacks].sort(
    (a, b) => b.experience - a.experience,
  );

  return (
    <div className="grid grid-cols-1 gap-4 border-t border-line-strong pt-6 lg:grid-cols-12 lg:gap-10">
      <div className="flex items-baseline justify-between gap-4 lg:col-span-3 lg:flex-col lg:justify-start">
        <h3 className="font-display text-[1.75rem] uppercase leading-none text-ink">
          <WaveText text={category.name} />
        </h3>
        <p className="label">
          {t("tools_count", { count: category.techStacks.length })}
        </p>
      </div>
      <ul className="grid grid-cols-1 gap-x-10 md:grid-cols-2 lg:col-span-9">
        {sorted.map((stack, index) => (
          <TechStackRow key={stack.id} stack={stack} index={index} />
        ))}
      </ul>
    </div>
  );
};

/**
 * Closes the list in the same shape as a category: the tools above are a selection,
 * and this says so plainly instead of implying they are the whole toolbox.
 */
const MoreGroup = () => (
  <div className="grid grid-cols-1 gap-4 border-t border-line-strong pt-6 lg:grid-cols-12 lg:gap-10">
    <h3 className="font-display text-[1.75rem] uppercase leading-none text-ink lg:col-span-3">
      <WaveText text={t("stack_more_title")} />
      <span className="text-brand-ink">…</span>
    </h3>
    <div className="lg:col-span-9">
      <p className="max-w-[56ch] text-[17px] leading-relaxed text-ink md:text-lg">
        {t("stack_more_desc")}
      </p>
      <a
        href="#contact"
        className="group mt-5 inline-flex items-center gap-2 border-b border-line-strong pb-1 text-sm font-semibold text-ink transition-colors hover:border-brand-ink"
      >
        {t("stack_more_cta")}
        <Icon
          icon="ph:arrow-up-right-bold"
          className="size-3.5 text-brand-ink transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      </a>
    </div>
  </div>
);

const TechStackList = () => {
  const [selected, setSelected] = useState<string>(ALL);
  const tabs = [ALL, ...techStackCategories.map((category) => category.name)];
  const visibleCategories =
    selected === ALL
      ? techStackCategories
      : techStackCategories.filter((category) => category.name === selected);

  return (
    <div className="mt-14 md:mt-20">
      <LayoutGroup id="stack-tabs">
        <div
          role="tablist"
          aria-label={t("technology_stack")}
          className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 md:mx-0 md:flex-wrap md:px-0"
        >
          {tabs.map((tab) => {
            const isSelected = selected === tab;
            return (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-controls="stack-panel"
                onClick={() => setSelected(tab)}
                className={twMerge(
                  "relative h-9 shrink-0 border border-line px-4 text-[13px] font-medium text-ink-muted transition-colors hover:text-ink",
                  isSelected && "border-ink text-paper hover:text-paper",
                )}
              >
                {isSelected && (
                  <motion.span
                    layoutId="stack-tab-fill"
                    className="absolute inset-0 bg-ink"
                    transition={{ type: "spring", stiffness: 400, damping: 36 }}
                  />
                )}
                <span className="relative">{tab === ALL ? t("all") : tab}</span>
              </button>
            );
          })}
        </div>
      </LayoutGroup>

      <div id="stack-panel" role="tabpanel" className="mt-10 space-y-12">
        {visibleCategories.map((category) => (
          <CategoryGroup key={category.id} category={category} />
        ))}
        <MoreGroup />
      </div>
    </div>
  );
};

export default TechStackList;
