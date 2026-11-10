"use client";
import SectionHeading from "@/packages/components/SectionHeading";
import { t } from "i18next";
import { motion } from "motion/react";
import { Trans } from "react-i18next";

const CORE_TECHNOLOGIES = [
  "Node.js",
  "TypeScript",
  "NestJS",
  "React",
  "Next.js",
  "React Native",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "Docker",
  "AWS",
];

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

const AboutMe = () => {
  return (
    <section id="about" className="py-24 md:py-36">
      <div className="shell">
        <SectionHeading
          title={t("about_me")}
          description={t("about_me_desc")}
        />

        <div className="mt-14 grid grid-cols-1 gap-12 border-t border-line pt-10 md:mt-20 md:grid-cols-12 md:gap-10">
          {/* ==== CORE TECHNOLOGIES ==== */}
          <aside className="md:col-span-4 lg:col-span-3">
            <div className="md:sticky md:top-28">
              <h3 className="text-[15px] font-semibold text-ink">
                {t("about_me_title")}
              </h3>
              <h4 className="label mt-8">{t("core_technologies")}</h4>
              <ul className="mt-4 flex flex-wrap gap-2">
                {CORE_TECHNOLOGIES.map((tech, index) => (
                  <motion.li
                    key={tech}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      delay: Math.min(index * 0.04, 0.3),
                      ease: EASE_OUT_EXPO,
                    }}
                    className="border border-line px-3 py-1.5 text-[13px] font-medium text-ink transition-colors hover:border-brand-ink hover:text-brand-ink"
                  >
                    {tech}
                  </motion.li>
                ))}
              </ul>
            </div>
          </aside>

          {/* ==== STATEMENT ==== */}
          <div className="md:col-span-8 lg:col-span-8 lg:col-start-5">
            <motion.p
              className="text-[clamp(1.5rem,2.8vw,2.375rem)] font-medium leading-[1.25] tracking-[-0.015em] text-ink text-pretty"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.9, ease: EASE_OUT_EXPO }}
            >
              <Trans
                i18nKey="about_me_introduction"
                components={{
                  green: <strong className="font-semibold text-brand-ink" />,
                  blue: <strong className="font-semibold text-brand-ink" />,
                }}
              />
            </motion.p>

            <div className="mt-12 grid gap-8 text-[15px] leading-relaxed text-ink-muted md:grid-cols-2 md:gap-10">
              <p className="max-w-[60ch]">{t("about_me_skills")}</p>
              <p className="max-w-[60ch]">{t("about_me_more_introduction")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
