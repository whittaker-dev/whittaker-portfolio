import { AnimatedLinePath, TypeWriter } from "@/packages/components";
import { Icon } from "@iconify/react";
import { t } from "i18next";
import { motion } from "motion/react";

interface ISocialLink {
  name: string;
  link: string;
  icon: string;
}
const HeroSection = () => {
  const fullName = "James Whittaker";
  const headlines = [
    "Software Engineer",
    "Full Stack Developer",
    "AI Enthusiast",
  ];
  const socialLinks: ISocialLink[] = [
    {
      name: "Github",
      link: "https://github.com/whittaker-dev",
      icon: "skill-icons:github-dark",
    },
    {
      name: "Linkedin",
      link: "https://www.linkedin.com/in/minh-tai-a14134228",
      icon: "skill-icons:linkedin",
    },
    {
      name: "Email",
      link: "mailto:minhtai250501@gmail.com",
      icon: "skill-icons:gmail-light",
    },
  ];

  const handleScrollForMore = () => {
    const element = document.getElementById("about");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  return (
    <div className="flex items-center justify-center flex-col mt-20 md:mt-40">
      {/* ==== NAME ==== */}
      <div className="relative mb-4">
        <motion.h1
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mb-3 md:mb-6 text-3xl md:text-5xl font-bold text-green-primary font-boldonse"
        >
          {fullName}
        </motion.h1>
        <AnimatedLinePath />
      </div>

      {/* ==== TYPE WRITER ==== */}
      <TypeWriter titles={headlines} />

      <motion.p
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="w-full md:max-w-1/2 text-center text-sm md:text-base font-normal text-dark-primary mt-3 md:mt-6 dark:text-white"
      >
        Engineering full-stack solutions that blend performance, clean code,
        scalability, and beautiful design.
      </motion.p>

      {/* ==== SOCIAL LINKS ==== */}
      <motion.div className="flex items-center justify-center gap-5 my-10 flex-wrap">
        {socialLinks.map((link, index) => (
          <motion.a
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
            whileHover={{ scale: 1.1, transition: { duration: 0.2, delay: 0 } }}
            key={index}
            href={link.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 border border-gray-300 px-2 md:px-3 py-1 md:py-2 rounded-xl hover:bg-blue-primary/10 shadow-xl"
          >
            <Icon icon={link.icon} className="size-4 md:size-5" />
            <motion.span className="text-sm font-normal text-dark-primary dark:text-white">
              {link.name}
            </motion.span>
          </motion.a>
        ))}
      </motion.div>

      {/* ==== CONTACT BUTTON ==== */}
      <motion.a
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        animate={{
          scale: [1, 1.1, 1],
          transition: { duration: 2, repeat: Infinity },
        }}
        href="#contact"
        rel="noopener noreferrer"
        className="flex items-center justify-center py-3 px-6  border border-gray-300 rounded-xl gap-4 bg-green-300 shadow"
      >
        <motion.div
          className="w-2 h-2 bg-green-primary rounded-full"
          animate={{ scale: [1, 1.4, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.span className="text-sm font-normal text-dark-primary">
          {t("looking_for_your_next_dev")}
        </motion.span>
      </motion.a>

      {/* ==== SCROLL DOWN INDICATOR ==== */}
      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="flex items-center justify-center flex-col mt-10 cursor-pointer"
        onClick={handleScrollForMore}
      >
        <motion.span className="text-[10px] md:text-xs font-normal text-green-primary font-boldonse">
          {t("scroll_for_more")}
        </motion.span>
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Icon
            icon="uil:angle-double-down"
            className="size-5 md:size-6 text-green-primary"
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HeroSection;
