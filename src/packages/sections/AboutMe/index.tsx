import React from "react";
import { motion } from "motion/react";
import SectionHeader from "@/packages/components/SectionHeader";
import { t } from "i18next";
import { Trans } from "react-i18next";
import { Icon } from "@iconify/react";
const AboutMe = () => {
  const technologies = [
    "React",
    "Typescript",
    "Next.js",
    "Node.js",
    "ExpressJS",
    "AWS",
    "Docker",
    "Git",
    "TailwindCSS",
  ];
  return (
    <motion.section
      id="about"
      className="my-56"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <SectionHeader
        title={t("about_me")}
        description={t("about_me_desc")}
        showUnderline
      />

      {/* ABOUT ME CONTENT */}
      <motion.div className="mt-10 bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-xl shadow-xl p-6 backdrop-blur-xl dark:border-white/10 border border-dark-primary/10 dark:from-gray-900 dark:via-white/10 dark:to-black">
        <motion.h1 className="text-xl md:text-2xl font-black text-dark-primary dark:text-white">
          {t("about_me_title")}
        </motion.h1>
        <motion.p className="mt-2 text-sm md:text-lg font-normal text-dark-primary dark:text-white">
          <Trans
            i18nKey={"about_me_introduction"}
            components={{
              green: <strong className="text-green-primary" />,
              blue: <strong className="text-blue-primary dark:text-info" />,
            }}
          />
        </motion.p>
        <div className="h-[0.5px] md:h-[1px] w-full bg-gray-200 my-4 md:my-6"></div>
        <p className="text-xs md:text-base font-normal text-gray-700 dark:text-white/80">
          {t("about_me_skills")}
        </p>
        <p className="mt-3 text-xs md:text-base font-normal text-gray-700 dark:text-white/80">
          {t("about_me_more_introduction")}
        </p>

        <div className="h-[0.5px] md:h-[1px] w-full bg-gray-200 my-4 md:my-6"></div>

        {/* ==== CORE TECHNOLOGIES ==== */}
        <div>
          <div className="flex items-center justify-start gap-2">
            <Icon icon="skill-icons:javascript" className="size-4 md:size-5" />
            <p className="text-xs md:text-sm font-medium text-dark-primary dark:text-white">
              {t("core_technologies")}
            </p>
          </div>

          {/* ==== TECHNOLOGIES ==== */}
          <div className="mt-3 flex flex-wrap gap-2.5">
            {technologies.map((tech, index) => (
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{
                  scale: 1.1,
                  transition: { duration: 0.2, delay: 0 },
                }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                key={index}
                className="text-xs md:text-sm font-medium rounded-md md:rounded-lg px-4 py-1 shadow-sm border border-gray-200 text-dark-primary hover:shadow-lg transition-all duration-300 ease-in-out cursor-pointer hover:border-green-primary hover:bg-green-primary hover:text-white dark:text-white"
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default AboutMe;
