"use client";
import { playTransformSound } from "@/packages/sound";
import { useMotionPreference } from "@/providers/Motion";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

// The figure is cut along a LATTICE_COLS-wide lattice whose inner points are pushed off-grid,
// so the cells become irregular quads; some are split again into triangles.
const LATTICE_COLS = 6;
// How far an inner lattice point may wander, as a share of a cell.
const LATTICE_JITTER = 0.38;
// Chance that a quad is split into two triangles along a random diagonal.
const SPLIT_CHANCE = 0.6;
// The top share of the picture is the head. Its shards land last, as one final snap.
const HEAD_SHARE = 0.36;
// Body shards start over this many seconds, the lowest first.
const BODY_SPREAD = 0.45;
const BODY_JITTER = 0.25;
// The beat between the body locking and the head snapping in.
const HEAD_PAUSE = 0.1;
const HEAD_JITTER = 0.08;
// How long one shard flies; it overshoots a touch and snaps back as it lands.
const FLIGHT = 0.7;
// Share of the flight after which a shard has landed: its snap sound fires here.
const LANDING = 0.8;
// Shards start this far from their place, in viewport widths.
const MIN_DISTANCE = 22;
const MAX_DISTANCE = 42;
// How many landings get a snap sound: enough for a rapid run of clicks, few enough to
// stay distinct rather than turning into noise.
const SNAP_SOUNDS = 18;
const EASE_OUT_QUINT = [0.22, 1, 0.36, 1] as const;

// In flight a shard is a blueprint-blue hologram of its slice; it flashes white as it snaps
// in and settles into the real colours. Each filter lists the same functions so they
// interpolate. The hue swing from blue back to normal is squeezed into about one frame just
// before landing: tweened any slower, it passes visibly through pink and green.
const HOLOGRAM = "sepia(1) hue-rotate(185deg) saturate(5) brightness(1)";
const HOLOGRAM_HOT = "sepia(1) hue-rotate(185deg) saturate(5) brightness(1.4)";
const SNAP_FLASH = "sepia(0) hue-rotate(0deg) saturate(0) brightness(2.4)";
const SETTLED = "sepia(0) hue-rotate(0deg) saturate(1) brightness(1)";
// Where in the flight each of those four filters is reached.
const FILTER_TIMES = [0, LANDING - 0.025, LANDING, 1];

/** A vertical fade as [position %, opacity] stops, top to bottom. */
export type FadeStops = readonly (readonly [number, number])[];

type Point = readonly [number, number];
type Shard = {
  id: number;
  /** Corners in the figure's 0..1 space. */
  points: Point[];
  /** Bounding box in the figure's 0..1 space. */
  box: { x: number; y: number; w: number; h: number };
  centre: Point;
  delay: number;
  isHead: boolean;
};
type Phase = "waiting" | "assembling" | "done";

/** Stable pseudo-random in [0, 1) per seed: the same on every render of the same run. */
const random = (seed: number) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

const fadeToCss = (stops: FadeStops) =>
  `linear-gradient(to bottom, ${stops
    .map(([position, alpha]) => `rgb(0 0 0 / ${alpha}) ${position}%`)
    .join(", ")})`;

/** Opacity of the fade at a height, so shards can match the mask the final image wears. */
const fadeAt = (stops: FadeStops, position: number) => {
  if (position <= stops[0][0]) return stops[0][1];
  for (let i = 1; i < stops.length; i++) {
    const [p1, a1] = stops[i];
    if (position <= p1) {
      const [p0, a0] = stops[i - 1];
      return a0 + ((a1 - a0) * (position - p0)) / (p1 - p0);
    }
  }
  return stops[stops.length - 1][1];
};

