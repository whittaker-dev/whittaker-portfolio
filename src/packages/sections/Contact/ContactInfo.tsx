"use client";
import { contactChannels } from "@/packages/database";
import { Icon } from "@iconify/react";
import { t } from "i18next";
import { motion } from "motion/react";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

const ContactInfo = () => {
  return (
    <div>
      <p className="max-w-[40ch] text-[15px] leading-relaxed text-ink-muted md:text-base">
        {t("contact_info_desc")}
      </p>

      <ul className="mt-8 border-t border-line">
        {contactChannels.map((channel, index) => {
          const content = (
            <>
              <span className="flex size-10 shrink-0 items-center justify-center border border-line text-brand-ink transition-colors group-hover:border-brand-ink">
                <Icon icon={channel.icon} className="size-[18px]" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="label block">{channel.name}</span>
                <span className="mt-0.5 block break-all text-[15px] font-medium text-ink">
                  {channel.value}
                </span>
              </span>
              {channel.link && (
                <Icon
                  icon="ph:arrow-up-right-bold"
                  className="size-4 shrink-0 text-ink-muted transition-[transform,color] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-ink"
                />
              )}
            </>
          );

          return (
            <motion.li
              key={channel.name}
              className="border-b border-line"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.55,
                delay: index * 0.06,
                ease: EASE_OUT_EXPO,
              }}
            >
              {channel.link ? (
                <a
                  href={channel.link}
                  target={
                    channel.link.startsWith("mailto:") ? undefined : "_blank"
                  }
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 py-4"
                >
                  {content}
                </a>
              ) : (
                <div className="group flex items-center gap-4 py-4">
                  {content}
                </div>
              )}
            </motion.li>
          );
        })}
      </ul>

      <p className="mt-8 flex items-center gap-2.5 text-[13px] font-medium text-ink">
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-ink opacity-60 motion-reduce:animate-none" />
          <span className="relative inline-flex size-2 rounded-full bg-brand-ink" />
        </span>
        {t("contact_availability")}
      </p>
    </div>
  );
};

export default ContactInfo;
