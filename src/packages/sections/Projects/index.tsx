import React from "react";
import { motion } from "motion/react";
import { SectionHeader } from "@/packages/components";
import { t } from "i18next";

const Projects = () => {
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
        title={t("feature_projects")}
        description={t("projects_desc")}
        showUnderline
      />

      <div className="mt-20"></div>
    </motion.section>
  );
};

export default Projects;
