"use client";
import CountUp from "@/packages/components/CountUp";
import Magnetic from "@/packages/components/Magnetic";
import ScrambleText from "@/packages/components/ScrambleText";
import SplitReveal from "@/packages/components/SplitReveal";
import {
  experiences,
  productionProjectCount,
  resumeUrl,
  socialLinks,
  techStackCategories,
} from "@/packages/database";
import { useMotionPreference } from "@/providers/Motion";
import { Icon } from "@iconify/react";
import { t } from "i18next";
import { motion, useScroll, useTransform, type Variants } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const ROLES = ["Full Stack Developer", "Software Engineer", "AI Enthusiast"];
const ROLE_INTERVAL_MS = 3200;
const BACKDROP_WORD = "ENGINEER";
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: EASE_OUT_EXPO },
  }),
};

// Derived from the data so the numbers can never drift from the content below them.
const firstStart = Math.min(
  ...experiences.map((experience) => experience.startDate.getTime()),
);
const yearsBuilding = Math.max(
  1,
  Math.floor((Date.now() - firstStart) / (365.25 * 24 * 60 * 60 * 1000)),
);
const toolCount = techStackCategories.flatMap((c) => c.techStacks).length;

const stats = [
  { value: yearsBuilding, suffix: "+", label: "stat_years" },
  { value: productionProjectCount, suffix: "+", label: "stat_projects" },
  { value: toolCount, suffix: "", label: "stat_tools" },
];

const timeFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Ho_Chi_Minh",
  hour: "2-digit",
  minute: "2-digit",
});

const useLocalTime = () => {
  const [time, setTime] = useState(() => timeFormatter.format(new Date()));
  useEffect(() => {
    const id = setInterval(
      () => setTime(timeFormatter.format(new Date())),
      20_000,
    );
    return () => clearInterval(id);
  }, []);
  return time;
};

const useRotatingRole = (enabled: boolean) => {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    const id = setInterval(
      () => setIndex((previous) => (previous + 1) % ROLES.length),
      ROLE_INTERVAL_MS,
    );
    return () => clearInterval(id);
  }, [enabled]);
  return ROLES[index];
};

