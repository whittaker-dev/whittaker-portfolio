"use client";
import { ITechStack } from "@/packages/database";
import { Icon } from "@iconify/react";
import { t } from "i18next";
import { motion } from "motion/react";

const LEVELS = [
  { key: "basic", maxYears: 1 },
  { key: "intermediate", maxYears: 3 },
  { key: "advanced", maxYears: 5 },
  { key: "expert", maxYears: Infinity },
] as const;

const getLevel = (years: number) => {
  const index = LEVELS.findIndex((level) => years <= level.maxYears);
  return { index, key: LEVELS[index].key };
};

/** One tool: logo, name, a four-step level meter and the years of use set large. */
const TechStackRow = ({
  stack,
  index,
}: {
  stack: ITechStack;
  index: number;
}) => {
  const level = getLevel(stack.experience);

  return (
    <motion.li
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-5% 0px" }}
      transition={{
        duration: 0.5,
        // Rows arrive as a list; the cap keeps the last one from lagging behind the reader.
        delay: Math.min(index * 0.05, 0.25),
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group relative isolate flex items-center gap-4 border-b border-line py-4"
    >
      {/* Hover wash sweeps in from the left instead of a flat colour swap. */}
      <span
        aria-hidden="true"
        className="absolute inset-y-0 -inset-x-3 -z-10 origin-left scale-x-0 bg-paper-raised transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
      />
      <span className="flex size-11 shrink-0 items-center justify-center border border-line bg-paper-raised transition-colors group-hover:border-line-strong">
        <Icon icon={stack.icon} className="size-6" aria-hidden="true" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15px] font-semibold text-ink">
          {stack.name}
        </span>
        <span className="mt-1.5 flex items-center gap-2">
          <span
            className="flex gap-[3px]"
            role="img"
            aria-label={`${t("skill_level")}: ${t(level.key)}`}
          >
            {LEVELS.map((item, step) => (
              <span
                key={item.key}
                className={
                  step <= level.index
                    ? "h-1 w-3.5 bg-brand-ink"
                    : "h-1 w-3.5 bg-line-strong"
                }
              />
            ))}
          </span>
          <span className="text-[12px] text-ink-muted">{t(level.key)}</span>
        </span>
      </span>

      <span className="flex shrink-0 items-baseline gap-1">
        <span className="font-display text-[1.875rem] leading-none text-ink tabular-nums transition-colors group-hover:text-brand-ink">
          {stack.experience}
        </span>
        <span className="label">{t("years_short")}</span>
      </span>
    </motion.li>
  );
};

export default TechStackRow;
