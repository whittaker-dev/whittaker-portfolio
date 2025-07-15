import { IProject } from "@/packages/database";
import React from "react";
import ProjectItem from "../ProjectItem";

type Props = {
  projects: IProject[];
};

const ProjectList = React.memo(({ projects }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 md:px-0">
      {projects.map((project, index) => (
        <ProjectItem key={project.id} project={project} index={index} />
      ))}
    </div>
  );
});
ProjectList.displayName = "ProjectList";
export default ProjectList;