const HeroSection = () => {
  const { introDone, motionEnabled } = useMotionPreference();
  const sectionRef = useRef<HTMLElement>(null);
  const role = useRotatingRole(introDone && motionEnabled);
  const localTime = useLocalTime();
  const state = introDone ? "show" : "hidden";

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  // The backdrop word sinks slower than the page, the portrait settles: two depths, one scroll.
  const backdropY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const portraitScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative flex min-h-[100svh] flex-col overflow-hidden pt-16 md:pt-[72px]"
    >
      {/* ==== BACKDROP WORD ==== */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[13%] flex justify-center select-none md:top-[9%]"
        style={{
          y: backdropY,
          maskImage: "linear-gradient(to bottom, black 30%, transparent 92%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 30%, transparent 92%)",
        }}
      >
        <div className="flex overflow-hidden">
          {BACKDROP_WORD.split("").map((letter, index) => (
            <motion.span
              key={index}
              className="font-display inline-block text-[26vw] leading-[0.82] text-brand dark:opacity-90 opacity-[0.14]"
              initial={{ y: "100%" }}
              animate={{ y: introDone ? "0%" : "100%" }}
              transition={{
                duration: 1.1,
                delay: index * 0.045,
                ease: EASE_OUT_EXPO,
              }}
            >
              {letter}
            </motion.span>
          ))}
        </div>
      </motion.div>

      <div className="shell relative z-10 grid flex-1 grid-cols-1 content-end gap-10 pb-10 pt-8 lg:grid-cols-12 lg:gap-8 lg:pb-14">
        {/* ==== NAME + PITCH ==== */}
        <div className="order-2 lg:order-1 lg:col-span-5 lg:self-end">
          <SplitReveal
            as="h1"
            text="Whittaker Tran"
            withStop
            play={introDone}
            stagger={0.08}
            className="text-[clamp(3.75rem,9vw,7.5rem)] leading-[0.86]"
          />

          <motion.p
            className="font-display mt-4 text-[clamp(1.5rem,2.6vw,2.25rem)] uppercase leading-none text-brand-ink"
            variants={fadeUp}
            custom={0.35}
            initial="hidden"
            animate={state}
            aria-live="off"
          >
            <ScrambleText text={role} trigger="change" />
          </motion.p>

          <motion.p
            className="mt-6 max-w-[36ch] text-[15px] leading-relaxed text-ink-muted md:text-base"
            variants={fadeUp}
            custom={0.45}
            initial="hidden"
            animate={state}
          >
            {t("hero_tagline")}
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap items-center gap-6"
            variants={fadeUp}
            custom={0.55}
            initial="hidden"
            animate={state}
          >
            <Magnetic strength={0.35}>
              <a
                href="#projects"
                className="group inline-flex h-12 items-center gap-3 bg-brand px-6 text-sm font-semibold text-on-brand transition-[filter] hover:brightness-125"
              >
                {t("see_my_work")}
                <Icon
                  icon="ph:arrow-down-bold"
                  className="size-4 transition-transform duration-300 group-hover:translate-y-0.5"
                />
              </a>
            </Magnetic>
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("view_cv_label")}
              className="group inline-flex h-12 items-center gap-2 border-b border-line-strong text-sm font-semibold text-ink transition-colors hover:border-brand-ink"
            >
              <Icon
                icon="ph:file-text-bold"
                className="size-4 text-brand-ink"
              />
              {t("view_cv")}
              <Icon
                icon="ph:arrow-up-right-bold"
                className="size-3.5 text-ink-muted transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
            <span className="label flex items-center gap-2">
              <Icon
                icon="ph:map-pin-bold"
                className="size-3.5 text-brand-ink"
              />
              {t("based_in")}
            </span>
          </motion.div>
        </div>

        {/* ==== PORTRAIT ==== */}
        <div className="order-1 flex justify-center lg:order-2 lg:col-span-4 lg:self-end">
          <motion.div
            className="relative aspect-[4/5] w-[min(62vw,240px)] overflow-hidden border border-line-strong bg-paper-raised md:w-[280px] lg:w-full lg:max-w-[360px]"
            initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
            animate={{
              clipPath: introDone
                ? "inset(0% 0% 0% 0%)"
                : "inset(100% 0% 0% 0%)",
            }}
            transition={{
              duration: 1.1,
              delay: 0.15,
              ease: [0.76, 0, 0.24, 1],
            }}
          >
            <motion.div
              className="absolute inset-0"
              style={{ scale: portraitScale }}
            >
              <motion.div
                className="absolute inset-0"
                initial={{ scale: 1.25 }}
                animate={{ scale: introDone ? 1 : 1.25 }}
                transition={{ duration: 1.6, delay: 0.15, ease: EASE_OUT_EXPO }}
              >
                <Image
                  src="/assets/images/avatar.jpeg"
                  alt="Illustrated portrait of Whittaker Tran"
                  fill
                  priority
                  sizes="(min-width: 1024px) 360px, 280px"
                  className="object-cover object-[57%_center]"
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* ==== AVAILABILITY + NUMBERS ==== */}
        <div className="order-3 lg:col-span-3 lg:self-end">
          <motion.p
            className="flex items-center gap-2.5 text-[13px] font-medium text-ink"
            variants={fadeUp}
            custom={0.5}
            initial="hidden"
            animate={state}
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-ink opacity-60 motion-reduce:animate-none" />
              <span className="relative inline-flex size-2 rounded-full bg-brand-ink" />
            </span>
            {t("contact_availability")}
          </motion.p>

          <dl className="mt-6 grid grid-cols-3 gap-4 lg:grid-cols-1 lg:gap-0">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="flex flex-col gap-1 border-t border-line pt-3 lg:flex-row lg:items-center lg:gap-5 lg:py-4"
                variants={fadeUp}
                custom={0.6 + index * 0.08}
                initial="hidden"
                animate={state}
              >
                <dt className="sr-only">{t(stat.label)}</dt>
                <dd className="font-display text-[clamp(2.25rem,4vw,3.25rem)] leading-none text-brand-ink lg:w-20 lg:shrink-0">
                  <CountUp
                    value={stat.value}
                    suffix={stat.suffix}
                    play={introDone}
                    delay={0.6 + index * 0.1}
                  />
                </dd>
                <dd
                  aria-hidden="true"
                  className="max-w-[18ch] text-[12px] leading-snug text-ink-muted"
                >
                  {t(stat.label)}
                </dd>
              </motion.div>
            ))}
          </dl>

          <motion.a
            href="#contact"
            className="group mt-2 hidden items-center justify-between border-t border-line pt-4 text-[13px] font-semibold lg:flex"
            variants={fadeUp}
            custom={0.85}
            initial="hidden"
            animate={state}
          >
            {t("get_in_touch")}
            <Icon
              icon="ph:arrow-up-right-bold"
              className="size-4 text-brand-ink transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </motion.a>
        </div>
      </div>

      {/* ==== BOTTOM RAIL ==== */}
      <motion.div
        className="relative z-10 border-t border-line"
        initial={{ opacity: 0 }}
        animate={{ opacity: introDone ? 1 : 0 }}
        transition={{ duration: 0.8, delay: 0.9 }}
      >
        <div className="shell flex h-14 items-center justify-between gap-4">
          <ul className="flex items-center gap-5">
            {socialLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.link}
                  target={
                    link.link.startsWith("mailto:") ? undefined : "_blank"
                  }
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[12px] font-medium text-ink-muted transition-colors hover:text-ink"
                >
                  <Icon icon={link.icon} className="size-4" />
                  <span className="hidden sm:inline">{link.name}</span>
                </a>
              </li>
            ))}
          </ul>

          <a
            href="#about"
            className="label hidden items-center gap-3 transition-colors hover:text-ink md:flex"
          >
            {t("scroll_to_discover")}
            <span className="relative h-px w-10 overflow-hidden bg-line-strong">
              <motion.span
                className="absolute inset-y-0 left-0 w-1/2 bg-brand-ink"
                animate={motionEnabled ? { x: ["-100%", "200%"] } : { x: "0%" }}
                transition={{
                  duration: 1.6,
                  repeat: motionEnabled ? Infinity : 0,
                  ease: [0.76, 0, 0.24, 1],
                }}
              />
            </span>
          </a>

          <p className="label">
            HCMC <span className="text-ink tabular-nums">{localTime}</span>{" "}
            GMT+7
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
