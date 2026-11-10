"use client";
import { IProject } from "@/packages/database";
import { useRingRotation } from "@/packages/hooks";
import { Icon } from "@iconify/react";
import { t } from "i18next";
import {
  AnimatePresence,
  motion,
  MotionValue,
  useTransform,
} from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import WaveText from "../WaveText";

// Looking slightly down onto the ring is what makes it read as a circle, not a row.
const RING_TILT_DEG = -7;
// Extra air between neighbours beyond the radius that would make them touch.
const RADIUS_SPACING = 1.22;
const CAPTION_HEIGHT = 76;
const AUTOPLAY_MS = 4500;
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

const pad = (value: number) => String(value).padStart(2, "0");

type RingCardProps = {
  project: IProject;
  index: number;
  step: number;
  radius: number;
  cardWidth: number;
  rotation: MotionValue<number>;
  isActive: boolean;
  onSelect: (index: number) => void;
};

const RingCard = ({
  project,
  index,
  step,
  radius,
  cardWidth,
  rotation,
  isActive,
  onSelect,
}: RingCardProps) => {
  // 1 when the card faces the viewer, 0 side-on, negative once it turns away.
  const facing = useTransform(rotation, (value) =>
    Math.cos(((index * step + value) * Math.PI) / 180),
  );
  const opacity = useTransform(
    facing,
    (value) => 0.12 + 0.88 * Math.max(0, value) ** 1.6,
  );
  const filter = useTransform(
    facing,
    (value) => `brightness(${(0.4 + 0.6 * Math.max(0, value)).toFixed(3)})`,
  );

  return (
    <div
      className="absolute left-1/2 top-0"
      style={{
        width: cardWidth,
        marginLeft: -cardWidth / 2,
        transform: `rotateY(${index * step}deg) translateZ(${radius}px)`,
        backfaceVisibility: "hidden",
      }}
    >
      <motion.button
        type="button"
        onClick={() => onSelect(index)}
        tabIndex={isActive ? 0 : -1}
        // The front card opens its details; any other card turns the ring to itself.
        aria-label={
          isActive ? t("open_project", { title: project.title }) : project.title
        }
        data-cursor-label={isActive ? "View" : undefined}
        style={{ opacity, filter }}
        className={twMerge(
          "group block w-full overflow-hidden border bg-paper-raised text-left transition-[border-color] duration-500",
          isActive ? "border-brand-ink" : "border-line-strong",
        )}
      >
        <span className="relative block aspect-[16/10] overflow-hidden border-b border-line">
          <Image
            src={project.coverImage}
            alt=""
            fill
            draggable={false}
            sizes={`${cardWidth}px`}
            className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
          />
          <span className="label absolute left-3 top-3 bg-paper px-2 py-1 text-ink">
            {project.demos?.length ? t("live") : t("source_only")}
          </span>
        </span>
        <span
          className="flex items-center gap-3 px-4"
          style={{ height: CAPTION_HEIGHT }}
        >
          <span className="font-display text-[2.25rem] leading-none text-brand-ink tabular-nums">
            {pad(index + 1)}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[15px] font-semibold uppercase text-ink">
              {project.title}
            </span>
            <span className="mt-0.5 block truncate text-[12px] text-ink-muted">
              {project.techStacks.slice(0, 3).join(" · ")}
            </span>
          </span>
        </span>
      </motion.button>
    </div>
  );
};

type Props = {
  projects: IProject[];
  onOpen: (index: number) => void;
};

/**
 * Projects stand on a 3D ring. Drag or flick to spin it (it snaps to the nearest
 * project), use the arrows or keys, or let it turn on its own while it is on screen.
 */
