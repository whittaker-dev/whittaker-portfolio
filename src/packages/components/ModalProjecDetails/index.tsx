import {
  IPlayfulTodolistItem,
  PlayfulTodolist,
} from "@/components/animate-ui/ui-elements/playful-todolist";
import { IProject } from "@/packages/database";
import { Icon } from "@iconify/react";
import { t } from "i18next";
import Image from "next/image";
import CarouselBase from "../CarouselBase";
import ModalBase from "../ModalBase";

type Props = {
  project: IProject;
  isOpen: boolean;
  onClose: () => void;
};

const ModalProjectDetails = ({ project, isOpen, onClose }: Props) => {
  const featuresConverted: IPlayfulTodolistItem[] = project.features.map(
    (feature, index) => ({
      id: index,
      label: feature,
    }),
  );

  return (
    <ModalBase
      isOpen={isOpen}
      title={
        <p className="text-base lg:text-lg font-bold font-boldonse text-green-primary">
          {project.title}
        </p>
      }
      onClose={onClose}
      contentClassName={
        "min-w-[90%] md:min-w-[768px] lg:min-w-[1024px] dark:bg-gradient-to-tl from-blue-primary to-dark-primary p-2.5 md:p-4"
      }
      content={
        <div className="flex items-center justify-between gap-8 md:gap-10 lg:gap-20 pr-2 flex-col-reverse lg:flex-row">
          {/* ==== PROJECT DESCRIPTION ==== */}
          <div className="flex-1 lg:max-h-[600px] lg:overflow-y-auto lg:pb-2 lg:pr-4">
            <div className="space-y-4">
              <p className="text-center lg:text-left text-xs md:text-sm font-medium text-gray-600 dark:text-white">
                {project.description}
              </p>
            </div>
            <div className="mt-4">
              <h1 className="text-sm md:text-base font-bold text-dark-primary dark:text-white">
                {t("tech_stacks")}
              </h1>
              <div className="flex items-center justify-start gap-2 mt-2 flex-wrap">
                {project.techStacks.map((tech, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-center px-3 py-1 text-[10px] md:text-xs font-medium bg-white dark:bg-transparent border border-gray-200 text-green-primary rounded-full"
                  >
                    {tech}
                  </div>
                ))}
              </div>
            </div>

            {/* ==== Features ==== */}
            <div className="mt-4 space-y-2">
              <h1 className="text-sm md:text-base font-bold text-dark-primary dark:text-white">
                {t("features")}
              </h1>
              <PlayfulTodolist checkboxItems={featuresConverted} />
            </div>
          </div>

          {/* ==== PROJECT SCREENSHOTS ==== */}
          <div className="flex-1 lg:mr-10 w-full flex items-center justify-center flex-col">
            <CarouselBase
              rootClassName="size-[200px] md:size-[350px] lg:size-full"
              items={project.screenshots.map((image) => ({
                id: image,
                content: (
                  <div className="relative aspect-square flex items-center justify-center border border-gray-200 rounded-lg cursor-pointer">
                    <Image
                      src={image}
                      alt={project.title}
                      fill
                      className="rounded-lg object-cover"
                    />
                  </div>
                ),
              }))}
            />
            <div className="flex items-center justify-center gap-4 mt-4 w-full">
              {project.liveDemo && (
                <a
                  href={project.liveDemo}
                  target="_blank"
                  className="flex-1 flex items-center justify-center bg-black text-white text-xs md:text-sm font-normal gap-2 rounded md:rounded-lg border border-black h-10 md:h-12 cursor-pointer hover:bg-black/80"
                >
                  <Icon
                    icon="eva:external-link-outline"
                    className="size-4 text-white"
                  />
                  {t("live_demo")}
                </a>
              )}
              {project.githubLink && (
                <a
                  href={project.githubLink}
                  className="flex-1 flex items-center justify-center border border-gray-200 text-xs md:text-sm font-normal gap-2 rounded md:rounded-lg h-10 md:h-12 cursor-pointer hover:bg-gray-50 bg-white"
                >
                  <Icon
                    icon="mdi:github"
                    className="size-4 text-dark-primary hover:border-blue-primary transition-all duration-200 ease-linear dark:text-dark-primary"
                  />
                  Github
                </a>
              )}
            </div>
          </div>
        </div>
      }
    />
  );
};

export default ModalProjectDetails;
