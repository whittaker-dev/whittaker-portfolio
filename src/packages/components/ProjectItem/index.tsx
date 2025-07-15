import { IProject } from "@/packages/database";
import Image from "next/image";
import React from "react";
import { motion } from "motion/react";
type Props = {
  project: IProject;
  index: number;
};

const ProjectItem = React.memo(({ project, index }: Props) => {
  const { title, coverImage } = project;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{
        opacity: 1,
        scale: 1,
        transition: { duration: 0.5, delay: index * 0.1, ease: "circOut" },
      }}
      whileHover={{ scale: 1.05 }}
      className="border border-gray-200 rounded-lg shadow cursor-pointer"
    >
      <div className="relative size-full h-64 lg:h-52  overflow-hidden rounded-tl-lg rounded-tr-lg">
        <Image src={coverImage} alt={title} fill objectFit="cover" />
      </div>
      <div className="p-4">
        <h3>{title}</h3>
      </div>
    </motion.div>
  );
});

ProjectItem.displayName = "ProjectItem";
export default ProjectItem;
