"use client";
import ExperienceItem from "@/packages/components/ExperienceItem";
import SectionHeading from "@/packages/components/SectionHeading";
import { experiences } from "@/packages/database";
import { t } from "i18next";

const ExperienceSection = () => {
  return (
    <section id="experience" className="border-t border-line py-24 md:py-36">
      <div className="shell">
        <SectionHeading
          title={t("experience")}
          description={t("experience_desc")}
        />
        <div className="mt-14 space-y-16 md:mt-20">
          {experiences.map((experience) => (
            <ExperienceItem key={experience.id} experience={experience} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
