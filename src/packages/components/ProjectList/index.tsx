"use client";
import { IProject } from "@/packages/database";
import { useMotionPreference } from "@/providers/Motion";
import { Icon } from "@iconify/react";
import { t } from "i18next";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "motion/react";
import Image from "next/image";
import React, { useState } from "react";
import WaveText from "../WaveText";

type Props = {
  projects: IProject[];
  onOpen: (index: number) => void;
};

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
const FOLLOW_SPRING = { stiffness: 260, damping: 28, mass: 0.6 };

/**
 * Editorial index of projects: one large row each. On fine pointers the hovered
 * project's cover floats beside the cursor, so the list stays scannable without
 * giving up the imagery.
 */
const ProjectList = ({ projects, onOpen }: Props) => {
  const { motionEnabled } = useMotionPreference();
  const [hovered, setHovered] = useState<number | null>(null);
  const x = useSpring(useMotionValue(0), FOLLOW_SPRING);
  const y = useSpring(useMotionValue(0), FOLLOW_SPRING);

  const handleMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - bounds.left);
    y.set(event.clientY - bounds.top);
  };

  const preview = hovered === null ? null : projects[hovered];

  return (
    <div
      className="relative"
      onPointerMove={handleMove}
      onPointerLeave={() => setHovered(null)}
    >
      <ul className="border-t border-line-strong">
        {projects.map((project, index) => (
          <motion.li
            key={project.id}
            className="border-b border-line"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-5% 0px" }}
            transition={{
              duration: 0.6,
              delay: Math.min(index * 0.06, 0.3),
              ease: EASE_OUT_EXPO,
            }}
          >
            <button
              type="button"
              onClick={() => onOpen(index)}
              onPointerEnter={() => setHovered(index)}
              aria-label={t("open_project", { title: project.title })}
              className="group relative isolate grid w-full grid-cols-[3rem_1fr_auto] items-center gap-4 py-6 text-left md:grid-cols-[5.5rem_1fr_auto_auto] md:gap-8 md:py-8"
            >
              <span
                aria-hidden="true"
                className="absolute inset-y-0 -inset-x-3 -z-10 origin-left scale-x-0 bg-paper-raised transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
              />
              <span className="font-display text-[2rem] leading-none text-brand-ink tabular-nums md:text-[3rem]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0">
                <span className="display block text-[clamp(1.75rem,4vw,3.25rem)]">
                  <WaveText text={project.title} />
                </span>
                <span className="mt-2 block truncate text-[13px] text-ink-muted">
                  {project.techStacks.slice(0, 5).join(" · ")}
                </span>
              </span>
              <span className="label hidden md:block">
                {project.demos?.length ? t("live") : t("source_only")}
              </span>
              <Icon
                icon="ph:arrow-up-right-bold"
                className="size-6 shrink-0 text-ink-muted transition-[transform,color] duration-300 group-hover:rotate-45 group-hover:text-brand-ink"
              />
            </button>
          </motion.li>
        ))}
      </ul>

      {/* Floating cover. Pointer-events off so it never steals the row's hover. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 z-20 hidden w-[340px] lg:block"
        style={{ x, y, translateX: "-50%", translateY: "-115%" }}
      >
        <AnimatePresence mode="popLayout">
          {preview && (
            <motion.div
              key={preview.id}
              className="relative aspect-[16/10] overflow-hidden border border-line-strong bg-paper-raised shadow-[0_24px_60px_-20px_rgb(0_0_0_/_0.55)]"
              initial={
                motionEnabled
                  ? { clipPath: "inset(100% 0% 0% 0%)", opacity: 1 }
                  : { opacity: 0 }
              }
              animate={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
            >
              <Image
                src={preview.coverImage}
                alt=""
                fill
                sizes="340px"
                className="object-cover"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ProjectList;
