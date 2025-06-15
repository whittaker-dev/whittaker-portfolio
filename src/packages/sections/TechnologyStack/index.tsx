import React from "react";
import { motion } from "motion/react";
import { t } from "i18next";
import { SectionHeader } from "@/packages/components";
import { TechStackList } from "@/packages/components";

const TechnologyStack = () => {
  return (
    <motion.section
      id="technology-stack"
      className="my-56"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <SectionHeader
        title={t("technology_stack")}
        description={t("technology_stack_desc")}
        showUnderline
      />

      <TechStackList />
    </motion.section>
  );
};

export default TechnologyStack;
