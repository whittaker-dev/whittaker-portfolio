import { SectionHeader } from "@/packages/components";
import React from "react";
import { motion } from "motion/react";
import { t } from "i18next";
import { experiences } from "@/packages/database";
import ExperienceItem from "@/packages/components/ExperienceItem";
const ExperienceSection = () => {
  return (
    <motion.section
      id="experience"
      className="my-56"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <SectionHeader
        title={t("experience")}
        description={t("about_me_desc")}
        showUnderline
      />

      <div className="mt-20">
        {experiences.map((experience) => (
          <ExperienceItem key={experience.id} experience={experience} />
        ))}
      </div>
    </motion.section>
  );
};

export default ExperienceSection;
