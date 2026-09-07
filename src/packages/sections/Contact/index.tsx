"use client";
import React from "react";
import { t } from "i18next";
import { motion } from "motion/react";

import { SectionHeader } from "@/packages/components";
import { SplitNames } from "@/packages/constants";
import { useFeatureSplit } from "@/packages/hooks";

import ContactForm from "./ContactForm";
import ContactInfo from "./ContactInfo";

const Contact = () => {
  const { isTreatmentActive } = useFeatureSplit(SplitNames.CONTACT_SECTION);

  return (
    <motion.section
      id="contact"
      className="mb-56"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <SectionHeader
        title={t("contact")}
        description={t("contact_desc")}
        showUnderline
      />

      {!isTreatmentActive ? (
        <div className="text-center font-boldonse text-3xl font-bold mt-10 text-green-primary">
          {t("coming_soon")}
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-6 items-start">
          <ContactInfo />
          <ContactForm />
        </div>
      )}
    </motion.section>
  );
};

export default Contact;
