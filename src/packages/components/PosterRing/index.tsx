"use client";
import { IDesignWork } from "@/packages/database";
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

// The ring needs enough positions to read as a closed curve around the viewer, so a
// short list is repeated until it has at least this many.
const MIN_SLOTS = 10;
// Gap between neighbours, as a share of a poster's width.
const NEIGHBOUR_SPACING = 1.12;
// How far the ring centre is pulled toward the viewer, in radii. Above 0 puts the
// camera inside the circle, which is what makes the curve read as concave.
const CENTRE_PULL = 0.62;
// Camera distance in radii. Must stay above CENTRE_PULL or the camera leaves the ring.
const PERSPECTIVE = 1.15;
// Past this angle a poster would swing beside or behind the viewer, so it fades out.
const FADE_START = 0.42;
const FADE_END = 0.2;
const AUTOPLAY_MS = 3800;
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

const pad = (value: number) => String(value).padStart(2, "0");

type PosterCardProps = {
  work: IDesignWork;
  slot: number;
  step: number;
  radius: number;
  width: number;
  rotation: MotionValue<number>;
  isActive: boolean;
  onSelect: (slot: number) => void;
};

const PosterCard = ({
  work,
  slot,
  step,
  radius,
  width,
  rotation,
  isActive,
  onSelect,
}: PosterCardProps) => {
  const facing = useTransform(rotation, (value) =>
    Math.cos(((slot * step + value) * Math.PI) / 180),
  );
  const opacity = useTransform(facing, (value) =>
    Math.min(1, Math.max(0, (value - FADE_END) / (FADE_START - FADE_END))),
  );
  const pointerEvents = useTransform(opacity, (value) =>
    value > 0.5 ? "auto" : "none",
  );
  // The centre poster sits furthest away; dimming the closer side ones keeps it the focus.
  const filter = useTransform(
    facing,
    (value) =>
      `brightness(${(0.55 + 0.45 * Math.max(0, value) ** 3).toFixed(3)})`,
  );

  return (
    <div
      className="absolute left-1/2 top-1/2"
      style={{
        width,
        marginLeft: -width / 2,
        marginTop: (-width * 1.25) / 2,
        // Facing inward: each poster turns to look at the ring's centre.
        transform: `rotateY(${-slot * step}deg) translateZ(${-radius}px)`,
      }}
    >
      <motion.button
        type="button"
        onClick={() => onSelect(slot)}
        tabIndex={isActive ? 0 : -1}
        aria-label={
          isActive ? t("view_poster", { title: work.title }) : work.title
        }
        data-cursor-label={isActive ? "View" : undefined}
        style={{ opacity, filter, pointerEvents }}
        className={twMerge(
          "group relative block aspect-[4/5] w-full overflow-hidden border bg-paper-raised transition-[border-color] duration-500",
          isActive ? "border-brand-ink" : "border-line-strong",
        )}
      >
        <Image
          src={work.image}
          alt=""
          fill
          draggable={false}
          sizes="(min-width: 768px) 280px, 45vw"
          className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
        />
      </motion.button>
    </div>
  );
};

type Props = {
  works: IDesignWork[];
  onOpen: (index: number) => void;
};

/**
 * Posters on the inside of a ring, as if the viewer stands in a round gallery: the
 * centre piece is furthest away and the neighbours curve in toward the viewer.
 */
