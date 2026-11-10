import React from "react";
import { twMerge } from "tailwind-merge";
import SplitReveal from "../SplitReveal";

type Props = {
  title: string;
  description?: React.ReactNode;
  /** Right-hand slot under the description, e.g. a count or a link. */
  aside?: React.ReactNode;
  className?: string;
};

/** Display title on the left, its supporting sentence on the right, aligned to the baseline. */
const SectionHeading = ({ title, description, aside, className }: Props) => {
  return (
    <div
      className={twMerge(
        "grid grid-cols-1 gap-6 md:grid-cols-12 md:items-end md:gap-10",
        className,
      )}
    >
      <SplitReveal
        text={title}
        withStop
        className="text-[clamp(3rem,8.5vw,6rem)] md:col-span-8"
      />
      {(description || aside) && (
        <div className="md:col-span-4 md:pb-2">
          {description && (
            <p className="max-w-[38ch] text-[15px] leading-relaxed text-ink-muted">
              {description}
            </p>
          )}
          {aside && <div className="mt-4">{aside}</div>}
        </div>
      )}
    </div>
  );
};

export default SectionHeading;
