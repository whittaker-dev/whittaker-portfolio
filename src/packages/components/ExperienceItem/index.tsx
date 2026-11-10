"use client";
import { IExperience } from "@/packages/database";
import dayjs from "dayjs";
import { t } from "i18next";
import { motion, useScroll, useSpring } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import WaveText from "../WaveText";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

const ExperienceItem = ({ experience }: { experience: IExperience }) => {
  const ref = useRef<HTMLElement>(null);
  // The rail fills as the role is read: it ties the scroll to "how far through this job" you are.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "end 60%"],
  });
  const railScale = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });

  const start = dayjs(experience.startDate).format("MMM YYYY");
  const end = experience.endDate
    ? dayjs(experience.endDate).format("MMM YYYY")
    : t("present");

  return (
    <article
      ref={ref}
      className="grid grid-cols-1 gap-8 border-t border-line-strong pt-8 md:grid-cols-12 md:gap-10"
    >
      {/* ==== WHEN + WHERE ==== */}
      <div className="md:col-span-4 lg:col-span-3">
        <div className="md:sticky md:top-28">
          <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-brand-ink">
            <time dateTime={dayjs(experience.startDate).format("YYYY-MM")}>
              {start}
            </time>{" "}
            — {end}
          </p>
          <div className="mt-6 flex items-center gap-3">
            <span className="relative flex size-12 shrink-0 items-center justify-center border border-line bg-white">
              <Image
                src={experience.logo}
                alt=""
                width={28}
                height={28}
                className="object-contain"
              />
            </span>
            <span>
              <span className="block text-[15px] font-semibold text-ink">
                {experience.company}
              </span>
              <span className="block text-[13px] text-ink-muted">
                {experience.location}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* ==== ROLE ==== */}
      <div className="relative md:col-span-8 md:pl-10 lg:col-span-9">
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-0 hidden w-px bg-line md:block"
        >
          <motion.span
            className="absolute inset-0 origin-top bg-brand-ink"
            style={{ scaleY: railScale }}
          />
        </span>

        <h3 className="display text-[clamp(2.25rem,4.5vw,3.5rem)]">
          <WaveText text={experience.title} />
        </h3>
        <p className="mt-5 max-w-[65ch] text-[15px] leading-relaxed text-ink-muted md:text-base">
          {experience.description}
        </p>

        <h4 className="label mt-12">{t("key_achievements")}</h4>
        <ul className="mt-3">
          {experience.achievements.map((achievement, index) => (
            <motion.li
              key={achievement}
              className="flex items-start gap-4 border-b border-line py-4 text-[15px] text-ink md:text-base"
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-5% 0px" }}
              transition={{
                duration: 0.55,
                delay: Math.min(index * 0.06, 0.3),
                ease: EASE_OUT_EXPO,
              }}
            >
              <span
                aria-hidden="true"
                className="mt-[0.55em] size-1.5 shrink-0 bg-brand-ink"
              />
              {achievement}
            </motion.li>
          ))}
        </ul>

        <h4 className="label mt-12">{t("technologies_skills")}</h4>
        <ul className="mt-4 flex flex-wrap gap-2">
          {experience.techSkills.map((skill) => (
            <li
              key={skill}
              className="border border-line px-3 py-1.5 text-[13px] font-medium text-ink-muted transition-colors hover:border-brand-ink hover:text-ink"
            >
              {skill}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
};

export default ExperienceItem;
