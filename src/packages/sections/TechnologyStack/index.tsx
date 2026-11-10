"use client";
import SectionHeading from "@/packages/components/SectionHeading";
import TechStackList from "@/packages/components/TechStackList";
import { t } from "i18next";

const TechnologyStack = () => {
  return (
    <section
      id="technology-stack"
      className="border-t border-line py-24 md:py-36"
    >
      <div className="shell">
        <SectionHeading
          title={t("technology_stack")}
          description={t("technology_stack_desc")}
        />
        <TechStackList />
      </div>
    </section>
  );
};

export default TechnologyStack;
