import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion"; // ✅ useInView from framer-motion
import { SectionHeader } from "@/packages/components";
import { t } from "i18next";
import ProjectList from "@/packages/components/ProjectList";
import { projects } from "@/packages/database";
import { SlidingNumber } from "@/components/animate-ui/text/sliding-number";
import { Progress, ProgressTrack } from "@/components/animate-ui/base/progress";

const Projects = () => {
  const [progress, setProgress] = useState(0);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true });
  const stepper = 25;

  useEffect(() => {
    if (!isInView || progress >= 100) return;
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + stepper));
    }, 500);
    return () => clearInterval(timer);
  }, [isInView, progress]);

  const isFinished = progress >= 100;

  return (
    <motion.section
      id="projects"
      className="my-56"
      ref={sectionRef}
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

      <motion.div
        animate={{
          opacity: isFinished ? 0 : 1,
          scale: isFinished ? 0 : 1,
          display: isFinished ? "none" : "flex",
          transition: { duration: 0.5 },
        }}
        className="flex items-center justify-center mt-10"
      >
        <Progress value={progress} className="w-[300px] space-y-2">
          <div className="flex items-center justify-between gap-1">
            <h1 className="text-base lg:text-xl font-medium text-green-600 dark:text-white">
              {t("waiting")}
            </h1>
            <div className="flex items-center justify-end gap-2 text-xl lg:text-3xl font-bold text-green-600 dark:text-white">
              <SlidingNumber number={progress} padStart />
              <span>%</span>
            </div>
          </div>
          <ProgressTrack className="bg-green-200" />
        </Progress>
      </motion.div>

      <motion.div
        animate={{
          opacity: !isFinished ? 0 : 1,
          scale: !isFinished ? 0 : 1,
          display: !isFinished ? "none" : "block",
          transition: {
            duration: 0.5,
            delay: 0.5,
            ease: "easeOut",
          },
        }}
        className="mt-10"
      >
        <ProjectList projects={projects} />
      </motion.div>
    </motion.section>
  );
};

export default Projects;
