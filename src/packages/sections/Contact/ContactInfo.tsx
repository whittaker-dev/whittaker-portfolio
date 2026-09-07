"use client";
import React from "react";
import { Icon } from "@iconify/react";
import { t } from "i18next";
import { motion } from "motion/react";

interface IContactChannel {
  name: string;
  icon: string;
  value: string;
  link: string | null;
}

const channels: IContactChannel[] = [
  {
    name: "email",
    icon: "solar:mailbox-bold",
    value: "minhtai250501@gmail.com",
    link: "mailto:minhtai250501@gmail.com",
  },
  {
    name: "github",
    icon: "mdi:github",
    value: "github.com/whittaker-dev",
    link: "https://github.com/whittaker-dev",
  },
  {
    name: "linkedin",
    icon: "mdi:linkedin",
    value: "linkedin.com/in/minh-tai",
    link: "https://www.linkedin.com/in/minh-tai-a14134228",
  },
  {
    name: "address",
    icon: "solar:map-point-wave-bold",
    value: "Ho Chi Minh City, Vietnam",
    link: null,
  },
];

const ContactInfo = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="flex flex-col gap-4"
    >
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-xl shadow-xl p-6 backdrop-blur-xl dark:border-white/10 border border-dark-primary/10 dark:from-gray-900 dark:via-white/10 dark:to-black">
        <div className="flex items-center justify-start gap-2">
          <Icon
            icon="solar:chat-round-dots-bold"
            className="size-4 md:size-5 text-green-primary"
          />
          <h2 className="text-sm md:text-base font-black text-dark-primary dark:text-white">
            {t("contact_info_title")}
          </h2>
        </div>
        <p className="mt-3 text-xs md:text-sm font-normal text-gray-700 dark:text-white/80">
          {t("contact_info_desc")}
        </p>

        <div className="mt-4 flex flex-col gap-3">
          {channels.map((channel, index) => {
            const content = (
              <>
                <div className="size-7 shrink-0 rounded-full bg-blue-primary flex items-center justify-center">
                  <Icon icon={channel.icon} className="size-4 text-white" />
                </div>
                <span className="text-xs md:text-sm font-medium text-dark-primary dark:text-white break-all">
                  {channel.value}
                </span>
              </>
            );

            return (
              <motion.div
                key={channel.name}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ x: 10, transition: { duration: 0.2 } }}
                viewport={{ once: true }}
              >
                {channel.link ? (
                  <a
                    href={channel.link}
                    target={
                      channel.link.startsWith("mailto:") ? undefined : "_blank"
                    }
                    rel="noopener noreferrer"
                    className="flex items-center justify-start gap-2 rounded-lg border border-gray-200 px-2 py-2 shadow-sm transition-all duration-300 hover:border-green-primary dark:border-white/10"
                  >
                    {content}
                  </a>
                ) : (
                  <div className="flex items-center justify-start gap-2 rounded-lg border border-gray-200 px-2 py-2 shadow-sm dark:border-white/10">
                    {content}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ==== AVAILABILITY ==== */}
      <div className="flex items-center gap-3 rounded-xl bg-green-600 p-4 shadow-xl dark:bg-green-primary">
        <motion.div
          className="size-2 shrink-0 rounded-full bg-white"
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <span className="text-xs md:text-sm font-medium text-white">
          {t("contact_availability")}
        </span>
      </div>
    </motion.div>
  );
};

export default ContactInfo;
