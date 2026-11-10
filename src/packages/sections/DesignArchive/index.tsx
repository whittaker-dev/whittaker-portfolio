"use client";
import PosterLightbox from "@/packages/components/PosterLightbox";
import PosterRing from "@/packages/components/PosterRing";
import SplitReveal from "@/packages/components/SplitReveal";
import ViewSwitch, { ViewOption } from "@/packages/components/ViewSwitch";
import {
  designArchiveUrl,
  designWorks,
  IDesignWork,
} from "@/packages/database";
import { Icon } from "@iconify/react";
import { t } from "i18next";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import React, { useState } from "react";

type PosterView = "ring" | "grid";

const VIEWS: ViewOption<PosterView>[] = [
  { id: "ring", icon: "ph:circle-dashed-bold", label: "view_ring" },
  { id: "grid", icon: "ph:squares-four-bold", label: "view_grid" },
];

// Prints pinned up by hand never hang straight. A fixed sequence (not random) keeps the
// tilt identical between server and client render, and between visits.
const TILTS = [-2.2, 1.6, -1, 2.4, -1.8, 0.8, 1.9, -2.6, 1.2, -0.8, 2];

const pad = (value: number) => String(value).padStart(2, "0");

/**
 * The flat view: every poster at its own proportions on a salon-style wall, each one a
 * little crooked. With a mouse they also sit faded like old prints until hovered; touch
 * screens have no hover to restore the colour, so there they show in full.
 */
const PosterWall = ({
  works,
  onOpen,
}: {
  works: IDesignWork[];
  onOpen: (index: number) => void;
}) => (
  // CSS columns give a masonry wall from the posters' own ratios, with no layout script.
  <ul className="columns-2 gap-x-5 md:columns-3 lg:columns-5 lg:gap-x-7">
    {works.map((work, index) => {
      const tilt = TILTS[index % TILTS.length];
      return (
        <motion.li
          key={work.image}
          className="mb-8 break-inside-avoid pt-3 lg:mb-10"
          initial={{ opacity: 0, y: 48, rotate: 0 }}
          whileInView={{ opacity: 1, y: 0, rotate: tilt }}
          viewport={{ once: true, margin: "-8% 0px" }}
          transition={{
            duration: 0.9,
            delay: (index % 5) * 0.08,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <button
            type="button"
            onClick={() => onOpen(index)}
            aria-label={t("view_poster", { title: work.title })}
            data-cursor-label="View"
            className="group relative block w-full text-left transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:z-10 hover:-translate-y-1.5 hover:scale-[1.04] focus-visible:z-10"
            // Counter-rotates the li's tilt on hover, so the print straightens as it lifts.
            style={{ "--tilt": `${-tilt}deg` } as React.CSSProperties}
          >
            <span className="block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-[var(--tilt)] group-focus-visible:rotate-[var(--tilt)]">
              {/* Tape strip holding the print to the wall. */}
              <span
                aria-hidden
                className="absolute -top-3 left-1/2 z-10 h-5 w-14 -translate-x-1/2 rotate-[-4deg] bg-ink/15 backdrop-blur-[2px]"
              />
              <span
                className="relative block overflow-hidden border border-line bg-paper-raised shadow-[0_18px_30px_-18px_rgb(0_0_0/0.6)] transition-shadow duration-500 group-hover:shadow-[0_28px_50px_-20px_rgb(0_0_0/0.75)]"
                style={{ aspectRatio: `${work.width} / ${work.height}` }}
              >
                <Image
                  src={work.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 240px, (min-width: 768px) 30vw, 45vw"
                  className="object-cover transition-[filter] pointer-fine:grayscale-[0.7] pointer-fine:brightness-[0.85] duration-700 group-hover:grayscale-0 group-hover:brightness-100 group-focus-visible:grayscale-0 group-focus-visible:brightness-100"
                />
              </span>
              <span className="mt-3 flex items-baseline gap-2">
                <span className="font-mono text-[11px] text-brand-ink tabular-nums">
                  {pad(index + 1)}
                </span>
                <span className="truncate text-[13px] font-semibold text-ink">
                  {work.title}
                </span>
              </span>
              <span className="label mt-0.5 block truncate pl-[calc(2ch+0.5rem)]">
                {work.kind}
              </span>
            </span>
          </button>
        </motion.li>
      );
    })}
  </ul>
);

/**
 * A small coda to the projects: poster work from before the move into code, shown on a
 * concave ring or as a flat strip. Either one opens a poster full size in a lightbox.
 */
const DesignArchive = () => {
  const [view, setView] = useState<PosterView>("ring");
  const [openIndex, setOpenIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const openPoster = (index: number) => {
    setOpenIndex(index);
    setIsOpen(true);
  };

  return (
    <section id="design" className="border-t border-line py-20 md:py-28">
      <div className="shell">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:items-end md:gap-10">
          <SplitReveal
            text={t("design_title")}
            withStop
            className="text-[clamp(2.5rem,5vw,4rem)] md:col-span-6"
          />
          <div className="md:col-span-6 lg:col-span-5 lg:col-start-8">
            <p className="max-w-[46ch] text-[15px] leading-relaxed text-ink-muted">
              {t("design_desc")}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-4">
              <ViewSwitch
                id="poster-view"
                label={t("poster_view")}
                value={view}
                options={VIEWS.map((option) => ({
                  ...option,
                  label: t(option.label),
                }))}
                onChange={setView}
              />
              <a
                href={designArchiveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 border-b border-line-strong pb-1 text-sm font-semibold text-ink transition-colors hover:border-brand-ink"
              >
                {t("design_more")}
                <Icon
                  icon="ph:arrow-up-right-bold"
                  className="size-3.5 text-brand-ink transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {view === "ring" ? (
                <PosterRing works={designWorks} onOpen={openPoster} />
              ) : (
                <PosterWall works={designWorks} onOpen={openPoster} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <PosterLightbox
        works={designWorks}
        index={openIndex}
        isOpen={isOpen}
        onIndexChange={setOpenIndex}
        onClose={() => setIsOpen(false)}
      />
    </section>
  );
};

export default DesignArchive;