const insidePolygon = ([x, y]: Point, points: Point[]) => {
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const [xi, yi] = points[i];
    const [xj, yj] = points[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
};

/**
 * Shatters the figure: a jittered lattice gives irregular quads, some split into triangles,
 * so the pieces tile the picture exactly. Pieces that only cover transparent background are
 * dropped by sampling the picture's alpha inside each one.
 */
const shatter = (image: HTMLImageElement, aspect: number): Shard[] => {
  const latticeRows = Math.round(LATTICE_COLS * aspect);
  const SIZE = 120;
  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = Math.round(SIZE * aspect);
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return [];
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
  const opaqueAt = ([x, y]: Point) => {
    const px = Math.min(canvas.width - 1, Math.floor(x * canvas.width));
    const py = Math.min(canvas.height - 1, Math.floor(y * canvas.height));
    return data[(py * canvas.width + px) * 4 + 3] > 32;
  };

  // Lattice points; the outer ring stays on the edges so the pieces fill the whole frame.
  const point = (i: number, j: number): Point => {
    const seed = j * 97 + i;
    const dx =
      i === 0 || i === LATTICE_COLS
        ? 0
        : (random(seed) - 0.5) * 2 * LATTICE_JITTER;
    const dy =
      j === 0 || j === latticeRows
        ? 0
        : (random(seed + 7) - 0.5) * 2 * LATTICE_JITTER;
    return [(i + dx) / LATTICE_COLS, (j + dy) / latticeRows];
  };

  const polygons: Point[][] = [];
  for (let j = 0; j < latticeRows; j++) {
    for (let i = 0; i < LATTICE_COLS; i++) {
      const a = point(i, j);
      const b = point(i + 1, j);
      const c = point(i + 1, j + 1);
      const d = point(i, j + 1);
      const seed = j * LATTICE_COLS + i;
      if (random(seed + 13) < SPLIT_CHANCE) {
        if (random(seed + 17) < 0.5) polygons.push([a, b, c], [a, c, d]);
        else polygons.push([a, b, d], [b, c, d]);
      } else {
        polygons.push([a, b, c, d]);
      }
    }
  }

  const shards: Shard[] = [];
  polygons.forEach((points, id) => {
    const xs = points.map(([x]) => x);
    const ys = points.map(([, y]) => y);
    const box = {
      x: Math.min(...xs),
      y: Math.min(...ys),
      w: Math.max(...xs) - Math.min(...xs),
      h: Math.max(...ys) - Math.min(...ys),
    };
    let covered = false;
    for (let sy = 0; sy < 6 && !covered; sy++) {
      for (let sx = 0; sx < 6 && !covered; sx++) {
        const sample: Point = [
          box.x + ((sx + 0.5) / 6) * box.w,
          box.y + ((sy + 0.5) / 6) * box.h,
        ];
        covered = insidePolygon(sample, points) && opaqueAt(sample);
      }
    }
    if (!covered) return;
    const centre: Point = [
      xs.reduce((sum, x) => sum + x, 0) / xs.length,
      ys.reduce((sum, y) => sum + y, 0) / ys.length,
    ];
    shards.push({
      id,
      points,
      box,
      centre,
      delay: 0,
      isHead: centre[1] < HEAD_SHARE,
    });
  });

  const bodyEnd = BODY_SPREAD + BODY_JITTER;
  for (const shard of shards) {
    shard.delay = shard.isHead
      ? bodyEnd + HEAD_PAUSE + random(shard.id + 31) * HEAD_JITTER
      : ((1 - shard.centre[1]) / (1 - HEAD_SHARE)) * BODY_SPREAD +
        random(shard.id + 31) * BODY_JITTER;
  }
  return shards;
};

/** Where a shard starts: anywhere around its slot, spun and tilted, reseeded per run. */
const launchPose = (shard: Shard, run: number) => {
  const seed = shard.id * 7 + run * 131;
  const angle = random(seed) * Math.PI * 2;
  const distance =
    MIN_DISTANCE + random(seed + 1) * (MAX_DISTANCE - MIN_DISTANCE);
  return {
    x: `${Math.cos(angle) * distance}vw`,
    y: `${Math.sin(angle) * distance}vw`,
    rotate: (random(seed + 2) - 0.5) * 360,
    rotateX: (random(seed + 3) - 0.5) * 120,
    rotateY: (random(seed + 4) - 0.5) * 120,
    scale: 0.6,
  };
};

type Props = {
  src: string;
  alt: string;
  /** The picture's pixel size; the component fills its parent, which must share this ratio. */
  intrinsicWidth: number;
  intrinsicHeight: number;
  sizes: string;
  /** Starts the first assembly, which is silent: browsers block sound until a click. */
  play: boolean;
  /** Accessible name for the figure, which replays the assembly with sound when pressed. */
  replayLabel: string;
  /**
   * Fades the picture out toward the bottom. Applied here rather than as a mask on a parent,
   * because a mask clips to its element's box and would hide shards flying in from outside.
   */
  fade?: FadeStops;
};

/**
 * Builds the figure out of flying shards: the picture is broken into irregular triangles
 * and quads that fly in from every side as blue holograms of their slice, snap into place
 * with a flash, and settle into the real colours, the body first and the head last. Once
 * every shard has landed, the real image takes over, so the resting state is a normal,
 * crisp <Image>. Pressing the figure builds it again with the snap sound, since a click is
 * the gesture browsers require before playing audio.
 */
const AssembleFigure = ({
  src,
  alt,
  intrinsicWidth,
  intrinsicHeight,
  sizes,
  play,
  replayLabel,
  fade,
}: Props) => {
  const { motionEnabled } = useMotionPreference();
  const aspect = intrinsicHeight / intrinsicWidth;
  const [shards, setShards] = useState<Shard[] | null>(null);
  const [phase, setPhase] = useState<Phase>("waiting");
  // Bumped by each replay; keys the shard layer and reseeds every flight path.
  const [run, setRun] = useState(0);

  useEffect(() => {
    const image = new window.Image();
    image.src = src;
    image.onload = () => setShards(shatter(image, aspect));
    // Without the alpha map there is nothing to assemble; the picture simply appears.
    image.onerror = () => setShards([]);
  }, [src, aspect]);

  const totalSeconds = useMemo(() => {
    if (!shards?.length) return 0;
    return Math.max(...shards.map((shard) => shard.delay)) + FLIGHT;
  }, [shards]);

  /** Landing times for the sound: a spread of snaps, then the last one as the seal. */
  const impacts = useMemo(() => {
    if (!shards?.length) return { body: [], seal: 0 };
    const landings = shards
      .map((shard) => shard.delay + FLIGHT * LANDING)
      .sort((a, b) => a - b);
    const seal = landings[landings.length - 1];
    const rest = landings.slice(0, -1);
    const picks = Math.min(SNAP_SOUNDS, rest.length);
    const step = picks > 1 ? (rest.length - 1) / (picks - 1) : 0;
    return {
      body: Array.from({ length: picks }, (_, i) => rest[Math.round(i * step)]),
      seal,
    };
  }, [shards]);

  useEffect(() => {
    if (!play || shards === null) return;
    if (!motionEnabled || shards.length === 0) {
      setPhase("done");
      return;
    }
    setPhase("assembling");
    const timer = setTimeout(() => setPhase("done"), totalSeconds * 1000);
    return () => clearTimeout(timer);
  }, [play, run, shards, motionEnabled, totalSeconds]);

  const canReplay = motionEnabled && phase === "done" && !!shards?.length;

  const replay = () => {
    if (!canReplay) return;
    playTransformSound({ duration: totalSeconds, ...impacts });
    setRun((previous) => previous + 1);
  };

  const fadeMask = fade ? fadeToCss(fade) : undefined;

  return (
    <div className="absolute inset-0">
      <motion.div
        className="absolute inset-0"
        style={{ maskImage: fadeMask, WebkitMaskImage: fadeMask }}
        initial={false}
        animate={{ opacity: phase === "done" ? 1 : 0 }}
        transition={{ duration: phase === "done" ? 0.2 : 0 }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes={sizes}
          className="object-contain object-bottom"
        />
      </motion.div>

      {/* Mounted only while building, so the resting page carries no hidden shard layer. */}
      <AnimatePresence>
        {phase === "assembling" && shards && (
          <motion.div
            key={run}
            aria-hidden
            className="pointer-events-none absolute inset-0 [perspective:900px]"
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
          >
            {shards.map((shard) => {
              const { box, points, centre } = shard;
              // Corners and pivot relative to the shard's own box, which keeps each layer small.
              const clip = points
                .map(
                  ([x, y]) =>
                    `${((x - box.x) / box.w) * 100}% ${((y - box.y) / box.h) * 100}%`,
                )
                .join(", ");
              return (
                <motion.div
                  key={shard.id}
                  className="absolute"
                  style={{
                    left: `${box.x * 100}%`,
                    top: `${box.y * 100}%`,
                    width: `${box.w * 100}%`,
                    height: `${box.h * 100}%`,
                    clipPath: `polygon(${clip})`,
                    transformOrigin: `${((centre[0] - box.x) / box.w) * 100}% ${((centre[1] - box.y) / box.h) * 100}%`,
                  }}
                  initial={{
                    opacity: 0,
                    filter: HOLOGRAM,
                    ...launchPose(shard, run),
                  }}
                  animate={{
                    opacity: fade ? fadeAt(fade, centre[1] * 100) : 1,
                    x: "0vw",
                    y: "0vw",
                    rotate: 0,
                    rotateX: 0,
                    rotateY: 0,
                    // The overshoot and the flash at LANDING are the snap.
                    scale: [0.6, 1.06, 1],
                    filter: [HOLOGRAM, HOLOGRAM_HOT, SNAP_FLASH, SETTLED],
                  }}
                  transition={{
                    duration: FLIGHT,
                    delay: shard.delay,
                    ease: EASE_OUT_QUINT,
                    scale: {
                      duration: FLIGHT,
                      delay: shard.delay,
                      times: [0, LANDING, 1],
                    },
                    filter: {
                      duration: FLIGHT,
                      delay: shard.delay,
                      times: FILTER_TIMES,
                    },
                    opacity: { duration: 0.2, delay: shard.delay },
                  }}
                >
                  {/* The whole picture, offset so this shard's box shows its own slice. */}
                  <div
                    className="absolute bg-no-repeat"
                    style={{
                      left: `${(-box.x / box.w) * 100}%`,
                      top: `${(-box.y / box.h) * 100}%`,
                      width: `${100 / box.w}%`,
                      height: `${100 / box.h}%`,
                      backgroundImage: `url(${src})`,
                      backgroundSize: "100% 100%",
                    }}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* A separate overlay rather than a wrapper: a <button> may only hold phrasing content. */}
      <button
        type="button"
        onClick={replay}
        aria-label={replayLabel}
        aria-disabled={!canReplay}
        data-cursor-label={canReplay ? "Transform" : undefined}
        className="absolute inset-0 cursor-pointer aria-disabled:cursor-default"
      />
    </div>
  );
};

export default AssembleFigure;
