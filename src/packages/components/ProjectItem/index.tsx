import { IProject } from "@/packages/database";
import { Icon } from "@iconify/react";
import { t } from "i18next";
import { motion } from "motion/react";
import Image from "next/image";
import React, { useState } from "react";
import ModalProjectDetails from "../ModalProjecDetails";
type Props = {
  project: IProject;
  index: number;
};

const ProjectItem = React.memo(({ project, index }: Props) => {
  const { title, coverImage, description, techStacks, liveDemo } = project;
  const [isShowProjectDetails, setIsShowProjectDetails] = useState(false);
  const handleShowProjectDetails = () => {
    setIsShowProjectDetails(true);
  };
  const handleCloseProjectDetails = () => {
    setIsShowProjectDetails(false);
  };
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{
        opacity: 1,
        scale: 1,
        transition: {
          duration: 0.5,
          delay: index * 0.1,
          ease: [0.25, 0.75, 0.5, 1.25],
        },
      }}
      className="border border-gray-200 rounded-lg shadow cursor-pointer dark:bg-blend-darken"
    >
      <div className="relative size-full h-64 lg:h-52  overflow-hidden rounded-tl-lg rounded-tr-lg">
        <Image src={coverImage} alt={title} fill objectFit="cover" />
      </div>
      <div className="p-4">
        <div className="space-y-2">
          <h3 className="text-lg lg:text-xl font-bold text-dark-primary dark:text-white">
            {title}
          </h3>
          <p className="text-xs lg:text-sm text-gray-500 line-clamp-2">
            {description}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {techStacks.slice(0, 3).map((tech, index) => (
            <div
              className="flex items-center justify-center px-3 py-0.5 lg:px-4 lg:py-1 text-[10px] lg:text-xs font-medium bg-white border border-gray-200 text-green-primary rounded-full hover:bg-green-primary hover:text-white transition-all"
              key={index}
            >
              {tech}
            </div>
          ))}
          {techStacks.length > 3 && (
            <div className="flex items-center justify-center px-3 py-1 text-[10px] lg:text-xs font-medium bg-white border border-gray-200 text-green-primary rounded-full">
              +{techStacks.length - 3}
            </div>
          )}
        </div>
        <div className="flex items-stretch justify-between mt-4 gap-3">
          <button
            className="flex items-center justify-center gap-2 bg-blue-primary text-center text-white py-2 px-4 rounded-lg flex-1 text-xs lg:text-sm font-bold cursor-pointer hover:opacity-90"
            onClick={handleShowProjectDetails}
          >
            {t("view_details")}
          </button>
          <a
            href={liveDemo}
            className="size-10 flex items-center justify-center border border-gray-300 rounded-lg hover:border-blue-primary transition-all duration-200 ease-linear"
            target="_blank"
          >
            <Icon
              icon="eva:external-link-outline"
              className="size-5 text-dark-primary hover:border-blue-primary transition-all duration-200 ease-linear dark:text-white"
            />
          </a>
        </div>
      </div>
      <ModalProjectDetails
        isOpen={isShowProjectDetails}
        onClose={handleCloseProjectDetails}
        project={project}
      />
    </motion.div>
  );
});

ProjectItem.displayName = "ProjectItem";
export default ProjectItem;
