"use client";
import { Icon } from "@iconify/react";
import { LayoutGroup, motion } from "motion/react";
import { twMerge } from "tailwind-merge";

export type ViewOption<T extends string> = {
  id: T;
  icon: string;
  label: string;
};

type Props<T extends string> = {
  value: T;
  options: ViewOption<T>[];
  onChange: (value: T) => void;
  /** Accessible name for the group, e.g. "Project view". */
  label: string;
  /** Unique per switch on the page, so each fill animates within its own group. */
  id: string;
};

/** Segmented control for switching how a section lays out its items. */
const ViewSwitch = <T extends string>({
  value,
  options,
  onChange,
  label,
  id,
}: Props<T>) => (
  <LayoutGroup id={id}>
    <div
      role="radiogroup"
      aria-label={label}
      className="inline-flex border border-line-strong p-1"
    >
      {options.map((option) => {
        const isSelected = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(option.id)}
            className={twMerge(
              "relative flex h-9 items-center gap-2 px-4 text-[13px] font-medium text-ink-muted transition-colors hover:text-ink",
              isSelected && "text-paper hover:text-paper",
            )}
          >
            {isSelected && (
              <motion.span
                layoutId={`${id}-fill`}
                className="absolute inset-0 bg-ink"
                transition={{ type: "spring", stiffness: 400, damping: 36 }}
              />
            )}
            <Icon icon={option.icon} className="relative size-4" />
            <span className="relative">{option.label}</span>
          </button>
        );
      })}
    </div>
  </LayoutGroup>
);

export default ViewSwitch;