const ProjectRing = ({ projects, onOpen }: Props) => {
  const total = projects.length;
  const stageRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(420);
  const [isPaused, setIsPaused] = useState(false);
  const {
    rotation,
    step,
    activeSlot: active,
    goToSlot: goTo,
    goBy,
    isClickAllowed,
    stageHandlers,
  } = useRingRotation({
    slots: total,
    stageRef,
    autoplayMs: AUTOPLAY_MS,
    isPaused,
  });

  // Exact radius at which neighbouring cards would touch, plus breathing room.
  const radius = Math.round(
    (cardWidth / 2 / Math.tan(Math.PI / total)) * RADIUS_SPACING,
  );
  const cardHeight = (cardWidth * 10) / 16 + CAPTION_HEIGHT;

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;
      const share = width < 768 ? 0.7 : 0.34;
      setCardWidth(Math.round(Math.min(460, Math.max(230, width * share))));
    });
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  const handleSelect = (index: number) => {
    if (!isClickAllowed()) return;
    if (index === active) onOpen(index);
    else goTo(index);
  };

  const current = projects[active];

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={t("carousel_label")}
      onPointerEnter={() => setIsPaused(true)}
      onPointerLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      {/* ==== STAGE ==== */}
      <div
        ref={stageRef}
        tabIndex={0}
        {...stageHandlers}
        data-cursor-label="Drag"
        // overflow-x: clip, not hidden: the side cards poke past the edges on narrow screens and
        // would widen the page, but clip keeps the 3D context intact and adds no scroll container.
        className="relative cursor-grab touch-pan-y select-none overflow-x-clip outline-none active:cursor-grabbing"
        style={{
          height: cardHeight + 90,
          perspective: radius * 3.4,
          perspectiveOrigin: "50% 30%",
        }}
      >
        {/* Floor light: grounds the ring so it reads as standing, not floating. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-[12%] bottom-0 h-24"
          style={{
            background:
              "radial-gradient(ellipse at center, color-mix(in oklch, var(--brand-ink) 22%, transparent), transparent 70%)",
          }}
        />
        <motion.div
          className="absolute inset-x-0 top-10"
          style={{
            height: cardHeight,
            transformStyle: "preserve-3d",
            z: -radius,
            rotateX: RING_TILT_DEG,
            rotateY: rotation,
          }}
        >
          {projects.map((project, index) => (
            <RingCard
              key={project.id}
              project={project}
              index={index}
              step={step}
              radius={radius}
              cardWidth={cardWidth}
              rotation={rotation}
              isActive={index === active}
              onSelect={handleSelect}
            />
          ))}
        </motion.div>
      </div>

      {/* ==== CAPTION + CONTROLS ==== */}
      <div className="mt-8 grid grid-cols-1 gap-6 border-t border-line pt-6 md:grid-cols-[1fr_auto] md:items-end">
        <div className="min-w-0" aria-live="polite">
          <span className="sr-only">
            {t("project_position", {
              current: active + 1,
              total,
              title: current.title,
            })}
          </span>
          <p className="font-mono text-[12px] tracking-[0.12em] text-ink-muted tabular-nums">
            <span className="text-brand-ink">{pad(active + 1)}</span> /{" "}
            {pad(total)}
          </p>
          <div className="overflow-hidden" aria-hidden="true">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current.id}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                exit={{ y: "-60%", opacity: 0 }}
                transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
              >
                <h3 className="display mt-2 truncate text-[clamp(2rem,4.5vw,3.5rem)]">
                  <WaveText text={current.title} withStop />
                </h3>
                <p className="mt-2 max-w-[62ch] text-[14px] leading-relaxed text-ink-muted line-clamp-2">
                  {current.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => goBy(-1)}
            aria-label={t("previous_project")}
            className="flex size-12 items-center justify-center border border-line-strong transition-colors hover:border-brand-ink hover:text-brand-ink"
          >
            <Icon icon="ph:arrow-left-bold" className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => goBy(1)}
            aria-label={t("next_project")}
            className="flex size-12 items-center justify-center border border-line-strong transition-colors hover:border-brand-ink hover:text-brand-ink"
          >
            <Icon icon="ph:arrow-right-bold" className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => onOpen(active)}
            className="ml-2 inline-flex h-12 items-center gap-2 bg-brand px-5 text-sm font-semibold text-on-brand transition-[filter] hover:brightness-125"
          >
            {t("open_details")}
            <Icon icon="ph:arrow-up-right-bold" className="size-4" />
          </button>
        </div>
      </div>

      {/* ==== POSITION ==== */}
      <div className="mt-6 flex items-center gap-4">
        <div className="flex flex-1 gap-1.5">
          {projects.map((project, index) => (
            <button
              key={project.id}
              type="button"
              onClick={() => goTo(index)}
              aria-label={project.title}
              aria-current={index === active ? "true" : undefined}
              className="group flex h-6 flex-1 items-center"
            >
              <span
                className={twMerge(
                  "h-0.5 w-full transition-colors duration-300",
                  index === active
                    ? "bg-brand-ink"
                    : "bg-line-strong group-hover:bg-ink-muted",
                )}
              />
            </button>
          ))}
        </div>
        <p className="label hidden shrink-0 md:block">{t("carousel_hint")}</p>
      </div>
    </div>
  );
};

export default ProjectRing;