const PosterRing = ({ works, onOpen }: Props) => {
  const count = works.length;
  const copies = Math.max(1, Math.ceil(MIN_SLOTS / count));
  const slots = count * copies;

  const stageRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(210);
  const [isPaused, setIsPaused] = useState(false);
  const {
    rotation,
    step,
    activeSlot,
    goToSlot,
    goBy,
    isClickAllowed,
    stageHandlers,
  } = useRingRotation({ slots, stageRef, autoplayMs: AUTOPLAY_MS, isPaused });
  const active = activeSlot % count;
  // The container turns the opposite way so slot i ends up to the right of slot i - 1.
  const ringRotation = useTransform(rotation, (value) => -value);

  // Radius at which neighbouring posters sit NEIGHBOUR_SPACING widths apart.
  const radius = Math.round(
    (width * NEIGHBOUR_SPACING) / (2 * Math.sin(Math.PI / slots)),
  );
  const posterHeight = width * 1.25;

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new ResizeObserver(([entry]) => {
      const stageWidth = entry.contentRect.width;
      const share = stageWidth < 768 ? 0.4 : 0.15;
      setWidth(Math.round(Math.min(230, Math.max(140, stageWidth * share))));
    });
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  /** Nearest slot showing a given poster, so a dot click never spins the long way. */
  const goToWork = (index: number) => {
    let best = index;
    let bestDistance = Infinity;
    for (let copy = 0; copy < copies; copy++) {
      const slot = index + copy * count;
      const raw = Math.abs(slot - activeSlot);
      const distance = Math.min(raw, slots - raw);
      if (distance < bestDistance) {
        best = slot;
        bestDistance = distance;
      }
    }
    goToSlot(best);
  };

  const handleSelect = (slot: number) => {
    if (!isClickAllowed()) return;
    if (slot === activeSlot) onOpen(slot % count);
    else goToSlot(slot);
  };

  const current = works[active];

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={t("poster_carousel_label")}
      onPointerEnter={() => setIsPaused(true)}
      onPointerLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div
        ref={stageRef}
        tabIndex={0}
        {...stageHandlers}
        data-cursor-label="Drag"
        // Clip sideways only: the nearest posters reach past the edges on narrow screens.
        className="relative cursor-grab touch-pan-y select-none overflow-x-clip outline-none active:cursor-grabbing"
        style={{
          // The nearest posters render up to ~1.4x their size on narrow screens (measured), so
          // the stage leaves room for that instead of cropping them.
          height: posterHeight * 1.3 + 40,
          perspective: radius * PERSPECTIVE,
        }}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            transformStyle: "preserve-3d",
            z: radius * CENTRE_PULL,
            rotateY: ringRotation,
          }}
        >
          {Array.from({ length: slots }, (_, slot) => (
            <PosterCard
              key={slot}
              work={works[slot % count]}
              slot={slot}
              step={step}
              radius={radius}
              width={width}
              rotation={rotation}
              isActive={slot === activeSlot}
              onSelect={handleSelect}
            />
          ))}
        </motion.div>
      </div>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-line pt-5">
        <div className="min-w-0" aria-live="polite">
          <p className="font-mono text-[12px] tracking-[0.12em] text-ink-muted tabular-nums">
            <span className="text-brand-ink">{pad(active + 1)}</span> /{" "}
            {pad(count)}
          </p>
          <div className="overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current.image}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                exit={{ y: "-60%", opacity: 0 }}
                transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
              >
                <p className="mt-1 text-[17px] font-semibold uppercase text-ink">
                  {current.title}
                </p>
                <p className="label">{current.kind}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => goBy(-1)}
            aria-label={t("previous_poster")}
            className="flex size-11 items-center justify-center border border-line-strong transition-colors hover:border-brand-ink hover:text-brand-ink"
          >
            <Icon icon="ph:arrow-left-bold" className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => goBy(1)}
            aria-label={t("next_poster")}
            className="flex size-11 items-center justify-center border border-line-strong transition-colors hover:border-brand-ink hover:text-brand-ink"
          >
            <Icon icon="ph:arrow-right-bold" className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => onOpen(active)}
            className="ml-1 inline-flex h-11 items-center gap-2 bg-brand px-4 text-sm font-semibold text-on-brand transition-[filter] hover:brightness-125"
          >
            <Icon icon="ph:arrows-out-simple-bold" className="size-4" />
            {t("view")}
          </button>
        </div>
      </div>

      <div className="mt-4 flex gap-1.5">
        {works.map((work, index) => (
          <button
            key={work.image}
            type="button"
            onClick={() => goToWork(index)}
            aria-label={work.title}
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
    </div>
  );
};

export default PosterRing;
