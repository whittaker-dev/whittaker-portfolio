"use client";
import SplitReveal from "@/packages/components/SplitReveal";
import { t } from "i18next";
import ContactForm from "./ContactForm";
import ContactInfo from "./ContactInfo";

const Contact = () => {
  return (
    <section id="contact" className="border-t border-line py-24 md:py-36">
      <div className="shell">
        <SplitReveal
          text={t("contact_heading")}
          withStop
          className="max-w-[12ch] text-[clamp(3.5rem,11vw,9rem)] leading-[0.85]"
        />
        <p className="mt-6 max-w-[48ch] whitespace-pre-line text-[15px] leading-relaxed text-ink-muted md:text-base">
          {t("contact_desc")}
        </p>

        <div className="mt-14 grid grid-cols-1 gap-14 md:mt-20 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <ContactInfo />
          </div>
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
