"use client";
import React from "react";
import { IExperience } from "@/packages/database";
import Image from "next/image";
import { motion } from "motion/react";
import { Icon } from "@iconify/react";
import dayjs from "dayjs";
import { t } from "i18next";
const ExperienceItem = ({ experience }: { experience: IExperience }) => {
  return (
    <div className="flex items-start justify-center md:justify-start gap-6 flex-col md:flex-row">
      <div className="flex items-center justify-center md:justify-start gap-6 flex-col md:flex-row w-full md:w-fit">
        {/* ===== LOGO ==== */}
        <motion.div
          initial={{ scale: 0, rotate: 360 }}
          whileInView={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="size-16 bg-green-primary flex items-center justify-center rounded-xl shadow-2xl"
        >
          <div className="flex items-center justify-center size-8 bg-white">
            <motion.div className="size-6 relative rounded-full">
              <Image src={experience.logo} alt="logo-nus" fill />
            </motion.div>
          </div>
        </motion.div>
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="w-14 bg-green-600 h-[2px] relative"
        >
          <div className="size-2.5 bg-green-600 rounded-full absolute left-0 top-1/2 -translate-y-1/2"></div>
          <div className="size-2.5 bg-green-600 rounded-full absolute right-0 top-1/2 -translate-y-1/2"></div>
        </motion.div>
      </div>

      {/* ===== DESCRIPTION ==== */}
      <div className="flex flex-col items-start justify-start gap-2 flex-1 px-4 md:px-0">
        <div className="">
          {/* ==== START & END DATE ==== */}
          <motion.div className="flex items-center justify-start gap-2 mb-4">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <Icon
                icon="cuida:calendar-outline"
                className="size-5 text-dark-primary dark:text-white"
              />
            </motion.div>
            <motion.p
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeInOut", delay: 0.2 }}
              className="text-sm font-medium text-gray-700 dark:text-white"
            >
              {dayjs(experience.startDate).format("MMMM YYYY")} -{" "}
              {experience.endDate
                ? dayjs(experience.endDate).format("MMMM YYYY")
                : t("present")}
            </motion.p>
          </motion.div>

          {/* ==== TITLE & COMPANY ==== */}
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut", delay: 0.2 }}
            className="text-lg font-bold font-boldonse text-green-primary mb-2.5"
          >
            {experience.title}
          </motion.h1>
          <motion.p
            initial={{ x: 20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeInOut", delay: 0.4 }}
            className="text-base font-black text-blue-primary dark:text-blue-secondary uppercase"
          >
            {experience.company}
          </motion.p>

          <motion.p
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut", delay: 0.4 }}
            className="mt-4 text-sm md:text-base font-medium text-gray-700 leading-[25px] dark:text-white"
          >
            {experience.description}
          </motion.p>

          {/* ==== ACHIEVEMENTS ==== */}
          <div className="mt-8">
            <motion.div className="flex items-center justify-start gap-2 mb-4">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <Icon
                  icon="solar:cup-star-bold"
                  className="size-6 text-yellow-cup"
                />
              </motion.div>
              <motion.p
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeInOut", delay: 0.2 }}
                className="text-base font-semibold text-gray-700 dark:text-white"
              >
                {t("key_achievements")}
              </motion.p>
            </motion.div>
            <div className="space-y-2.5">
              {experience.achievements.map((achievement, index) => (
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{
                    duration: 0.3,
                    ease: "easeInOut",
                    delay: 0.2 + index * 0.1,
                  }}
                  className="flex items-start justify-start gap-2"
                  key={index}
                >
                  <div className="size-5 bg-green-primary rounded-full flex items-center justify-center">
                    <div className="size-2 bg-white rounded-full"></div>
                  </div>
                  <motion.p
                    whileHover={{
                      scale: 1.1,
                      x: 30,
                      transition: { duration: 0.4 },
                    }}
                    className="text-sm md:text-base italic font-medium text-gray-700 flex-1 dark:text-white cursor-pointer"
                  >
                    {achievement}
                  </motion.p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ==== TECH SKILLS ==== */}
          <div className="mt-6">
            <motion.div className="flex items-center justify-start gap-2 mb-4">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <Icon
                  icon="mynaui:terminal-solid"
                  className="size-6 text-dark-primary dark:text-green-primary"
                />
              </motion.div>
              <motion.p
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeInOut", delay: 0.2 }}
                className="text-base font-semibold text-gray-700 dark:text-white"
              >
                {t("technologies_skills")}
              </motion.p>
            </motion.div>
            <div className="flex items-center justify-start gap-2 flex-wrap">
              {experience.techSkills.map((achievement, index) => (
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: 0.3,
                    ease: "easeInOut",
                    delay: 0.2 + index * 0.1,
                  }}
                  key={index}
                  className="cursor-pointer"
                >
                  <p className="text-xs md:text-sm py-2 px-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 flex-1 dark:text-white shadow-sm hover:border-blue-secondary">
                    {achievement}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceItem;
